package generics.test;

import hx.injection.Service;

final class SomeClass implements Service {

    private var _service : GenericService<Int>;

    public function new(service : GenericService<Int>) {
        _service = service;
    }

    public function call() {
        _service.doThing(5);

        trace(_service);
    }
}