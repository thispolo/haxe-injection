package hx.injection;

import haxe.ds.StringMap;

final class ServiceDefinition implements ServiceMetadata implements ServiceGroup {

    private var _current : ServiceType;
    private var _types : StringMap<ServiceType>;

    public function new() {
        _types = new Map();
    }

    public function asKey(key : String) : Void {
        _types.set(key, _current);
        _current = null;
    }

    public function setCurrent(type : ServiceType) : Void {
        _current = type;
    }

    public function finalise() : Void {
        if(_current != null)
            _types.set('@DefaultService', _current);
    }

    public function getServiceTypes() : StringMap<ServiceType> {
        return _types;
    }
}