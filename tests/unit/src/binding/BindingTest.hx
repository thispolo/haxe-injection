package binding;

import utest.Assert;
import hx.injection.ServiceCollection;

final class BindingTest extends utest.Test {
    
    public function testBinding() {
        var collection = new ServiceCollection();
        collection.addSingleton(ChainedDependency, FirstChainDependency).asBinding();
        collection.addSingleton(ChainedDependency, SecondChainDependency);

        var provider = collection.createProvider();
        var firstService = provider.getService(ChainedDependency, FirstChainDependency);
        var secondService = provider.getService(ChainedDependency);

        Assert.equals(firstService, secondService.getChain());
    }

}