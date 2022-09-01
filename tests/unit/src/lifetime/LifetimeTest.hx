package lifetime;

import utest.Assert;
import hx.injection.ServiceCollection;

final class LifetimeTest extends utest.Test {
    
    public function testSingletonEqual() {
        var collection = new ServiceCollection();
        collection.addSingleton(IDPrinter);
        var provider = collection.createProvider();
        var id1 = provider.getService(IDPrinter);
        provider.newScope();
        var id2 = provider.getService(IDPrinter);
      
        Assert.equals(id1.id(), id2.id());
    }

    public function testTransientNotEqual() {
        var collection = new ServiceCollection();
        collection.addTransient(IDPrinter);
        var provider = collection.createProvider();
        var id1 = provider.getService(IDPrinter);
        var id2 = provider.getService(IDPrinter);
      
        Assert.notEquals(id1.id(), id2.id());
    }

    public function testScopedEqual() {
        var collection = new ServiceCollection();
        collection.addScoped(IDPrinter);
        var provider = collection.createProvider();
        var id1 = provider.getService(IDPrinter);
        var id2 = provider.getService(IDPrinter);
      
        Assert.equals(id1.id(), id2.id());
    }

    public function testScopedNotEqual() {
        var collection = new ServiceCollection();
        collection.addScoped(IDPrinter);
        var provider = collection.createProvider();

        var id1 = provider.getService(IDPrinter);
        provider.newScope();
        var id2 = provider.getService(IDPrinter);
      
        Assert.notEquals(id1.id(), id2.id());
    }
}