package example.basictest;

import hx.injection.Service;

final class AnotherService implements Service {
    public function new() { }
    public function getString() : String {
        return 'Hello';
    }
}