package binding;

final class SecondChainDependency implements ChainedDependency {

    public function new() { }

	public function getChain() : ChainedDependency {
        return null;
    }
    
}