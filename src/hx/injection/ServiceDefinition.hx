package hx.injection;

import haxe.ds.StringMap;

final class ServiceDefinition implements ServiceGroup {

    private var _types : StringMap<ServiceType>;

    public function new() {
        _types = new StringMap();
    }

    public function add(key : String, type : ServiceType) : Void {
        _types.set(key, type);
    }

    public function getServiceTypes() : StringMap<ServiceType> {
        return _types;
    }
}