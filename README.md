# haxe-injection
A straight to the point .NET-style dependency injection library for Haxe. Supports singleton and transient services.

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

### So what?
- Suppose we want to make a program that runs both on Windows and on Chrome. We can do this at start up:
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
- While this may seem overkill for a simple application such as this, the true benefits of this library become apparent as an application grows in complexity. Furthermore, this approach satisfies the SOLID principles and prevents platform-specific branching from being hidden away in functions; here it is exposed at the top level and makes it very obvious what the capabilities of your application are. It also makes for extending your application to new platforms trivial.