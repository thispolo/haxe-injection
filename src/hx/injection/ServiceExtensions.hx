package hx.injection;

import hx.injection.generics.GenericDefinition;

final class ServiceExtensions {
    overload static public extern inline function addSingleton<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Singleton, service, implementation);
    }

    overload static public extern inline function addSingleton<T : Service>(collection : ServiceCollection, implementation : Class<T>) : ServiceConfig {
        return collection.addService(ServiceType.Singleton, implementation, implementation);
    }

    overload static public extern inline function addSingleton<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Singleton, service, implementation);
    }

    overload static public extern inline function addSingleton<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : ServiceConfig {
        return collection.addService(ServiceType.Singleton, implementation, implementation.basetype);
    }

    overload static public extern inline function addTransient<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Transient, service, implementation);
    }

    overload static public extern inline function addTransient<T : Service>(collection : ServiceCollection, implementation : Class<T>) : ServiceConfig {
        return collection.addService(ServiceType.Transient, implementation, implementation);
    }

    overload static public extern inline function addTransient<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Transient, service, implementation);
    }

    overload static public extern inline function addTransient<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : ServiceConfig {
        return collection.addService(ServiceType.Transient, implementation, implementation.basetype);
    }
    
    overload static public extern inline function addScoped<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Scoped, service, implementation);
    }

    overload static public extern inline function addScoped<T : Service>(collection : ServiceCollection, implementation : Class<T>) : ServiceConfig {
        return collection.addService(ServiceType.Scoped, implementation, implementation);
    }

    overload static public extern inline function addScoped<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Scoped, service, implementation);
    }

    overload static public extern inline function addScoped<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : ServiceConfig {
        return collection.addService(ServiceType.Scoped, implementation, implementation.basetype);
    }
    
}