package hx.injection.testing;

#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
import haxe.macro.Expr.ImportExpr;
import haxe.macro.Expr.Field;
import haxe.macro.Type.ClassField;

using haxe.macro.ExprTools;
using haxe.macro.TypeTools;
#end

final class Mock {
    macro public static function of(type : Expr, field : Expr, expr : Expr) : Expr {
        var out = [];
        function mapper(e : Expr) : Expr {
            switch(e.expr) {
                case EConst(CIdent(s)):
                    out.insert(0, s);
                case EField(e, field):
                    out.insert(0, field);
                default:
            }
            return e.map(mapper);
        }
        mapper(type);

        var name = '';
        switch field.expr {
            case EConst(CIdent(s)):
                name = s;
            default:
        }

        var path = createMock(out, name, expr);

        return macro $p{path};
    }

    #if macro
    private static function createMock(typepath : Array<String>, fieldName : String, expr : Expr) : Array<String> {
        var type = Context.getType(typepath.join('.'));
        var classType = type.getClass();
        
        var fields : Array<Field> = [];
        fields.push({
            name: 'new',
            kind: FFun({
                args: [],
                expr: macro {}
            }),
            pos: Context.currentPos()
        });

        for(field in classType.fields.get()) {
            generateField(field, fieldName, expr, fields);
        }

        var name = 'Mocked${typepath[typepath.length - 1]}';
        Context.defineType({
            pack: ['mocks'],
            name: name,
            kind: TDClass(null, [{pack: classType.pack, name: classType.name}], false, true, false),
            fields: fields,
            pos: Context.currentPos()
        });

        return ['mocks', name];
    }

    private static function generateField(classField : ClassField, fieldName : String, expr : Expr, fields : Array<Field>) : Void {
        switch classField.kind {
            case FVar(read, write):
            case FMethod(k):
                var args = [];
                var ret = null;
                switch classField.type {
                    case TFun(a, r):
                        args = a;
                        ret = r;
                    default:
                }

                fields.push({
                    name: classField.name,
                    access: [classField.isPublic ? Access.APublic : Access.APrivate],
                    kind: FFun({
                        args: [for (arg in args) {name : arg.name, type: arg.t.toComplexType()}],
                        expr: classField.name == fieldName ? expr : macro return ${generateExprFromReturn(ret)},
                        ret: ret.toComplexType()
                    }),
                    pos: Context.currentPos()
                });
        }
    }

    private static function generateExprFromReturn(ret : haxe.macro.Type) : Expr {
        var ret = ret.toComplexType();
        switch ret {
            case TPath({pack: _, name: 'StdTypes', sub: 'Int'}):
                return macro 0;
            case TPath({pack: _, name: 'StdTypes', sub: 'Float'}):
                return macro 0.0;
            case TPath({pack: _, name: 'StdTypes', sub: 'String'}):
                return macro '';
            case TPath({pack: _, name: 'StdTypes', sub: 'Bool'}):
                return macro false;
            case TPath({pack: _, name: 'StdTypes', sub: 'Void'}):
                return macro {};
            default:
                return macro null;
        }
    }
    #end
}