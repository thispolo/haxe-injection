package binding;

final class FirstChainDependency implements ChainedDependency {
    public function new() {
        
    }

	public function getChain() : ChainedDependency {
        return null;
    }
}