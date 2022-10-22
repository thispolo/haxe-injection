package iterators;

import hx.injection.Service;

final class TestDependency implements Service {
    
    private var _dependencies : Iterable<GenericDependency<Int>>;

    public function new(dependency : Iterable<GenericDependency<Int>>) {
        _dependencies = dependency;
    }

	public function doThing() : Int {
        var out = 0;
        for(dependency in _dependencies) {
            out += dependency.doThing(1);
        }
        return out;
    }
}