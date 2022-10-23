package hx.injection;

import hx.injection.generics.GenericDefinition;
import hx.injection.Destructable;
import haxe.ds.StringMap;

final class ServiceProvider implements Destructable implements Service {

	private var _requestedConfigs:StringMap<Any>;
	private var _requestedServices:StringMap<ServiceGroup>;
	private var _requestedInstances:StringMap<Service>;

	private var _resolvedSingletonOrder : Array<String>;
	private var _resolvedSingletons : StringMap<Service>;
	
	private var _resolvedScopeOrder : Array<String>;
	private var _resolvedScopes : StringMap<Service>;

	public function new(configs : StringMap<Any>, services : StringMap<ServiceGroup>, instances : StringMap<Service>) {
		_requestedConfigs = configs;
		_requestedServices = services;
		_requestedInstances = instances;

		_resolvedSingletonOrder = new Array();
		_resolvedSingletons = new StringMap();
		
		_resolvedScopeOrder = new Array();
		_resolvedScopes = new StringMap();

		registerSelf();
	}

	private function registerSelf() {
		var name = Type.getClassName(ServiceProvider);
		_resolvedSingletonOrder.push(name);
		_resolvedSingletons.set(name, this);
	}

	/**
		Fetch a service implementation by its abstraction.
	**/
	overload public inline extern function getService<S:Service>(service:Class<S>, ?binding : Null<Class<S>>):S {
		return handleGetService(Type.getClassName(service), service, binding);
	}

	/**
		Fetch a service implementation by its abstraction.
	**/
	overload public inline extern function getService<S:Service>(service:GenericDefinition<S>, ?binding : Null<Class<S>>):S {
		return handleGetService(service.signature, service.basetype, binding);
	}

	/**
		Fetch an iterator of services by its abstraction.
	**/
	overload public inline extern function getServices<S:Service>(service:Class<S>):Iterable<S> {
		return handleGetServices(Type.getClassName(service), service);
	}

	/**
		Fetch an iterator of services by its abstraction.
	**/
	overload public inline extern function getServices<S:Service>(service:GenericDefinition<S>):Iterable<S> {
		return handleGetServices(service.signature, service.basetype);
	}

	private function handleGetService<S:Service>(name : String, service:Class<S>, ?binding : Null<Class<S>>):S {
		var serviceName = name;
		var instance = _requestedInstances.get(name);
		if(instance != null)
			return Std.downcast(instance, service);

		var requestedGroup = _requestedServices.get(serviceName);
		var requestedService = null;
		switch(binding) {
			case null:
				requestedService = requestedGroup.getServices()[0];
			default:
				requestedService = requestedGroup.getServiceAtKey(Type.getClassName(binding));
		}
		
		if (requestedService == null) {
			throw new haxe.Exception('Service of type \'${serviceName}\' not found.');
		}

		var implementation = handleServiceRequest(requestedService);

		return Std.downcast(implementation, service);
	}

	private function handleGetServices<S:Service>(name : String, service:Class<S>):Iterable<S> {
		var serviceName = name;
		var requestedGroup = _requestedServices.get(serviceName);

		var services = [];
		var requestedServices = requestedGroup.getServices();
		
		if (requestedServices == null) {
			throw new haxe.Exception('Service of type \'${serviceName}\' not found.');
		}

		for(service in requestedServices) {
			services.push(handleServiceRequest(service));
		}
		
		return cast services;
	}

	/**
		Create a new scope on the provider.
	**/
	public function newScope() : ServiceProvider {
		destroyScopes();
		_resolvedScopes = new StringMap();
		return this;
	}

	private function handleServiceRequest(serviceType:InternalServiceType):Service {
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
		var dependencies : Array<Dynamic> = [];
		var args = getServiceArgs(service);
		for (arg in args) {
				var reg = ~/Iterable\((.+)\)/;
				switch (reg.match(arg)) {
					case true:
						var type = reg.matched(1);
						var dependencyArray = getRequestedService(type);
						if (dependencyArray != null) {
							var iterator = [];
							for(dependency in dependencyArray) {
								iterator.push(handleServiceRequest(dependency));
							}
							dependencies.push(iterator);
							continue;
						}
					case false:
						var binding = arg.split('|');
						var serviceType = null;
						switch(binding.length) {
							case 2:
								serviceType = getBoundService(binding[0], binding[1]);
							default:
								serviceType = getRequestedService(arg) != null 
								? getRequestedService(arg)[0] 
								: null;
						}
						
						if (serviceType != null) {
							var serviceInstance = handleServiceRequest(serviceType);
							dependencies.push(serviceInstance);
							continue;
						}
				}

			var config = getRequestedConfig(arg);
			if (config != null) {
				dependencies.push(config);
				continue;
			}

			throw new haxe.Exception('Dependency ' + arg + ' for ' + service + ' is missing. Did you add it to the collection?');
		}

		var cl = Type.resolveClass(service);
		if(cl != null) 
			return Type.createInstance(cl, dependencies);
		else throw new haxe.Exception('Cannot resolve ${service} into a class.');
	}

	private function getServiceArgs(service:String) : Array<String> {
		var type = Type.resolveClass(service);
		var instance = Type.createEmptyInstance(type);
		return (instance.getConstructorArgs() : Array<String>);
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

	private function getRequestedService(serviceName:String):Array<InternalServiceType> {
		var requested = _requestedServices.get(serviceName);
		if(requested != null) {
			return requested.getServices();
		}
		return null;
	}

	private function getBoundService(serviceName:String, key : String):InternalServiceType {
		var requested = _requestedServices.get(serviceName);
		
		return requested.getServiceAtKey(key);
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
			if(Std.isOfType(singleton, Destructable) && singleton != this) {
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

typedef ServiceArg = {
	var name : String;
	@:optional var params : Array<String>;
}