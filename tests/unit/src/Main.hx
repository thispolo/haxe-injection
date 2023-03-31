final class Main {
    public static function main() {
        utest.UTest.run([
            new injection.InjectionTest(),
            new config.ConfigTest(),
            new lifetime.LifetimeTest(),
            new segregation.SegregationTest(),
            new destructable.DestructableTest(),
            new binding.BindingTest(),
            new iterators.IteratorTest(),
            new generic.GenericTest(),
            new protected.ProtectedTest(),
            new extensions.ExtensionsTest(),
            new utils.UtilsTest(),
            new consistency.ConsistencyTest(),
            new mocking.MockTest()
        ]);
    }
}
