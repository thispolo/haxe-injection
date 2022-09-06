package generics.test;

import hx.injection.Service;

interface GenericService<T> extends Service {

    public function doThing(thing : T) : Void;
    
}