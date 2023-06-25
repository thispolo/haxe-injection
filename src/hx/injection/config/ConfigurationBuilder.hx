package hx.injection.config;

import haxe.Exception;
import haxe.macro.Context;
import haxe.io.Path;
import sys.io.File;
import haxe.Json;

using StringTools;

final class ConfigurationBuilder {
	private var _root:String;

	public function new(root:String) {
		_root = root;
	}

	/**
		Create a configuration builder where `root` points to the directory of Json files in your project folder.
	**/
	public static macro function create(root:String) {
		var newroot = Path.normalize(root) + '/';
		ConfigMacro.handleDirectory(newroot);
		return macro {
			new ConfigurationBuilder($v{newroot});
		}
	}

	/**
		Resolve a Json file pointed to by `path` to the specific type `T`.
	**/
	@:generic public function resolveJson<T>(path:String):T {
		try {
			var content = File.getContent('${_root}/${path}');
			var json:T = Json.parse(content);
			return json;
		} catch (e:haxe.Exception) {
			throw "";
		}
	}

	/**
		Add environment variable `name` to the configuration structure.
	**/
	public function resolveEnvVar(name:String):String {
		return Sys.getEnv(name);
	}

	/**
		Create a configuration.
	**/
	public function build():Configuration {
		// var result = {};

		// for (jsonPath in _jsonPaths) {
		// 	var json = makeJson(jsonPath);
		// 	if (json == null)
		// 		continue;

		// 	addToResult(json, result);
		// }

		// for (vars in _envVars) {
		// 	var env = Sys.getEnv(vars);
		// 	if (env == null)
		// 		throw new Exception('No such environment variable \"${vars}\""');

		// 	Reflect.setField(result, vars.toLowerCase(), env);
		// }

		return null;
	}
}
