package iterators;

import utest.Assert;
import hx.injection.ServiceCollection;

final class IteratorTest extends utest.Test {
    
    public function testBinding() {
        var collection = new ServiceCollection();
        collection.addSingleton(Dependency, FirstDependency);
        collection.addSingleton(Dependency, SecondDependency);
        collection.addSingleton(Dependency, ThirdDependency);
        collection.addSingleton(SumDependency);

        var provider = collection.createProvider();
        var service = provider.getService(SumDependency);

        Assert.equals(service.result(), 6);
    }

}