# haxe-injection

A straight-to-the-point DI container for Haxe. Supports singleton, transient, and singleton services.

## Features

- Three service lifecycles: Singleton, Transient, and Scoped
- Configurable dependencies
- Dependencies can be segregated by service type
- Dependencies can be bound to names for chaining purposes
- Lifecycle management through `Destructable` interface
- Concrete self-binding

## Overview

### What does it do?

Allows you to define abstract services, whose concrete implementations can handle platform-specific code, which can then be injected into high-level code. This allows one to take advantage of the dependency inversion and single responsibility principles resulting in a cleaner application architecture. It exists as a natural fit to the Haxe programming language as it allows one to define different implementations per target.

### How does it work?

First you define the abstraction that represents your given service. This could be an abstract class, interface, or the class itself. To identify a service, it must extend/implement the hx.injection.Service interface:

```haxe
    import hx.injection.Service;

    interface TestService extends Service {
        public function sayWord() : Void;
    }
``` 

Then create a concrete implementation of that abstraction:

```haxe
    import hx.injection.Service;

    class LoudTestService implements TestService {
        public function new() {}
        public function sayWord() : Void {
            trace("HELLO");
        }
    }
``` 

During start up:-

- Create a service collection. Here, you can define what services your application will depend upon:

```haxe
    var collection = new ServiceCollection();
    collection.addSingleton(TestService, NormalTestService);
``` 

- Both singleton and transient services are supported. Singleton returns the same instance on every getService call, while transient will return a new instance every time:

```haxe
    var collection = new ServiceCollection();
    collection.addSingleton(TestService, NormalTestService);
    collection.addTransient(TestService, LoudTestService);
```

- Supply optional configuration files:

```haxe
collection.addConfig(new TestConfig());
```

- After defining your application dependencies, you can create the service provider for injecting the services into your application:

```haxe
var provider = collection.createProvider();
var testService = provider.getService(TestService);
var app = new MyApp(testService);
```

- Additionally, you can define dependencies between services and configurations simply by defining them as an argument in the constructor for the concrete implementation and adding them to the service collection:

```haxe
    import hx.injection.Service;

    class LoudTestService implements TestService {

        private var _config : TestConfig;
        private var _phoneService : PhoneService;

        public function new(config : TestConfig, phoneService : PhoneService) {
            _config = config;
            _phoneService = phoneService;
        }

        public function sayWord() : Void {
            var word = _config.word;
            _phoneService.alert(word);
            trace(_config.word);
        }
    }
```

## So what?

Suppose we want to make a program that runs both on Windows and on Chrome. We can do this at start up:

```haxe
    var collection = new ServiceCollection();

    #if js
    collection.addSingleton(RenderService, WebGLRenderService);
    #else
    collection.addTransient(RenderService, OpenGL3RenderService);
    #end

    var provider = collection.createProvider();
    var renderer = provider.getService(RenderService);

    myApp.run(renderer);
```

While this may seem overkill for a simple application such as this, the true benefits of this library become apparent as an application grows in complexity. It prevents the laborious effort of manually typing out the dependency chain.

Furthermore, this approach satisfies the SOLID principles and prevents platform-specific branching from being hidden away in functions; here it is exposed at the top level in the __composition root__ and makes it very obvious what the capabilities of your application are. It also makes for extending your application to new platforms trivial.

## Scoping

Sometimes it is useful to generate instances based on scope, like so:

```haxe
    var collection = new ServiceCollection();
    collection.addScoped(AService);
    collection.addSingleton(BService);
    
    var provider = collection.createProvider();
    
    // Same instance
    provider.getService(AService); // ID: 123
    
    // Same instance
    provider.getService(BService); // ID: 764
    provider.getService(BService); // ID: 764
    
    var scope = provider.newScope();
    
    // Same instance
    scope.getService(AService); // ID: 123
    
    // Same instance
    scope.getService(BService); // ID: 945
    scope.getService(BService); // ID: 945
    
```

Essentially, new instances of scoped services are created on `newScope` and act like singletons __within__ that scope.

## Chaining

Suppose we want to chain together services of the same type, like so:

```haxe
class MyFirstService implements SomeService {
}

class MyOtherService implements SomeService {
    public function new(firstService : SomeService) {}
}

// Will fail:
var collection = new ServiceCollection();
collection.addSingleton(SomeService, MyFirstService)
collection.addSingleton(SomeService, MyOtherService)
```

Such a definition would cause the provider throw a `recursive parameter` definition. We can remedy this by binding the service parameters and implementations to a given name:

```haxe
class MyFirstService implements SomeService {
}

class MyOtherService implements SomeService {
    @:named('firstService', 'MyFirstService')
    public function new(firstService : SomeService) {}
}

// Will WORK:
var collection = new ServiceCollection();
collection.addSingleton(SomeService, MyFirstService, 'firstService')
collection.addSingleton(SomeService, MyOtherService)
```

The provider will use the `@:named` metadata in conjuction with the `key` argument in the collection to correctly map an implementation to a given dependency type.

## Lifecycle management

Any service that implements the `Destructable` interface, like so:

```haxe
class MyFirstService implements SomeService implements Destructable {
}
```

will have `Destroy()` called when the provider goes out of scope or is itself destroyed.

## Future features
- Allow for instancing services during assignment to the collection
- Allow for optionally adding services using callbacks to for setting optional arguments