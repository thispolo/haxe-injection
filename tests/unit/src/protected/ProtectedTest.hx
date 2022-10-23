package protected;

import utest.Assert;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

final class ProtectedTest extends utest.Test {
    
    public function testSingleton() {
        var collection = new ServiceCollection();
        collection.addSingletonProtected(Dependency, MyDependency);
        collection.addSingletonProtected(Dependency, OtherDependency);

        var provider = collection.createProvider();
        var dependencies = provider.getServices(Dependency);
        var array = Lambda.array(dependencies);

        Assert.equals(1, array.length);
    }

    public function testTransient() {
        var collection = new ServiceCollection();
        collection.addTransientProtected(Dependency, MyDependency);
        collection.addTransientProtected(Dependency, OtherDependency);

        var provider = collection.createProvider();
        var dependencies = provider.getServices(Dependency);
        var array = Lambda.array(dependencies);

        Assert.equals(1, array.length);
    }

    public function testScoped() {
        var collection = new ServiceCollection();
        collection.addScopedProtected(Dependency, MyDependency);
        collection.addScopedProtected(Dependency, OtherDependency);

        var provider = collection.createProvider();
        var dependencies = provider.getServices(Dependency);
        var array = Lambda.array(dependencies);

        Assert.equals(1, array.length);
    }

}