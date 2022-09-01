package hx.injection.config;

import haxe.macro.Context;
import haxe.io.Path;
import sys.io.File;
import haxe.Json;

final class ConfigurationBuilder {

    private var _root : String;
    private var _jsonPaths : Array<String>;
    private var _envVars : Array<String>;

    public function new(root : String) {
        _root = root;
        _jsonPaths = new Array();
        _envVars = new Array();
    }

    public static macro function create(root : String) {
        var newroot = Path.normalize(root) + '/';
        ConfigMacro.handleDirectory(newroot);
        return macro {
            new ConfigurationBuilder($v{newroot});
        }
    }

    public function addJson(path : String) : ConfigurationBuilder {
        _jsonPaths.push('${_root}${path}');
        return this;
    }

    public function addEnvVar(name : String) : ConfigurationBuilder {
        _envVars.push(name);
        return this;
    }

    public function build() : Configuration {
        var result = {};

        for(jsonPath in _jsonPaths) {
            var json = makeJson(jsonPath);
            addToResult(json, result);
        }

        for(vars in _envVars) {
            var env = Sys.getEnv(vars);
            if(env == null)
                throw new haxe.Exception('No such environment variable \"${vars}\""');

            Reflect.setField(result, vars, env);
        }
        return new Configuration(result);
    }

    private function makeJson(source : String) : Dynamic {
        var content = File.getContent(source);
        return Json.parse(content);
    }

    private function addToResult(source : Dynamic, destination : Dynamic) : Void {
        for(field in Reflect.fields(source)) {
            var inner = {};
            addToResult(Reflect.field(source, field), inner);
            if(Reflect.fields(inner).length > 0)
                Reflect.setField(destination, field.toLowerCase(), inner);
            else Reflect.setField(destination, field.toLowerCase(), Reflect.field(source, field));
        }
    }
}