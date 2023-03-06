package generics.test;

import hx.injection.Service;

final class SomeClass extends SomeOtherClass {

    private var _service1 : GenericService<Int>;
    private var _service2 : GenericService<SomeClass>;

    public function new(service1 : GenericService<Int>, service2 : GenericService<SomeClass>) {
        _service1 = service1;
        _service2 = service2;
    }

    public function call() {
        _service1.doThing(5);
        _service2.doThing(this);
    }
}