package example.binding;

final class FirstChainDependency implements ChainedDependency {
    public function new() {
        
    }

	public function doThing() {
        trace('First: there!');
    }
}