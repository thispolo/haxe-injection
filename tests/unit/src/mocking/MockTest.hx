package mocking;

import utest.Assert;
import hx.injection.testing.Mock;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

final class MockTest extends utest.Test {
    
    public function testMock() {
        var collection = new ServiceCollection();
        collection.addSingleton(NumberService, Mock.of(mocking.NumberService, id, {
            return 5 + arg;
        }));

        var provider = collection.createProvider();
        var service = provider.getService(NumberService);
      
        Assert.equals(10, service.id(5));
    }

}