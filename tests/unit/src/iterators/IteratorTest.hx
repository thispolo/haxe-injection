package iterators;

import hx.injection.generics.Generic;
import utest.Assert;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

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

    
    public function testGeneric() {
        var collection = new ServiceCollection();
        collection.addSingleton(Generic.of(GenericDependency, Int));
        collection.addSingleton(Generic.of(GenericDependency, Int));
        collection.addSingleton(Generic.of(GenericDependency, Int));
        collection.addSingleton(TestDependency);

        var provider = collection.createProvider();
        var service = provider.getService(TestDependency);

        Assert.equals(service.doThing(), 3);
    }
}