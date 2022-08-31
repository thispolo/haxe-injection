package hx.injection;

import hx.injection.Destructable;
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
final class ServiceProvider implements Destructable {

	private var _requestedConfigs:StringMap<Any>;
	private var _requestedServices:StringMap<ServiceGroup>;

	private var _resolvedSingletonOrder : Array<String>;
	private var _resolvedSingletons : StringMap<Service>;
	
	private var _resolvedScopeOrder : Array<String>;
	private var _resolvedScopes : StringMap<Service>;

	public function new(configs : StringMap<Any>, services : StringMap<ServiceGroup>) {
		_requestedConfigs = configs;
		_requestedServices = services;

		_resolvedSingletonOrder = new Array();
		_resolvedSingletons = new StringMap();
		
		_resolvedScopeOrder = new Array();
		_resolvedScopes = new StringMap();
	}

	/**
		Fetch a service implementation by its abstraction.
	**/
	public function getService<S:Service>(service:Class<S>, ?key : Null<String>):S {
		var key = key == null?ServiceProvider.DefaultType:key;
		var serviceName = Type.getClassName(service);
		var requestedGroup = _requestedServices.get(serviceName);
		var requestedService = requestedGroup.getServiceTypes().get(key);
		if (requestedService == null) {
			throw new haxe.Exception("Service of type \'" + service + "\' not found.");
		}

		var implementation = handleServiceRequest(requestedService);

		return Std.downcast(implementation, service);
	}

	/**
		Create a new scope on the provider.
	**/
	public function newScope() : ServiceProvider {
		destroyScopes();
		_resolvedScopes = new StringMap();
		return this;
	}

	private function handleServiceRequest(serviceType:ServiceType):Service {
		switch (serviceType) {
			case Singleton(implementation):
				return handleSingletonService(implementation);
			case Transient(implementation):
				return handleTransientService(implementation);
			case Scoped(implementation):
				return handleScopedService(implementation);
			default:
		}
	}

	private function handleSingletonService(implementation:String):Service {
		var instance = getSingleton(implementation);
		if (instance == null) {
			instance = buildDependencyTree(implementation);
			_resolvedSingletonOrder.insert(0, implementation);
			_resolvedSingletons.set(implementation, instance);
		}
		return instance;
	}

	private function handleTransientService(implementation:String):Service {
		return buildDependencyTree(implementation);
	}

	private function handleScopedService(implementation:String):Service {
		var instance = getScoped(implementation);
		if (instance == null) {
			instance = buildDependencyTree(implementation);
			_resolvedScopeOrder.insert(0, implementation);
			_resolvedScopes.set(implementation, instance);
		}
		return instance;
	}

	private function buildDependencyTree(service:String):Service {
		var dependencies = [];
		var args = getServiceArgs(service);
		for (arg in args) {
			var dependency = getRequestedService(arg);
			if (dependency != null) {
				var serviceInstance = handleServiceRequest(dependency);
				dependencies.push(serviceInstance);
				continue;
			}

			var config = getRequestedConfig(arg);
			if (config != null) {
				dependencies.push(config);
				continue;
			}

			throw new haxe.Exception('Dependency ' + arg + ' for ' + service + ' is missing. Did you add it to the collection?');
		}

		return Type.createInstance(Type.resolveClass(service), dependencies);
	}

	private function getServiceArgs(service:String):Array<String> {
		var type = Type.resolveClass(service);
		var instance = Type.createEmptyInstance(type);
		return instance.getConstructorArgs();
	}

	private function getSingleton(serviceName:String):Service {
		return _resolvedSingletons.get(serviceName);
	}

	private function getScoped(serviceName:String):Service {
		return _resolvedScopes.get(serviceName);
	}

	private function getRequestedConfig(config:String):Any {
		return _requestedConfigs.get(config);
	}

	private function getRequestedService(serviceName:String):ServiceType {
		var serviceDefinition = serviceName.split('|');
		var serviceName = serviceDefinition[0];
		var key = (serviceDefinition[1] != null) ? serviceDefinition[1] : ServiceProvider.DefaultType;
		var requested = _requestedServices.get(serviceName);
		if(requested != null) {
			return requested.getServiceTypes().get(key);
		}
		return null;
	}

	public function destroy() : Void {
		destroyScopes();
		destroySingletons();

		_requestedConfigs = null;
		_requestedServices = null;
		_resolvedSingletons = null;
		_resolvedScopes = null;
	}

	private function destroySingletons() : Void {
		for(key in _resolvedSingletonOrder) {
			var singleton = _resolvedSingletons.get(key);
			if(Std.isOfType(singleton, Destructable)) {
				cast(singleton, Destructable).destroy();
			}
		}
	}

	private function destroyScopes() : Void {
		for(key in _resolvedScopeOrder) {
			var scope = _resolvedSingletons.get(key);
			if(Std.isOfType(scope, Destructable)) {
				cast(scope, Destructable).destroy();
			}
		}
	}

	public static inline var DefaultType : String = '';

}
