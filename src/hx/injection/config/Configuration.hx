package hx.injection.config;

final class Configuration {

    private var _group : Dynamic;

    public function new(group : Dynamic) {
        _group = group;
    }

    public function getString(key : String) : String {
        var value = extractValue(key);
        if(Std.isOfType(value, String)) {
            return cast value;
        }
        throw createException('String');
    }

    public function getFloat(key : String) : Float {
        var value = extractValue(key);
        if(Std.isOfType(value, Float)) {
            return cast value;
        }
        throw createException('Float');
    }

    public function getInt(key : String) : Int {
        var value = extractValue(key);
        if(Std.isOfType(value, Int)) {
            return cast value;
        }
        throw createException('Int');
    }

    public function getBool(key : String) : Bool {
        var value = extractValue(key);
        if(Std.isOfType(value, Bool)) {
            return cast value;
        }
        throw createException('Bool');
    }

    public function getStringArray(key : String) : Array<String> {
        var value = extractValue(key);
        if(Std.isOfType(value[0], String)) {
            return cast value;
        }
        throw createException('Array<String>');
    }

    public function getFloatArray(key : String) : Array<Float> {
        var value = extractValue(key);
        if(Std.isOfType(value[0], Float)) {
            return cast value;
        }
        throw createException('Array<Float>');
    }

    public function getIntArray(key : String) : Array<Int> {
        var value = extractValue(key);
        if(Std.isOfType(value[0], Int)) {
            return cast value;
        }
        throw createException('Array<Int>');
    }

    public function getBoolArray(key : String) : Array<Bool> {
        var value = extractValue(key);
        if(Std.isOfType(value[0], Bool)) {
            return cast value;
        }
        throw createException('Array<Bool>');
    }

    private function extractValue(key : String) : Dynamic {
        var fields = key.split('.');
        var current = _group;
        for(field in fields) {
            current = Reflect.field(current, field.toLowerCase());
        }
        return current;
    }
    
    private function createException(type : String) : haxe.Exception {
        return new haxe.Exception('Unable to get value as \"${type}\"');
    }
}