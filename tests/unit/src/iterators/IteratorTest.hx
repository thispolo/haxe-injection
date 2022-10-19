package iterators;

import utest.Assert;
import hx.injection.ServiceCollection;

final class IteratorTest extends utest.Test {
    
    public function testIterators() {
        var collection = new ServiceCollection();
        collection.addSingleton(Dependency, FirstDependency);
        collection.addSingleton(Dependency, SecondDependency);
        collection.addSingleton(Dependency, ThirdDependency);
        collection.addSingleton(SumDependency);

        var provider = collection.createProvider();
        var service = provider.getService(SumDependency);

        Assert.equals(service.result(), 6);
    }
    
    public function testFirst() {
        var collection = new ServiceCollection();
        collection.addSingleton(Dependency, FirstDependency);
        collection.addSingleton(Dependency, SecondDependency);
        collection.addSingleton(Dependency, ThirdDependency);
        collection.addSingleton(SingleDependency);

        var provider = collection.createProvider();
        var service = provider.getService(SingleDependency);

        Assert.equals(service.result(), 1);
    }

}