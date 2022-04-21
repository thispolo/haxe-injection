package example;

import hx.injection.*;

using example.TestExtensions;

class Main {

    static public function main() : Void {
      // Example 1:
      var collection = new ServiceCollection();
      collection.addTest();
      collection.addConfig(new TestConfig());
      
      var provider = collection.createProvider();
      sayWord(provider.getTest());
      trace(provider.getTest() == provider.getTest());
      
      // Example 2:
      var collection = new ServiceCollection();
      collection.addLoudTest();
      collection.addConfig(new TestConfig());

      var provider = collection.createProvider();
      sayWord(provider.getTest());
      
      // Example 3:
      var collection = new ServiceCollection();
      collection.addTransientTest();
      collection.addConfig(new TestConfig());
      var provider = collection.createProvider();
      trace(provider.getService(TestService) != provider.getService(TestService));
    }

    private static function sayWord(service : TestService) : Void {
      service.sayWord();
    }

  }