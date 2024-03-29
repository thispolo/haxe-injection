package iterators;

import hx.injection.Service;

final class SumDependency implements Service {

    private var _dependencies : Iterable<Dependency>;

    public function new(dependencies : Iterable<Dependency>) {
        _dependencies = dependencies;
    }

	public function result() : Int {
        var out = 0;
        for(dependency in _dependencies) {
            out += dependency.getNumber();
        }
        return out;
    }
    
}