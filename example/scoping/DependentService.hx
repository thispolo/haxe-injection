package example.scoping;

import hx.injection.Service;

final class DependentService implements Service {

    private var _singletonID : SingletonIDPrinter;
    private var _transientID : TransientIDPrinter;
    private var _scopedID : ScopedIDPrinter;

    public function new(singletonID : SingletonIDPrinter, transientID : TransientIDPrinter, scopedID : ScopedIDPrinter) {
        _singletonID = singletonID;
        _transientID = transientID;
        _scopedID = scopedID;
    }

    public function print() : Void {
        trace('Singleton: ${_singletonID.id()}');
        trace('Transient: ${_transientID.id()}');
        trace('Scoped: ${_scopedID.id()}');
    }
}