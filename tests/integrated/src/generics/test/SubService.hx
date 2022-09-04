package generics.test;

import hx.injection.Service;

final class SubService implements GenericService<Int> {

    public function new() {
        
    }

    public function doThing(thing : Int) {
        trace(thing);
    }
}