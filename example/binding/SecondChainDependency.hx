package example.binding;

final class SecondChainDependency implements ChainedDependency {

    private var _chain : ChainedDependency;

    @:named('chain', 'First')
    public function new(chain : ChainedDependency) {
        _chain = chain;
    }

	public function doThing() {
        trace('Second: Hello');
        _chain.doThing();
    }
}