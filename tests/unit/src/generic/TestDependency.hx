package generic;

final class TestDependency implements GenericDependency<Int> {

    public function new() { }

	public function getObject() : Int {
        return 5;
    }
}