package generics.test;

final class SomeClass extends SomeOtherClass {
	@:autoCtor public function new(service1:GenericService<SomeClass>) {}

	public function call() {
		_service1.doThing(this);
	}
}
