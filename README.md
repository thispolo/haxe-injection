# haxe-injection

A dependency injection container for Haxe. Supports singleton, transient, and scoped services.

## Features

- Three service lifecycles: Singleton, Transient, and Scoped
- Configuration handling and configurable dependencies
- Dependencies can be segregated by service type
- Dependencies can be bound to names for chaining
- Lifecycle management through `Destructable` interface
- Basic handling of services with type parameters
- Concrete self-binding
- Iterable support

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
    collection.addSingleton(MyService);
``` 

- You can also supply optional configuration objects:

```haxe
collection.addConfig(new TestConfig());
```

- These will be **automatically** injected into classes whose constructor defines the service as a dependency:
```haxe
    import hx.injection.Service;

    class MyService implements Service {
        // Will recieve an instance of `TestConfig` and `MyService` automatically:
        public function new(config : TestConfig, service : MyService) {

        }
    }
``` 

- After defining your application dependencies, you can create the service provider for injecting the services into your application:

```haxe
var provider = collection.createProvider();
var testService = provider.getService(MyService);
// Do stuff with testService
```

### Service types
- Singleton, Transient, and Scoped services are supported. Singleton returns the same instance on every getService call, Transient will return a new instance every time, and Scoped will return the same instance within a scope:

```haxe
    var collection = new ServiceCollection();
    collection.addSingleton(TestService, NormalTestService);
    collection.addTransient(TestService, LoudTestService);
    collection.addScoped(TestService, LoudTestService);
```

## So what?

Suppose we want to make a program that runs both on Windows and on Chrome. We can do this at start up:

```haxe
    public static function main() {
        var collection = new ServiceCollection();

        #if js
        collection.addSingleton(RenderService, WebGLRenderService);
        #else
        collection.addTransient(RenderService, OpenGL3RenderService);
        #end

        var provider = collection.createProvider();
        var renderer = provider.getService(RenderService);

        renderer.run();
    }
```

While this may seem overkill for a simple application such as this, the true benefits of this library become apparent as an application grows in complexity. It prevents the laborious effort of manually typing out the dependency chain.

Furthermore, this approach satisfies the SOLID principles and prevents platform-specific branching from being hidden away in functions; here it is exposed at the top level in the [**composition root**](https://blog.ploeh.dk/2011/07/28/CompositionRoot/) (in this case, `Main`) and makes it very obvious what the capabilities of your application are. It also makes for extending your application to new platforms trivial.

## Hopes and dreams
- Allow for configuration encryption and different configuration implementations per platform
- Move away from reflection and build the dependency trees at compile time using macros
- Convince the Haxe Foundation to add a DI container to the standard library

## Additional features

### Iterables
It is possible to add services of the same type to a collection by simply registering multiple dependencies like so:

```haxe
    public static function main() {
        var collection = new ServiceCollection();

        collection.addSingleton(MyService, ConcreteService1);
        collection.addSingleton(MyService, ConcreteService2);
        collection.addSingleton(SomeService);

        var provider = collection.createProvider();
    }
```

During constructor resolution, if you reference the type via an iterable like so:

```haxe
    final class SomeService implements Service {
        public function new(services : Iterable<MyService>) {
            trace(services);
        }
    }
```
it will resolve to an iterator of all implementations of that service, i.e. `[ConcreteService1, ConcreteService2]`.

### Provider injection
Occasionally useful for resolving scoped services such as in web applications and event busses, one can inject the ServiceProvider itself into any dependency:
```haxe
    final class SomeService implements Service {
        public function new(provider : ServiceProvider) {
            trace(provider); // Singleton instance of the provider as created by the collection
        }
    }
```
This should be avoided lest we stumble into the [Service Locator anti-pattern](https://stackoverflow.com/questions/22795459/is-servicelocator-an-anti-pattern).

### Instanced services
One can construct a service and add it to the collection like so:

```haxe
    public static function main() {
        var collection = new ServiceCollection();

        collection.addSingleton(MyService, new ConcreteService());

        var provider = collection.createProvider();
    }
```

### Configuration files
It is useful to be able to configure our application with respect to a collection of `.json` files and environment variables. This can be done by adding a folder of a chosen name to your project root, and then pointing to the root using the configuration builder like so:

```haxe
    var builder = ConfigurationBuilder.from('MyConfigFolder');
```

Jsons in this path (and environment variables) can then be resolved by the builder, where Jsons **must** have their type explicitly given:

```haxe
    var myConfig : MyConfig = builder.resolveJson('test.json');
    var myEnv = builder.resolveEnvVar('haxepath'); // returns string
```

We can retrieve values like so:

```haxe
    var myString = myConfig.key.nestedkey;
    var myIntArray = myConfig.key.array;
    var haxePath = myConfig.haxepath;
```

### Type parameters
Services that expect type parameters, such as `MyService<Int, Float>` can be added to the service collection like so:

```haxe
    collection.addSingleton(Generic.of(MyService, Int, Float), SubService);
```

The provider will then map these services into classes that require `MyService` with the same type signature:

```haxe
class SomeService implements Service {
    // Will recieve SubService...
    public function new(service : MyService<Int, Float>) {}
}
```
While the term `generic` is used, this library currently does **not** support generics and is used as a placeholder for when it does.

### Scoping
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

### Binding

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

Such a definition would cause the provider throw a `recursive parameter` definition. We can remedy this by binding the constructor dependencies to implementations like so:

```haxe
class MyFirstService implements SomeService {
}

class MyOtherService implements SomeService {
    @:binding(firstService, MyFirstService)
    public function new(firstService : SomeService) {}
}

// Will WORK:
var collection = new ServiceCollection();
collection.addSingleton(SomeService, MyFirstService).asBinding()
collection.addSingleton(SomeService, MyOtherService)
```

The provider will use the `@:binding` metadata to map the argument of name `firstService` to a given implementation. We can then assign this implementation as a binding in the service collection using `asBinding`.

### Lifecycle management

Any service that implements the `Destructable` interface, like so:

```haxe
class MyFirstService implements SomeService implements Destructable {
}
```

will have `Destroy()` called when the provider goes out of scope or is itself destroyed.

### Auto Constructors

On a service constructor, this:

```haxe
class MyFirstService implements Service {
    @:autoctor public function new(something : AnotherService) {}
}
```

will be converted into this at transpile:

```haxe
class MyFirstService implements Service {
    private var _something : AnotherService;
    public function new(something : AnotherService) {
        _something = something;
    }
}
```