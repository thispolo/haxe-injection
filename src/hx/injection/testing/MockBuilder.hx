package hx.injection.testing;

import haxe.macro.Expr.Field;
import haxe.macro.Expr;

final class MockBuilder {

    private var _fields : Array<Field>;
    
    public function new() : Void {
        _fields = new Array();
    }

    public function field(expr : Expr) : MockBuilder {
        return this;
    }

    public function returns(expr : Expr) : MockBuilder {
        return this;
    }

    public function build() : Expr {
        return macro {};
    }
}