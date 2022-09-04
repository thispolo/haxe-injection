package generics.test;

import hx.injection.Service;

final class GenericService<T> implements Service {

    public function new() {
        
    }

    public function doThing(thing : T) : Void {
        trace(thing);
    }
}