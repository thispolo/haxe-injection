package hx.injection;

final class ServiceConfig {

	private var _definition : ServiceDefinition;
	private var _type : String;
	private var _implementation : InternalServiceType;

	public function new(definition : ServiceDefinition, type : String, implementation : InternalServiceType) {
		_definition = definition;
		_type = type;
		_implementation = implementation;
	}

	/**
		Bind this service to it's implementation.
		This can then be used to inject this specific implementation into a given class using the `@:binding` metadata.
	**/
	public function asBinding() {
		_definition.setBinding(_type);
	}
}
