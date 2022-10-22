final class Main {
    public static function main() {
        utest.UTest.run([
        //    new injection.InjectionTest(),
        //    new config.ConfigTest(),
        //    new lifetime.LifetimeTest(),
        //    new segregation.SegregationTest(),
        //    new destructable.DestructableTest(),
            new binding.BindingTest(),
        //    new iterators.IteratorTest()
        ]);
    }
}