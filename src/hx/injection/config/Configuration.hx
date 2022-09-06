package hx.injection.config;

final class Configuration {

    private var _group : Dynamic;

    public function new(group : Dynamic) {
        _group = group;
    }

	/**
		Return a value as `String` from our configuration using `key`.

		Nested values are retrieved by using a `[key].[nestedkey]` syntax, where all keys are lower case.
	**/
    public function getString(key : String) : String {
        var value = extractValue(key);
        if(value is String) {
            return cast(value, String);
        }
        throw createException('String');
    }

	/**
		Return a value as `Float` from our configuration using `key`.

		Nested values are retrieved by using a `[key].[nestedkey]` syntax, where all keys are lower case.
	**/
    public function getFloat(key : String) : Float {
        var value = extractValue(key);
        if(value is Float) {
            return cast(value, Float);
        }
        throw createException('Float');
    }

	/**
		Return a value as `Int` from our configuration using `key`.

		Nested values are retrieved by using a `[key].[nestedkey]` syntax, where all keys are lower case.
	**/
    public function getInt(key : String) : Int {
        var value = extractValue(key);
        if(value is Int) {
            return cast(value, Int);
        }
        throw createException('Int');
    }

	/**
		Return a value as `Bool` from our configuration using `key`.

		Nested values are retrieved by using a `[key].[nestedkey]` syntax, where all keys are lower case.
	**/
    public function getBool(key : String) : Bool {
        var value = extractValue(key);
        if(value is Bool) {
            return cast(value, Bool);
        }
        throw createException('Bool');
    }

	/**
		Return a value as an `Array` of `String` from our configuration using `key`.

		Nested values are retrieved by using a `[key].[nestedkey]` syntax, where all keys are lower case.
	**/
    public function getStringArray(key : String) : Array<String> {
        var value = extractValue(key);
        if(Std.isOfType(value, Array)) {
            if(value[0] is String) {
                return (value : Array<String>);
            }
        }
        throw createException('Array<String>');
    }

	/**
		Return a value as an `Array` of `Float` from our configuration using `key`.

		Nested values are retrieved by using a `[key].[nestedkey]` syntax, where all keys are lower case.
	**/
    public function getFloatArray(key : String) : Array<Float> {
        var value = extractValue(key);
        if(Std.isOfType(value, Array)) {
            if(value[0] is Float) {
                return (value : Array<Float>);
            }
        }
        throw createException('Array<Float>');
    }

	/**
		Return a value as an `Array` of `Int` from our configuration using `key`.

		Nested values are retrieved by using a `[key].[nestedkey]` syntax, where all keys are lower case.
	**/
    public function getIntArray(key : String) : Array<Int> {
        var value = extractValue(key);
        if(Std.isOfType(value[0], Int)) {
            if(value[0] is Int) {
                return (value : Array<Int>);
            }
        }
        throw createException('Array<Int>');
    }

	/**
		Return a value as an `Array` of `Bool` from our configuration using `key`.

		Nested values are retrieved by using a `[key].[nestedkey]` syntax, where all keys are lower case.
	**/
    public function getBoolArray(key : String) : Array<Bool> {
        var value = extractValue(key);
        if(Std.isOfType(value[0], Bool)) {
            if(value[0] is Bool) {
                return (value : Array<Bool>);
            }
        }
        throw createException('Array<Bool>');
    }

    private function extractValue(key : String) : Dynamic {
        var fields = key.split('.');
        var current = _group;
        for(field in fields) {
            current = Reflect.field(current, field.toLowerCase());
            if(current == null)
                throw new haxe.Exception('No such value corresponding to \'${key}\'. Does it exist in the collection?');
        }
        return current;
    }
    
    private function createException(type : String) : haxe.Exception {
        return new haxe.Exception('Unable to resolve desired value as \"${type}\"');
    }
}