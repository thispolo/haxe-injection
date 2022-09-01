package segregation;

import utest.Assert;
import hx.injection.ServiceCollection;

final class SegregationTest extends utest.Test {
    
    public function testSegregation() {
        var collection = new ServiceCollection();
        collection.addSingleton(NumberService, ExampleService);
        collection.addSingleton(TextService, ExampleService);

        var provider = collection.createProvider();
        var service1 = provider.getService(NumberService);
        var service2 = provider.getService(TextService);
      
        Assert.equals(service1, service2);
    }

}