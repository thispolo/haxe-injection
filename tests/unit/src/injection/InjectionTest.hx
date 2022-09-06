package injection;

import utest.Assert;
import hx.injection.ServiceCollection;

final class InjectionTest extends utest.Test {
    
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

}