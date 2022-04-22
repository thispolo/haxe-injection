package example;

import hx.injection.ServiceProvider;
import hx.injection.ServiceCollection;

final class TestExtensions {
    public static function addSelfboundTest(services : ServiceCollection) : Void {
        services.addSingleton(LoudTestService, LoudTestService);
    }

    public static function addLoudTest(services : ServiceCollection) : Void {
        services.addSingleton(TestService, LoudTestService);
    }

    public static function addTransientTest(services : ServiceCollection) : Void {
        services.addTransient(TestService, LoudTestService);
    }

    public static function addTest(services : ServiceCollection) : Void {
        services.addSingleton(TestService, NormalTestService);
    }

    public static function getTest(provider : ServiceProvider) : TestService {
        return provider.getService(TestService);
    }

    public static function getSelfboundTest(provider : ServiceProvider) : LoudTestService {
        return provider.getService(LoudTestService);
    }
}