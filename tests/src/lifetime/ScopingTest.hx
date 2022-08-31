package lifetime;

import utest.Assert;
import hx.injection.ServiceCollection;

final class ScopingTest extends utest.Test {
    
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
        var scope = provider.newScope();
        var id2 = scope.getService(IDPrinter);
      
        Assert.equals(id1.id(), id2.id());
    }
}