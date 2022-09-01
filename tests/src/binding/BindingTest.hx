package binding;

import utest.Assert;
import hx.injection.ServiceCollection;

final class BindingTest extends utest.Test {
    
    public function testBinding() {
        var collection = new ServiceCollection();
        collection.addSingleton(ChainedDependency, FirstChainDependency, 'First');
        collection.addSingleton(ChainedDependency, SecondChainDependency);
        var provider = collection.createProvider();
        var firstService = provider.getService(ChainedDependency, 'First');
        var secondService = provider.getService(ChainedDependency);
        Assert.equals(firstService, secondService.getChain());
    }

}