package hx.injection;

import haxe.ds.StringMap;

/*
	MIT License

	Copyright (c) 2022 Paul SG Cross

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
 */

class ServiceCollection {

	private var _configs : StringMap<Any>;
	private var _requestedServices : StringMap<ServiceDefinition>;

	public function new() {
		_configs = new StringMap();
		_requestedServices = new StringMap();
	}

	/**
		Add a configuration file to the service collection.
	**/
	public function addConfig<T>(config:T):Void {
		_configs.set(Type.getClassName(Type.getClass(config)), config);
	}

	/**
		Add a singleton service to the collection. A singleton will only ever be the same instance.
	**/
	overload public extern inline function addSingleton<T:Service, V:T>(service:Class<T>, implementation:Class<V>, ?key : Null<String>) : Void {
		var serviceName = Type.getClassName(service);
		var implementationType = ServiceType.Singleton(Type.getClassName(implementation));
		var definition = initialiseDefinition(serviceName);

		definition.add(key==null?ServiceProvider.DefaultType:key, implementationType);
	}

	/**
		Add a singleton service to the collection. A singleton will only ever be the same instance.
	**/
	overload public extern inline function addSingleton<T:Service, V:T>(service:Class<T>):Void {
		var serviceName = Type.getClassName(service);
		var implementationName = ServiceType.Singleton(Type.getClassName(service));
		//_requestedServices.set(serviceName, implementationName);
	}

	/**
		Add a transient service to the collection. Transient services always return as a new instance.
	**/
	overload extern inline public function addTransient<T:Service, V:T>(service:Class<T>, implementation:Class<V>):Void {
		var serviceName = Type.getClassName(service);
		var implementationName = ServiceType.Transient(Type.getClassName(implementation));
		//_requestedServices.set(serviceName, implementationName);
	}

	/**
		Add a transient service to the collection. Transient services always return as a new instance.
	**/
	overload extern inline public function addTransient<T:Service, V:T>(service:Class<T>):Void {
		var serviceName = Type.getClassName(service);
		var implementationName = ServiceType.Transient(Type.getClassName(service));
		//_requestedServices.set(serviceName, implementationName);
	}

	/**
		Add a scoped service to the collection. A scoped service will be the same instance per scope.
	**/
	overload public extern inline function addScoped<T:Service, V:T>(service:Class<T>, implementation:Class<V>):Void {
		var serviceName = Type.getClassName(service);
		var implementationName = ServiceType.Scoped(Type.getClassName(implementation));
		//_requestedServices.set(serviceName, implementationName);
	}

	/**
		Add a scoped service to the collection. A scoped service will be the same instance per scope.
	**/
	overload public extern inline function addScoped<T:Service, V:T>(service:Class<T>):Void {
		var serviceName = Type.getClassName(service);
		var implementationName = ServiceType.Scoped(Type.getClassName(service));
		//_requestedServices.set(serviceName, implementationName);
	}

	/**
		Create the service provider to use the defined service collection in order to generate concrete implementations of services.
	**/
	public function createProvider():ServiceProvider {
		var provider = new ServiceProvider(_configs, cast _requestedServices);

		return provider;
	}

	private function configExists(arg:String):Bool {
		return _configs.get(arg) != null;
	}

	private function initialiseDefinition(type:String) : ServiceDefinition {
		var definition = _requestedServices.get(type);
		if(definition == null) {
			definition = new ServiceDefinition();
			_requestedServices.set(type, definition);
		}
		return definition;
	}

	public function toString():String {
		var string = "\nApplication services:- \n";
		for (service in _requestedServices) {
			string += "\t" + service + "\n";
		}
		return string;
	}
}
