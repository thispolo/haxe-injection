package injection;

import hx.injection.ServiceProvider;
import utest.Assert;
import hx.injection.ServiceCollection;

using hx.injection.ServiceExtensions;

final class InjectionTest extends utest.Test {
    
    public function testProvider() {
        var collection = new ServiceCollection();
        var provider = collection.createProvider();
        var providerAgain = provider.getService(ServiceProvider);
        
        Assert.equals(provider, providerAgain);
    }
    
    public function testSelfInjection() {
        var collection = new ServiceCollection();
        collection.addSingleton(SelfInjected);
        
        var provider = collection.createProvider();
        var injected = provider.getService(SelfInjected);
        
        Assert.equals(injected.get(), provider);
    }
    
    public function testLoudInjection() {
        var collection = new ServiceCollection();
        collection.addSingleton(BaseWordService, WordService);
        collection.addSingleton(TestService, LoudTestService);

        var provider = collection.createProvider();
        var service = provider.getService(BaseWordService);
        
        Assert.equals(service.say('Test'), 'TEST');
    }

    public function testQuietInjection() {
        var collection = new ServiceCollection();
        collection.addSingleton(BaseWordService, WordService);
        collection.addSingleton(TestService, QuietTestService);

        var provider = collection.createProvider();
        var service = provider.getService(BaseWordService);
        
        Assert.equals(service.say('Test'), 'test');
    }

    public function testInstanceInjection() {
        var collection = new ServiceCollection();
        collection.addService(BaseWordService, new InstanceService('Hello'));
        
        var provider = collection.createProvider();
        var injected = provider.getService(BaseWordService);
        
        Assert.equals(injected.say('World!'), 'HelloWorld!');
    }
    
    public function testInstanceSelfBinding() {
        var collection = new ServiceCollection();
        collection.addService(InstanceService, new InstanceService('Hello'));
        
        var provider = collection.createProvider();
        var injected = provider.getService(InstanceService);
        
        Assert.equals(injected.say('World!'), 'HelloWorld!');
    }
    
}