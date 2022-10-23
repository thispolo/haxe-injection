package config;

import utest.Assert;
import hx.injection.ServiceCollection;
import haxe.Json;
import hx.injection.config.Configuration;

using hx.injection.ServiceExtensions;

final class ConfigTest extends utest.Test {
    
    public function testConfiguredService() {
        var content = '{
            "test": {
                "word": "Hello"
            }
        }';
        var json = Json.parse(content);
        var configuration = new Configuration(json);
        var config = new Config();
        config.word = configuration.getString('test.word');

        var collection = new ServiceCollection();
        collection.addSingleton(ConfiguredService);
        collection.addConfig(config);

        var provider = collection.createProvider();
        var service = provider.getService(ConfiguredService);

        Assert.equals(service.getValue(), "Hello");
    }

    public function testConfigurationInner() {
        var content = '{
            "outer": {
                "inner": "myValue"
            }
        }';
        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getString('outer.inner'), 'myValue');
    }

    // Value types:
    public function testConfigurationInt() {
        var content = '{
            "value": 5
        }';

        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getInt('value'), 5);
    }

    public function testConfigurationBool() {
        var content = '{
            "value": true
        }';

        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getBool('value'), true);
    }

    public function testConfigurationFloat() {
        var content = '{
            "value": 1.0
        }';

        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getFloat('value'), 1.0);
    }

    public function testConfigurationString() {
        var content = '{
            "value": "Hi there!"
        }';
        
        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getString('value'), "Hi there!");
    }

    // Arrays of value types:
    public function testConfigurationIntArray() {
        var content = '{
            "value": [5]
        }';

        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getIntArray('value')[0], 5);
    }

    public function testConfigurationBoolArray() {
        var content = '{
            "value": [true]
        }';

        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getBoolArray('value')[0], true);
    }

    public function testConfigurationFloatArray() {
        var content = '{
            "value": [1.0]
        }';

        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getFloatArray('value')[0], 1.0);
    }

    public function testConfigurationStringArray() {
        var content = '{
            "value": ["Hi there!"]
        }';
        
        var json = Json.parse(content);
        var configuration = new Configuration(json);
      
        Assert.equals(configuration.getStringArray('value')[0], "Hi there!");
    }
}