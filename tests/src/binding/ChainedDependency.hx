package example.binding;

import hx.injection.Service;

interface ChainedDependency extends Service {
    public function doThing() : Void;
}