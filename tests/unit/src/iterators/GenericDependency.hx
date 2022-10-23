package iterators;

import hx.injection.Service;

final class GenericDependency<T> implements Service {
    public function new() { }
    public function doThing(t : T) : T {
        return t;
    }
}