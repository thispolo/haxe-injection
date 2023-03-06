package utils;

import hx.injection.Service;

final class TestService implements Service {
    public function new(service : InjectedService) {}

    public function injected() : InjectedService {
        return null;
    }
}