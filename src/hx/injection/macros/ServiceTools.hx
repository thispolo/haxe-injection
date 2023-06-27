package hx.injection.macros;

import haxe.macro.Expr;

class ServiceTools {
	private static var _serviceMap:Map<String, String> = new Map();

	public static function getService(key:String):String {
		return _serviceMap.get(key);
	}
}
