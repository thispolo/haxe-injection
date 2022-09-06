package generics.test;

final class SubService2 implements GenericService<SomeClass> {

    public function new() { }

    public function doThing(thing : SomeClass) {
        trace(thing);
    }
}