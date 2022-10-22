package binding;

final class FirstChainDependency implements ChainedDependency {

    private var _chain : ChainedDependency;

    @:binding(chain, binding.SecondChainDependency)
    public function new(chain : ChainedDependency) {
        _chain = chain;
    }

	public function getChain() : ChainedDependency {
        return _chain;
    }
}