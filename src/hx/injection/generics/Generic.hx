package hx.injection.generics;

import hx.injection.Service;
import haxe.Rest;

final class Generic {

    public static function of<T : Service>(basetype : Class<T>, params : Rest<Dynamic>) : GenericDefinition<T> {
        var signature = Type.getClassName(basetype);

        for(param in params) {
            signature += '_' + handleClassName(param);
        }

        return {
            signature: signature,
            basetype: basetype
        };
    }
    
    private static function handleClassName(param : Dynamic) : String {
        return Type.getClassName(param).split('.').join('_');
    }
}