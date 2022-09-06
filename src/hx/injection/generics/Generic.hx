package hx.injection.generics;

import hx.injection.Service;
import haxe.Rest;

final class Generic {

	/**
		Create a `GenericDefinition` to be used by the `ServiceCollection`.

        This is used to map services with type parameters to their implementations.
        The `basetype` corresponds to the class itself, whereas `params` are the type
        parameters the service implements. For example, a service of `MyClass<Int, String>`
        would be added to the collection using `Generic.of(MyClass, Int, String)`.

	**/
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