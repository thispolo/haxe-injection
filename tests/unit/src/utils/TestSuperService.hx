package utils;

import hx.injection.Service;

class TestSuperService implements Service {
    
    private var _value : Int;

    @:autoCtor public function new(service : InjectedService) {
        _value = 5;
    }

    public function injected() : InjectedService {
        return _service;
    }

    public function value() : Int {
        return _value;
    }
}