package iterators;

final class FirstDependency implements Dependency {
    
    public function new() { }

	public function getNumber() : Int {
        return 1;
    }
}