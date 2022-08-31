package example;

import hx.injection.config.ConfigurationBuilder;
import example.destructable.ADestructableService;
import example.destructable.DestructableService;
import example.binding.SecondChainDependency;
import example.binding.FirstChainDependency;
import example.binding.ChainedDependency;
import example.segregation.*;
import example.scoping.*;
import hx.injection.*;

using example.TestExtensions;

class Main {

    static public function main() : Void {
      test1();
      test2();
      test3();
      test4();
      test5();
      test6();
    }

    private static function test1() : Void {
      var builder = ConfigurationBuilder.create('configs');
      builder.addJson('test.json');
      var config = builder.build();

      var collection = new ServiceCollection();
      collection.addSingleton(LoggingService, LoggingService);
      collection.addSingleton(TestService, LoudTestService);
      collection.addConfig(new TestConfig(config.getString('test')));
      
      var provider = collection.createProvider();
      sayWord(provider.getService(TestService));

      trace(provider.getTest() == provider.getTest());
    }

    private static function test2() : Void {
      var builder = ConfigurationBuilder.create('configs/');
      builder.addJson('test3.json');
      var config = builder.build();

      var collection = new ServiceCollection();
      collection.addSingleton(LoggingService, LoggingService);
      collection.addSingleton(TestService, NormalTestService);
      collection.addConfig(new TestConfig(config.getString('test')));
      
      var provider = collection.createProvider();
      sayWord(provider.getService(TestService));

      trace(provider.getTest() == provider.getTest());
    }

    private static function test3() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(ChainedDependency, FirstChainDependency, 'First');
      collection.addSingleton(ChainedDependency, SecondChainDependency);

      var provider = collection.createProvider();
      provider.getService(ChainedDependency).doThing();
    }

    private static function sayWord(service : TestService) : Void {
      service.sayWord();
    }

    private static function test4() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(SingletonIDPrinter);
      collection.addTransient(TransientIDPrinter);
      collection.addScoped(ScopedIDPrinter);
      collection.addTransient(DependentService);
      
      trace('*** NEW SCOPE ***');

      var provider = collection.createProvider();
      var id1 = provider.getService(DependentService);
      id1.print();
      var id2 = provider.getService(DependentService);
      id2.print();

      trace('*** NEW SCOPE ***');

      var scope = provider.newScope();
      var id1 = scope.getService(DependentService);
      id1.print();
      var id2 = provider.getService(DependentService);
      id2.print();
    }
    
    private static function test5() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(TextService, ExampleService);
      collection.addSingleton(NumberService, ExampleService);
      collection.addSingleton(RecieverService);
      var provider = collection.createProvider();

      var serv1 = provider.getService(RecieverService);

      serv1.print();
    }

    
    private static function test6() : Void {
      var collection = new ServiceCollection();
      collection.addSingleton(DestructableService, ADestructableService);
      var provider = collection.createProvider();

      var serv1 = provider.getService(DestructableService);

      serv1.createMeme();

      provider.destroy();
    }
  }