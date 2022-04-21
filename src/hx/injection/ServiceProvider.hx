package hx.injection;

/*
MIT License

Copyright (c) 2020 Paul SG Cross

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

class ServiceProvider {

    private var _requestedConfigs : Map<String, Any>;
    private var _requestedServices : Map<String, ServiceType>;

    private var _services : Map<String, Service>;
    
    public function new(configs : Map<String, Any>, services : Map<String, ServiceType>) {
        _requestedConfigs = configs;
        _requestedServices = services;
        _services = new Map();
    }
    
    public function getService<S : Service>(type : Class<S>) : S {
        var serviceName = Type.getClassName(type);
        var requestedService = _requestedServices.get(serviceName);
        if(requestedService == null) {
            throw new haxe.Exception("Service of type " + type + " not found.");
        }

        var service = handleServiceRequest(serviceName, requestedService);

        return Std.downcast(service, type);
    }
    
    private function handleServiceRequest(serviceName : String, service : ServiceType) : Service {
        switch(service) {
            case Singleton(service):
                return handleSingletonService(serviceName, service);
            case Transient(service):
                return handleTransientService(serviceName, service);
            default:
        }
    }

    private function handleSingletonService(serviceName : String, service : String) : Service {
        var instance = getHandled(serviceName);
        if(instance == null) {
            instance = buildDependencyTree(service);
            _services.set(serviceName, instance);
        }
        return instance;
    }

    private function handleTransientService(serviceName : String, service : String) : Service {
        return buildDependencyTree(service);
    }

    private function buildDependencyTree(service : String) : Service {
        var dependencies = [];
        var args = getServiceArgs(service);
        for(arg in args) {
            var dependency = getRequestedService(arg);
            if(dependency != null) {
                var serviceInstance = handleServiceRequest(arg, dependency);
                dependencies.push(serviceInstance);
                continue;
            }
            
            var config = getRequestedConfig(arg);
            if(config != null) {
                dependencies.push(config);
                continue;
            }

            throw new haxe.Exception('Dependency ' + arg + ' for ' + service + ' is missing. Did you add it to the collection?');
        }

        return Type.createInstance(Type.resolveClass(service), dependencies);
    }

    private function getServiceArgs(service : String) : Array<String> {
        var type = Type.resolveClass(service);
        var instance = Type.createEmptyInstance(type);
        return instance.getConstructorArgs();
    }

    private function getHandled(serviceName : String) : Service {
        return _services.get(serviceName);
    }

    private function getRequestedConfig(config : String) : Any {
        return _requestedConfigs.get(config);
    }

    private function getRequestedService(serviceName : String) : ServiceType {
        return _requestedServices.get(serviceName);
    }
    
}