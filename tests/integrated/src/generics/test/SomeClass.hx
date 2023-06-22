package generics.test;

final class SomeClass extends SomeOtherClass {
	@:autoCtor public function new(service:GenericService<SomeClass>) {}

	public function call() {
		_service.doThing(this);
	}
}
