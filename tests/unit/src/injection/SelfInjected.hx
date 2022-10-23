package injection;

import hx.injection.Service;
import hx.injection.ServiceProvider;

final class SelfInjected implements Service {

    private var _provider : ServiceProvider;
    
    public function new(provider : ServiceProvider) {
        _provider = provider;
    }

    public function get() : ServiceProvider {
        return _provider;
    }

}