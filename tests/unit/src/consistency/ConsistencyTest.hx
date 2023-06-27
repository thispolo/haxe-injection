package consistency;

import utest.Assert;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

final class ConsistencyTest extends utest.Test {
    
    public function testSingletonIntoSingleton() {
        var collection = new ServiceCollection();
        collection.addSingleton(ADependency);
        collection.addSingleton(BDependency);

        var provider = collection.createProvider();
        var dependency = provider.getService(ADependency);

        Assert.equals(3, dependency.id());
    }

    public function testTransientIntoSingleton() {
        var collection = new ServiceCollection();
        collection.addSingleton(ADependency);
        collection.addTransient(BDependency);

        var provider = collection.createProvider();

        Assert.raises(() -> provider.getService(ADependency), haxe.Exception);
    }

    public function testSingletonIntoTransient() {
        var collection = new ServiceCollection();
        collection.addTransient(ADependency);
        collection.addSingleton(BDependency);

        var provider = collection.createProvider();
        var dependency = provider.getService(ADependency);

        Assert.equals(3, dependency.id());
    }

    public function testScopedIntoSingleton() {
        var collection = new ServiceCollection();
        collection.addSingleton(ADependency);
        collection.addScoped(BDependency);

        var provider = collection.createProvider();

        Assert.raises(() -> provider.getService(ADependency), haxe.Exception);
    }

    public function testSingletonIntoScoped() {
        var collection = new ServiceCollection();
        collection.addScoped(ADependency);
        collection.addSingleton(BDependency);

        var provider = collection.createProvider();
        var dependency = provider.getService(ADependency);

        Assert.equals(3, dependency.id());
    }

}