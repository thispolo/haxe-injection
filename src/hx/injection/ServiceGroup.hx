package hx.injection;

import haxe.ds.StringMap;

interface ServiceGroup {

    public function getServices() : Array<InternalServiceType>;
    public function getServiceAtKey(key : String) : InternalServiceType;

}