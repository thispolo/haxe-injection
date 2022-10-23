package hx.injection;

import hx.injection.generics.GenericDefinition;

final class ServiceExtensions {

    /**
        Add singleton service to the service collection. A singleton is always the same instance on every resolution.
    **/
    overload static public extern inline function addSingleton<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Singleton, service, implementation);
    }

    /**
        Add singleton service to the service collection. A singleton is always the same instance on every resolution.
    **/
    overload static public extern inline function addSingleton<T : Service>(collection : ServiceCollection, implementation : Class<T>) : ServiceConfig {
        return collection.addService(ServiceType.Singleton, implementation, implementation);
    }

    /**
        Add singleton service to the service collection. A singleton is always the same instance on every resolution.
    **/
    overload static public extern inline function addSingleton<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Singleton, service, implementation);
    }

    /**
        Add singleton service to the service collection. A singleton is always the same instance on every resolution.
    **/
    overload static public extern inline function addSingleton<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : ServiceConfig {
        return collection.addService(ServiceType.Singleton, implementation, implementation.basetype);
    }

    /**
        Add singleton service if it does not already exist on the service collection. A singleton is always the same instance on every resolution.
    **/
    overload static public extern inline function addSingletonProtected<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : Void {
        if(!collection.has(service))
            collection.addService(ServiceType.Singleton, service, implementation);
    }

    /**
        Add singleton service if it does not already exist on the service collection. A singleton is always the same instance on every resolution.
    **/
    overload static public extern inline function addSingletonProtected<T : Service, V : T>(collection : ServiceCollection, implementation : Class<V>) : Void {
        if(!collection.has(implementation))
            collection.addService(ServiceType.Singleton, implementation, implementation);
    }

    /**
        Add singleton service if it does not already exist on the service collection. A singleton is always the same instance on every resolution.
    **/
    overload static public extern inline function addSingletonProtected<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : Void {
        if(!collection.has(service))
            collection.addService(ServiceType.Singleton, service, implementation);
    }

    /**
        Add singleton service if it does not already exist on the service collection. A singleton is always the same instance on every resolution.
    **/
    overload static public extern inline function addSingletonProtected<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : Void {
        if(!collection.has(implementation))
            collection.addService(ServiceType.Singleton, implementation, implementation.basetype);
    }

    /**
        Add transient service to the service collection. A transient is a new instance on every resolution.
    **/
    overload static public extern inline function addTransient<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Transient, service, implementation);
    }

    /**
        Add transient service to the service collection. A transient is a new instance on every resolution.
    **/
    overload static public extern inline function addTransient<T : Service>(collection : ServiceCollection, implementation : Class<T>) : ServiceConfig {
        return collection.addService(ServiceType.Transient, implementation, implementation);
    }

    /**
        Add transient service to the service collection. A transient is a new instance on every resolution.
    **/
    overload static public extern inline function addTransient<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Transient, service, implementation);
    }

    /**
        Add transient service to the service collection. A transient is a new instance on every resolution.
    **/
    overload static public extern inline function addTransient<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : ServiceConfig {
        return collection.addService(ServiceType.Transient, implementation, implementation.basetype);
    }
    
    /**
        Add transient service if it does not already exist on the service collection. A transient is a new instance on every resolution.
    **/
    overload static public extern inline function addTransientProtected<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : Void {
        if(!collection.has(service))
            collection.addService(ServiceType.Transient, service, implementation);
    }

    /**
        Add transient service if it does not already exist on the service collection. A transient is a new instance on every resolution.
    **/
    overload static public extern inline function addTransientProtected<T : Service>(collection : ServiceCollection, implementation : Class<T>) : Void {
        if(!collection.has(implementation))
            collection.addService(ServiceType.Transient, implementation, implementation);
    }

    /**
        Add transient service if it does not already exist on the service collection. A transient is a new instance on every resolution.
    **/
    overload static public extern inline function addTransientProtected<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : Void {
        if(!collection.has(service))
            collection.addService(ServiceType.Transient, service, implementation);
    }

    /**
        Add transient service if it does not already exist on the service collection. A transient is a new instance on every resolution.
    **/
    overload static public extern inline function addTransientProtected<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : Void {
        if(!collection.has(implementation))
            collection.addService(ServiceType.Transient, implementation, implementation.basetype);
    }
    
    /**
        Add scoped service to the service collection. A scoped is the same instance per scope.
    **/
    overload static public extern inline function addScoped<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Scoped, service, implementation);
    }

    /**
        Add scoped service to the service collection. A scoped is the same instance per scope.
    **/
    overload static public extern inline function addScoped<T : Service>(collection : ServiceCollection, implementation : Class<T>) : ServiceConfig {
        return collection.addService(ServiceType.Scoped, implementation, implementation);
    }

    /**
        Add scoped service to the service collection. A scoped is the same instance per scope.
    **/
    overload static public extern inline function addScoped<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : ServiceConfig {
        return collection.addService(ServiceType.Scoped, service, implementation);
    }

    /**
        Add scoped service to the service collection. A scoped is the same instance per scope.
    **/
    overload static public extern inline function addScoped<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : ServiceConfig {
        return collection.addService(ServiceType.Scoped, implementation, implementation.basetype);
    }
    
    /**
        Add scoped service if it does not already exist on the service collection. A scoped is the same instance per scope.
    **/
    overload static public extern inline function addScopedProtected<T : Service, V : T>(collection : ServiceCollection, service : Class<T>, implementation : Class<V>) : Void {
        if(!collection.has(service))
            collection.addService(ServiceType.Scoped, service, implementation);
    }

    /**
          scoped service if it does not already exist on the service collection. A scoped is the same instance per scope.
    **/
    overload static public extern inline function addScopedProtected<T : Service>(collection : ServiceCollection, implementation : Class<T>) : Void {
        if(!collection.has(implementation))
            collection.addService(ServiceType.Scoped, implementation, implementation);
    }

    /**
        Add scoped service if it does not already exist on the service collection. A scoped is the same instance per scope.
    **/
    overload static public extern inline function addScopedProtected<T : Service, V : T>(collection : ServiceCollection, service : GenericDefinition<T>, implementation : Class<V>) : Void {
        if(!collection.has(service))
            collection.addService(ServiceType.Scoped, service, implementation);
    }

    /**
        Add scoped service if it does not already exist on the service collection. A scoped is the same instance per scope.
    **/
    overload static public extern inline function addScopedProtected<T : Service>(collection : ServiceCollection, implementation : GenericDefinition<T>) : Void {
        if(!collection.has(implementation))
            collection.addService(ServiceType.Scoped, implementation, implementation.basetype);
    }
}