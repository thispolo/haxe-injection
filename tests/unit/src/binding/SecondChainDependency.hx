package binding;

final class SecondChainDependency implements ChainedDependency {

    private var _chain : ChainedDependency;

    @:binding(chain, 'First')
    public function new(chain : ChainedDependency) {
        _chain = chain;
    }

	public function getChain() : ChainedDependency {
        return _chain;
    }
}