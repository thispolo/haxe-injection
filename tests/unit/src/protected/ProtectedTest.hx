package protected;

import utest.Assert;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

final class ProtectedTest extends utest.Test {
    
    public function testSingletonEqual() {
        var collection = new ServiceCollection();
        collection.addSingletonProtected(Dependency, MyDependency);
        collection.addSingletonProtected(Dependency, OtherDependency);

        var provider = collection.createProvider();
        var dependencies = provider.getServices(Dependency);
        var array = Lambda.array(dependencies);

        Assert.equals(1, array.length);
    }

}