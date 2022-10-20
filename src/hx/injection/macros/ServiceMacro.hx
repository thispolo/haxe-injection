package hx.injection.macros;

/*
	MIT License

	Copyright (c) 2022 Paul SG Cross

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
 */
import haxe.display.Display.Package;
import haxe.ds.StringMap;
#if macro

import haxe.macro.Context;
import haxe.macro.Type.Ref;
import haxe.macro.Expr;
import haxe.macro.Type.ClassType;

class ServiceMacro {
	public static function build() {
		var fields = Context.getBuildFields();
		var classType = Context.getLocalClass().get();
		var interfaces = classType.interfaces;

		var funcName = "getConstructorArgs";

		if (classType.isInterface) {
			return fields;
		}

		for (field in fields)
			if (field.name == funcName)
				return fields;

		var constructorArgs = [];
		for (field in fields) {
			if (field.name == "new") {
				var pos = field.pos;
				var metas = field.meta;

				var names = new StringMap();
				if(metas != null) {
					for(meta in metas) {
						if(meta.name == ':binding') {
							var expr1 = meta.params[0].expr;
							var expr2 = meta.params[1].expr;
							switch([expr1, expr2]) {
								case [EConst(CIdent(s1)), _]:
									switch (field.kind) {
										case FFun(f):
											var check = false;
											for(arg in f.args) {
												if(arg.name == s1) {
													check = true;
													break;
												}
											}
											if(!check)
												Context.error('No such argument ${s1} for ${Context.getLocalModule()}', pos);
										default:
									}
									var type = getClassType(expr2);
									try {
										Context.getType(type);
									} catch (e : Dynamic) {
										Context.error('No such type \"${type}\"" exists to bind in ${Context.getLocalModule()}', pos);
									}
									names.set(s1, type);
								default:
							}
						}
					}
				}
				
				switch (field.kind) {
					case FFun(f):
						var argNum = 1;
						for (arg in f.args) {
							var type = Context.resolveType(arg.type, pos);
							switch (type) {
								case TInst(t, params):
									var argName = names.get(arg.name);

									if(argName == null) {
										for (int in interfaces) {
											if (int.t.toString() == t.toString()) {
												throw 'Service: Argument ${argNum} of type \'${t.toString()}\' in ${classType.name} is recursive.';
											}
										}
									}

									var parameterArgs = paramsToString(params);
									
									var serviceName = argName != null? '|' + argName : '';
									constructorArgs.push('${t.toString()}${parameterArgs}${serviceName}');
								case TType(t, params):
									var type = t.toString();
									if(type == 'Iterable') {
										var out = '(';
										var param = params[0];
										switch(param) {
											case TInst(t, params):
												out += t.toString() + paramsToString(params);
											default:
										}
										out += ')';
										constructorArgs.push('${t.toString()}$out');
									}
								default:
									throw "Service Builder: Constructor parameter types must be either a class or an interface.";
							}
							argNum++;
						}
					default:
				}
				
				var access = [Access.APrivate];
				if(superClassIsService(classType)) {
					access.push(Access.AOverride);
				}
				
				var newField = {
					name: funcName,
					access: access,
					kind: FFun({args: [], ret: macro: Array<String>, expr: macro return $v{constructorArgs}}),
					pos: Context.currentPos(),
				}
				fields.push(newField);
			}
		}
		return fields;
	}

	private static function paramsToString(params : Array<haxe.macro.Type>) : String {
		var parameterArgs = '';
		for (param in params) {
			switch(param) {
				case TAbstract(t, params):
					parameterArgs += '_' + t.toString().split('.').join('_');
				case TInst(t, params):
					parameterArgs += '_' + t.toString().split('.').join('_');
				default:
			}
		}
		return parameterArgs;
	}

	private static function getClassType(expr : ExprDef) : String {
		var out = '';
		switch(expr) {
			case EField(e, field):
				out += getClassType(e.expr) + '.' + field;
			case EConst(CIdent(s)):
				out += s;
			default:
		}
		return out;
	}

	private static function interfaceIsService(interfaces : Array<{t:Ref<ClassType>, params:Array<haxe.macro.Type>}>) : Bool {
		var result = false;
		if(interfaces != null) {
			for (int in interfaces) {
				var interfaceType = int.t.get();
				if(interfaceType.name == 'Service') {
					return true;
				}
				result = result || interfaceIsService(interfaceType.interfaces);
			}
		}
		return result;
	}

	private static function superClassIsService(type : ClassType) : Bool {
		var superClass = type.superClass;
		if(superClass != null) {
			var superType = superClass.t.get();
			if(interfaceIsService(superType.interfaces)) {
				return true;
			}
			return superClassIsService(superType);
		} else return false;
	}
}
#end
