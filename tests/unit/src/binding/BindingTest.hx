package binding;

import utest.Assert;
import hx.injection.ServiceCollection;

final class BindingTest extends utest.Test {
    
    public function testBinding() {
        var collection = new ServiceCollection();
        collection.addSingleton(ChainedDependency, FirstChainDependency);
        collection.addSingleton(ChainedDependency, SecondChainDependency).asBinding();

        var provider = collection.createProvider();
        var firstService = provider.getService(ChainedDependency);
        var secondService = provider.getService(ChainedDependency, SecondChainDependency);

        Assert.equals(firstService.getChain(), secondService);
    }

}