package example.scoping;

import hx.injection.Service;

final class SingletonIDPrinter implements Service {

    private var _id : Int;

    public function new() {
        _id = Math.round(Math.random()*12345678);
    }

    public function id() {
        return _id;
    }
}