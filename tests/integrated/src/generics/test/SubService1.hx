package generics.test;

final class SubService1 implements GenericService<Int> {

    public function new() { }

    public function doThing(thing : Int) {
        trace(thing);
    }
}