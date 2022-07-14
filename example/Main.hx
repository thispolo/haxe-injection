package example;

import example.segregation.*;
import hx.injection.*;

using example.TestExtensions;

class Main {

    static public function main() : Void {
      // Example 1:
      //test1();
      
      // Example 2:
      //test2();
      
      // Example 3:
      //test3();
      
      // Example 4:
      //test4();

      // Example 5:
      test5();
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
      collection.addTransient(AnotherService);
      collection.addTransient(TestService, LouderTestService);
      collection.addConfig(new TestConfig());
      
      var provider = collection.createProvider();
      sayWord(provider.getTest());

      trace(provider.getService(TestService) != provider.getService(TestService));
    }

    private static function sayWord(service : TestService) : Void {
      service.sayWord();
    }

    private static function test4() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(SingletonIDPrinter);
      collection.addTransient(TransientIDPrinter);
      collection.addScoped(ScopedIDPrinter);
      
      trace('*** NEW SCOPE ***');

      var provider = collection.createProvider();
      var id1 = provider.getService(SingletonIDPrinter);
      var id2 = provider.getService(TransientIDPrinter);
      var id3 = provider.getService(TransientIDPrinter);
      var id4 = provider.getService(ScopedIDPrinter);
      var id5 = provider.getService(ScopedIDPrinter);
      id1.print();
      id2.print();
      id3.print();
      id4.print();
      id5.print();

      trace('*** NEW SCOPE ***');

      var scope = provider.newScope();
      var id1 = scope.getService(SingletonIDPrinter);
      var id2 = scope.getService(TransientIDPrinter);
      var id3 = scope.getService(TransientIDPrinter);
      var id4 = scope.getService(ScopedIDPrinter);
      var id5 = scope.getService(ScopedIDPrinter);
      id1.print();
      id2.print();
      id3.print();
      id4.print();
      id5.print();
    }
    
    private static function test5() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(TextService, ExampleService);
      collection.addSingleton(NumberService, ExampleService);
      var provider = collection.createProvider();

      var serv1 = provider.getService(TextService);
      var serv2 = provider.getService(NumberService);

      trace(serv1.id(), serv2.id());
    }

  }