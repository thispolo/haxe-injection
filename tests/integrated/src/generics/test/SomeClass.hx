package generics.test;

import hx.injection.Service;

final class SomeClass implements Service {

    private var _service1 : GenericService<SomeClass>;
    private var _service2 : GenericService<Int>;

    public function new(service1 : GenericService<SomeClass>, service2 : GenericService<Int>) {
        _service1 = service1;
        _service2 = service2;
    }

    public function call() {
        _service1.doThing(this);
        _service2.doThing(5);

        trace(_service1);
    }
}