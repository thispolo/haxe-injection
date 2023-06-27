package consistency;

import hx.injection.Service;

final class ADependency implements Service {

    private var _dependency : BDependency;

    public function new(dependency : BDependency) {
        _dependency = dependency;
    }

    public function id() {
        return _dependency.id();
    }
}