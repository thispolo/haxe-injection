package hx.injection;

import haxe.ds.StringMap;

final class ServiceDefinition implements ServiceGroup {

    private var _bindings : StringMap<Int>;
    private var _services : Array<InternalServiceType>;

    public function new() {
        _bindings = new StringMap();
        _services = new Array();
    }

    public function add(type : InternalServiceType) : Void {
        _services.push(type);
    }

    public function setBinding(key : String) : Void {
        _bindings.set(key, _services.length-1);
    }

    public function getServices() : Array<InternalServiceType> {
        return _services;
    }

    public function getServiceAtKey(key : String) : InternalServiceType {
        return _services[_bindings.get(key)];
    }
}