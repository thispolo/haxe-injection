package hx.injection.config;

import haxe.io.Path;
import sys.io.File;
import haxe.Json;

final class ConfigurationBuilder {

    private var _root : String;
    private var _jsonPaths : Array<String>;

    public function new(root : String) {
        _root = root;
        _jsonPaths = new Array();
    }

    public static macro function create(root : String) {
        var newroot = Path.normalize(root) + '/';
        trace(newroot);
        ConfigMacro.handleDirectory(newroot);
        return macro {
            new ConfigurationBuilder($v{newroot});
        }
    }

    public function addJson(path : String) : ConfigurationBuilder {
        _jsonPaths.push('${_root}${path}');
        return this;
    }

    public function build() : Configuration {
        var result = {};
        for(jsonPath in _jsonPaths) {
            var json = makeJson(jsonPath);
            for (field in Reflect.fields(json)) {
                Reflect.setField(result, field.toLowerCase(), Reflect.field(json, field));
            }
        }
        return new Configuration(result);
    }

    private function makeJson(source : String) : Dynamic {
        var content = File.getContent(source);
        return Json.parse(content);
    }
}