package example;

import hx.injection.*;

using example.TestExtensions;

class Main {

    static public function main() : Void {
      // Example 1:
      test1();
      
      // Example 2:
      test2();
      
      // Example 3:
      test3();
    }

    private static function test1() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(LoggingService, LoggingService);
      collection.addSingleton(TestService, LoudTestService);
      collection.addConfig(new TestConfig());
      
      var provider = collection.createProvider();
      sayWord(provider.getService(TestService));

      trace(provider.getTest() == provider.getTest());
    }

    private static function test2() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(LoggingService, LoggingService);
      collection.addSingleton(TestService, NormalTestService);
      collection.addConfig(new TestConfig());
      
      var provider = collection.createProvider();
      sayWord(provider.getService(TestService));

      trace(provider.getTest() == provider.getTest());
    }

    private static function test3() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(LoggingService);
      collection.addTransient(TestService, LoudTestService);
      collection.addConfig(new TestConfig());
      
      var provider = collection.createProvider();
      sayWord(provider.getTest());

      trace(provider.getService(TestService) != provider.getService(TestService));
    }

    private static function sayWord(service : TestService) : Void {
      service.sayWord();
    }

  }