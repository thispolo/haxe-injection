final class Main {
    public static function main() {
        utest.UTest.run([
            new lifetime.ScopingTest()
        ]);
    }
}