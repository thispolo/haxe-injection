package hx.injection;

import haxe.ds.StringMap;
import hx.injection.generics.GenericDefinition;

class ServiceCollection {

	private var _configs : StringMap<Any>;
	private var _requestedServices : StringMap<ServiceDefinition>;
	private var _instancedServices : StringMap<Service>;

	public function new() {
		_configs = new StringMap();
		_requestedServices = new StringMap();
		_instancedServices = new StringMap();
	}

	/**
		Add a configuration file to the service collection.
	**/
	public function addConfig<T>(config:T):Void {
		_configs.set(Type.getClassName(Type.getClass(config)), config);
	}

	/**
		Add a service to the collection.
	**/
	overload public inline extern function addService<T:Service, V:T>(type : ServiceType, service:Class<T>, implementation:Class<V>):ServiceConfig {
		return handleServiceAdd(type, Type.getClassName(service), implementation);
	}

	/**
		Add an instance of a service to the collection.
	**/
	overload public inline extern function addService<T:Service, V:T>(service:Class<T>, implementation:V):Void {
		handleInstanceAdd(service, implementation);
	}

	/**
		Add a generic service to the collection.
	**/
	overload public inline extern function addService<T:Service, V:T>(type : ServiceType, service : GenericDefinition<T>, implementation : Class<V>) : ServiceConfig {
		return handleServiceAdd(type, service.signature, implementation);
	}

	/**
		Check if the service has an implementation assigned to it
	**/
	overload public inline extern function has<T:Service>(service:Class<T>) : Bool {
		return _requestedServices.exists(Type.getClassName(service));
	}

	/**
		Check if the service has an implementation assigned to it
	**/
	overload public inline extern function has<T:Service>(service:GenericDefinition<T>) : Bool {
		return _requestedServices.exists(service.signature);
	}

	private function handleServiceAdd<T:Service>(type : ServiceType, name : String, implementation:Class<T>):ServiceConfig {
		var serviceName = name;
		var implementationName = Type.getClassName(implementation);
		var implementationType = switch(type) {
			case Singleton:
				InternalServiceType.Singleton(implementationName);
			case Transient:
				InternalServiceType.Transient(implementationName);
			case Scoped:
				InternalServiceType.Scoped(implementationName);
		}

		var definition = initialiseDefinition(serviceName);

		definition.add(implementationType);

		return new ServiceConfig(definition, Type.getClassName(implementation), implementationType);
	}

	private function handleInstanceAdd<T:Service, V:T>(service:Class<T>, instance : V) : Void {
		var serviceName = Type.getClassName(service);

		_instancedServices.set(serviceName, instance);
	}
	/**
		Create the service provider to use the defined service collection in order to generate concrete implementations of services.
	**/
	public function createProvider() : ServiceProvider {
		addService(ServiceType.Singleton, ServiceProvider, ServiceProvider);

		var provider = new ServiceProvider(_configs, cast _requestedServices, _instancedServices);

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
}
