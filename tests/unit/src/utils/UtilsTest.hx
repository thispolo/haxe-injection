package utils;

import hx.injection.ServiceType;
import utest.Assert;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

final class UtilsTest extends utest.Test {
    
    public function testUtils() {
        var collection = new ServiceCollection();
        collection.addSingleton(TestSuperService, TestService);
        collection.addSingleton(InjectedService);

        var provider = collection.createProvider();
        var test = provider.getService(TestSuperService);
        var injected = provider.getService(InjectedService);
        Assert.equals(injected, test.injected());
    }

    public function testValue() {
        var collection = new ServiceCollection();
        collection.addSingleton(TestSuperService, TestService);
        collection.addSingleton(InjectedService);

        var provider = collection.createProvider();
        var test = provider.getService(TestSuperService);
        Assert.equals(5, test.value());
    }
}