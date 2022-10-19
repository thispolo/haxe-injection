package hx.injection;

import haxe.ds.StringMap;

interface ServiceGroup {

    public function getServiceTypes() : StringMap<Array<ServiceType>>;

}