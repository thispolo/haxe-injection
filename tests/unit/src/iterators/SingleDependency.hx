package iterators;

import hx.injection.Service;

final class SingleDependency implements Service {

    private var _dependencies : Dependency;

    public function new(dependencies : Dependency) {
        _dependencies = dependencies;
    }

	public function result() : Int {
        return _dependencies.getNumber();
    }
    
}