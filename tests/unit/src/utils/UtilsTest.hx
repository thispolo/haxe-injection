package utils;

import utest.Assert;
import hx.injection.ServiceCollection;

final class UtilsTest extends utest.Test {
    
    public function testUtils() {
        var collection = new ServiceCollection();
        
        Assert.equals(true, true);
    }

}