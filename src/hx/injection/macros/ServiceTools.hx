package hx.injection.macros;

class ServiceTools {
	private static var _serviceMap:Map<String, String> = new Map();

	public static function getService(key:String):String {
		return _serviceMap.get(key);
	}
}
