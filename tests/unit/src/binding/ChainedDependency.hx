package binding;

import hx.injection.Service;

interface ChainedDependency extends Service {
    public function getChain() : ChainedDependency;
}