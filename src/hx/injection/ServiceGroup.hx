package hx.injection;

import haxe.ds.StringMap;

interface ServiceGroup {

    public function getServices() : Array<ServiceType>;
    public function getServiceAtKey(key : String) : ServiceType;

}