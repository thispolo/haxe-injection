package generic;

import generic.TestDependency;
import generic.GenericDependency;
import utest.Assert;
import hx.injection.ServiceCollection;
import hx.injection.generics.Generic;

using hx.injection.ServiceExtensions;

final class GenericTest extends utest.Test {
    
    public function testGenerics() {
        var collection = new ServiceCollection();
        collection.addSingleton(Generic.of(GenericDependency, Int), TestDependency);

        var provider = collection.createProvider();
        var service = provider.getService(Generic.of(GenericDependency, Int));

        Assert.equals(service.getObject(), 5);
    }

}