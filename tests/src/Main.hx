final class Main {
    public static function main() {
        utest.UTest.run([
            new injection.InjectionTest(),
            new lifetime.LifetimeTest(),
            new segregation.SegregationTest(),
            new destructable.DestructableTest(),
            new binding.BindingTest()
        ]);
    }
}