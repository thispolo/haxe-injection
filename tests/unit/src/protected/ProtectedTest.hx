package protected;

import utest.Assert;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

final class ProtectedTest extends utest.Test {
    
    public function testSingletonEqual() {
        var collection = new ServiceCollection();
        collection.addSingleton(Dependency, MyDependency);
        collection.addSingleton(Dependency, OtherDependency);

        var provider = collection.createProvider();
        var dependency = provider.getService(Dependency);
      
        Assert.equals(dependency.id(), 5);
    }

}