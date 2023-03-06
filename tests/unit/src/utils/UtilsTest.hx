package utils;

import hx.injection.ServiceType;
import utest.Assert;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

final class UtilsTest extends utest.Test {
    
    public function testUtils() {
        var collection = new ServiceCollection();
        collection.addSingleton(TestService);
        collection.addSingleton(InjectedService);

        var provider = collection.createProvider();
        var test = provider.getService(TestService);
        var injected = provider.getService(InjectedService);
        Assert.equals(test.injected(), injected);
    }

}