package hx.injection;

import haxe.ds.StringMap;

final class ServiceDefinition implements ServiceGroup {

    private var _types : StringMap<Array<ServiceType>>;

    public function new() {
        _types = new StringMap();
    }

    public function add(key : String, type : ServiceType) : Void {
        var serviceArray = _types.get(key);
        if(serviceArray == null) {
            serviceArray = [];
            _types.set(key, serviceArray);
        }
        serviceArray.push(type);
    }

    public function getServiceTypes() : StringMap<Array<ServiceType>> {
        return _types;
    }
}