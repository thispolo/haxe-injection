package config;

import hx.injection.Service;

final class ConfiguredService implements Service {

    private var _config : Config;
    
    public function new(config : Config) : Void {
        _config = config;
    }

    public function getValue() : String {
        return _config.word;
    }
}