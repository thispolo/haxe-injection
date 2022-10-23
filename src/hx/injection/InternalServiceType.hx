package hx.injection;

enum InternalServiceType {
	Singleton(implementation:String);
	Transient(implementation:String);
	Scoped(implementation:String);
}
