package destructable;

import utest.Assert;
import hx.injection.ServiceCollection;

final class DestructableTest extends utest.Test {
    
    public function testSingletonCreated() {
        var collection = new ServiceCollection();
        collection.addSingleton(DestructableService, ConcreteDestructableService);
        var provider = collection.createProvider();
        var service = provider.getService(DestructableService);
        Assert.notNull(service.getMeme());
    }

    public function testSingletonDestroyed() {
        var collection = new ServiceCollection();
        collection.addSingleton(DestructableService, ConcreteDestructableService);
        var provider = collection.createProvider();
        var service = provider.getService(DestructableService);
        provider.destroy();
        Assert.isNull(service.getMeme());
    }

}