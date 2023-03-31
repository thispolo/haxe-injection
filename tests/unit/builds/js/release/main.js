(function ($global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = "EReg";
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = "HxOverrides";
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
var json2object_reader_BaseParser = function(errors,putils,errorType) {
	this.errors = errors;
	this.putils = putils;
	this.errorType = errorType;
};
$hxClasses["json2object.reader.BaseParser"] = json2object_reader_BaseParser;
json2object_reader_BaseParser.__name__ = "json2object.reader.BaseParser";
json2object_reader_BaseParser.prototype = {
	value: null
	,errors: null
	,errorType: null
	,putils: null
	,fromJson: function(jsonString,filename) {
		if(filename == null) {
			filename = "";
		}
		this.putils = new json2object_PositionUtils(jsonString);
		this.errors = [];
		try {
			var json = new hxjsonast_Parser(jsonString,filename).doParse();
			this.loadJson(json);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(((_g1) instanceof hxjsonast_Error)) {
				var e = _g1;
				this.errors.push(json2object_Error.ParserError(e.message,this.putils.convertPosition(e.pos)));
			} else {
				throw _g;
			}
		}
		return this.value;
	}
	,loadJson: function(json,variable) {
		if(variable == null) {
			variable = "";
		}
		var pos = this.putils.convertPosition(json.pos);
		var _g = json.value;
		switch(_g._hx_index) {
		case 0:
			var s = _g.s;
			this.loadJsonString(s,pos,variable);
			break;
		case 1:
			var n = _g.s;
			this.loadJsonNumber(n,pos,variable);
			break;
		case 2:
			var o = _g.fields;
			this.loadJsonObject(o,pos,variable);
			break;
		case 3:
			var a = _g.values;
			this.loadJsonArray(a,pos,variable);
			break;
		case 4:
			var b = _g.b;
			this.loadJsonBool(b,pos,variable);
			break;
		case 5:
			this.loadJsonNull(pos,variable);
			break;
		}
		return this.value;
	}
	,loadJsonNull: function(pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadJsonString: function(s,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadString: function(s,pos,variable,validValues,defaultValue) {
		if(validValues.indexOf(s) != -1) {
			return s;
		}
		this.onIncorrectType(pos,variable);
		return defaultValue;
	}
	,loadJsonNumber: function(f,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadJsonUInt: function(f,pos,variable,value) {
		var uint = 0;
		f = StringTools.trim(f);
		var neg = f.charAt(0) == "-";
		if(neg) {
			f = HxOverrides.substr(f,1,null);
		}
		var hex = StringTools.startsWith(f,"0x");
		if(hex) {
			f = HxOverrides.substr(f,2,null);
		}
		var base = hex ? 16 : 10;
		var pow = 1;
		var i = f.length - 1;
		while(i >= 0) {
			var cur = hex ? Std.parseInt("0x" + f.charAt(i)) : Std.parseInt(f.charAt(i));
			if(cur == null) {
				this.onIncorrectType(pos,variable);
				return value;
			}
			uint = uint + pow * cur;
			pow *= base;
			--i;
		}
		return uint;
	}
	,loadJsonInt: function(f,pos,variable,value) {
		if(Std.parseInt(f) != null && Std.parseInt(f) == parseFloat(f)) {
			return Std.parseInt(f);
		}
		this.onIncorrectType(pos,variable);
		return value;
	}
	,loadJsonFloat: function(f,pos,variable,value) {
		if(Std.parseInt(f) != null) {
			return parseFloat(f);
		}
		this.onIncorrectType(pos,variable);
		return value;
	}
	,loadJsonBool: function(b,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadJsonArray: function(a,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadJsonArrayValue: function(a,loadJsonFn,variable) {
		var _g = [];
		var _g1 = 0;
		while(_g1 < a.length) {
			var j = a[_g1];
			++_g1;
			var tmp;
			try {
				tmp = loadJsonFn(j,variable);
			} catch( _g2 ) {
				haxe_NativeStackTrace.lastError = _g2;
				var _g3 = haxe_Exception.caught(_g2).unwrap();
				if(js_Boot.__instanceof(_g3,json2object_InternalError)) {
					var e = _g3;
					if(e != json2object_InternalError.ParsingThrow) {
						throw haxe_Exception.thrown(e);
					}
					continue;
				} else {
					throw _g2;
				}
			}
			_g.push(tmp);
		}
		return _g;
	}
	,loadJsonObject: function(o,pos,variable) {
		this.onIncorrectType(pos,variable);
	}
	,loadObjectField: function(loadJsonFn,field,name,assigned,defaultValue,pos) {
		try {
			var ret = loadJsonFn(field.value,field.name);
			this.mapSet(assigned,name,true);
			return ret;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(js_Boot.__instanceof(_g1,json2object_InternalError)) {
				var e = _g1;
				if(e != json2object_InternalError.ParsingThrow) {
					throw haxe_Exception.thrown(e);
				}
			} else {
				var e = _g1;
				this.errors.push(json2object_Error.CustomFunctionException(e,pos));
			}
		}
		return defaultValue;
	}
	,loadObjectFieldReflect: function(loadJsonFn,field,name,assigned,pos) {
		try {
			this.value[name] = loadJsonFn(field.value,field.name);
			this.mapSet(assigned,name,true);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var _g1 = haxe_Exception.caught(_g).unwrap();
			if(js_Boot.__instanceof(_g1,json2object_InternalError)) {
				var e = _g1;
				if(e != json2object_InternalError.ParsingThrow) {
					throw haxe_Exception.thrown(e);
				}
			} else {
				var e = _g1;
				this.errors.push(json2object_Error.CustomFunctionException(e,pos));
			}
		}
	}
	,objectSetupAssign: function(assigned,keys,values) {
		var _g = 0;
		var _g1 = keys.length;
		while(_g < _g1) {
			var i = _g++;
			this.mapSet(assigned,keys[i],values[i]);
		}
	}
	,objectErrors: function(assigned,pos) {
		var lastPos = this.putils.convertPosition(new hxjsonast_Position(pos.file,pos.max - 1,pos.max - 1));
		var h = assigned.h;
		var s_h = h;
		var s_keys = Object.keys(h);
		var s_length = s_keys.length;
		var s_current = 0;
		while(s_current < s_length) {
			var s = s_keys[s_current++];
			if(!assigned.h[s]) {
				this.errors.push(json2object_Error.UninitializedVariable(s,lastPos));
			}
		}
	}
	,onIncorrectType: function(pos,variable) {
		this.parsingThrow();
	}
	,parsingThrow: function() {
		if(this.errorType != 0) {
			throw haxe_Exception.thrown(json2object_InternalError.ParsingThrow);
		}
	}
	,objectThrow: function(pos,variable) {
		if(this.errorType == 2) {
			throw haxe_Exception.thrown(json2object_InternalError.ParsingThrow);
		}
		if(this.errorType == 1) {
			this.errors.push(json2object_Error.UninitializedVariable(variable,pos));
		}
	}
	,mapSet: function(map,key,value) {
		map.h[key] = value;
	}
	,__class__: json2object_reader_BaseParser
};
var JsonParser_$12 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_12"] = JsonParser_$12;
JsonParser_$12.__name__ = "JsonParser_12";
JsonParser_$12.__super__ = json2object_reader_BaseParser;
JsonParser_$12.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ line : Int, file : String }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["file","line"],[false,false]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "file":
				this.value.file = this.loadObjectField(($_=new JsonParser_$6(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"file",assigned,this.value.file,pos);
				break;
			case "line":
				this.value.line = this.loadObjectField(($_=new JsonParser_$15(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"line",assigned,this.value.line,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { file : new JsonParser_$6([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), line : new JsonParser_$15([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$12
});
var JsonParser_$15 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
	this.value = 0;
};
$hxClasses["JsonParser_15"] = JsonParser_$15;
JsonParser_$15.__name__ = "JsonParser_15";
JsonParser_$15.__super__ = json2object_reader_BaseParser;
JsonParser_$15.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"Int",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNumber: function(f,pos,variable) {
		this.value = this.loadJsonInt(f,pos,variable,this.value);
	}
	,getAuto: function() {
		return new JsonParser_$15([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$15
});
var JsonParser_$17 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_17"] = JsonParser_$17;
JsonParser_$17.__name__ = "JsonParser_17";
JsonParser_$17.__super__ = json2object_reader_BaseParser;
JsonParser_$17.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ timestamp : Float, state : _testadapter.data.TestState, name : String, message : String, ?line : Null<Int>, ?executionTime : Null<Float>, ?errorPos : Null<_testadapter.data.Pos> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["errorPos","executionTime","line","message","name","state","timestamp"],[true,true,true,false,false,false,false]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "errorPos":
				this.value.errorPos = this.loadObjectField(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"errorPos",assigned,this.value.errorPos,pos);
				break;
			case "executionTime":
				this.value.executionTime = this.loadObjectField(($_=new JsonParser_$21(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"executionTime",assigned,this.value.executionTime,pos);
				break;
			case "line":
				this.value.line = this.loadObjectField(($_=new JsonParser_$23(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"line",assigned,this.value.line,pos);
				break;
			case "message":
				this.value.message = this.loadObjectField(($_=new JsonParser_$6(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"message",assigned,this.value.message,pos);
				break;
			case "name":
				this.value.name = this.loadObjectField(($_=new JsonParser_$6(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"name",assigned,this.value.name,pos);
				break;
			case "state":
				this.value.state = this.loadObjectField(($_=new JsonParser_$24(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"state",assigned,this.value.state,pos);
				break;
			case "timestamp":
				this.value.timestamp = this.loadObjectField(($_=new JsonParser_$25(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"timestamp",assigned,this.value.timestamp,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { errorPos : new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), executionTime : new JsonParser_$21([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), line : new JsonParser_$23([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), message : new JsonParser_$6([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), name : new JsonParser_$6([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), state : new JsonParser_$24([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), timestamp : new JsonParser_$25([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$17
});
var JsonParser_$2 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_2"] = JsonParser_$2;
JsonParser_$2.__name__ = "JsonParser_2";
JsonParser_$2.__super__ = json2object_reader_BaseParser;
JsonParser_$2.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"haxe.ds.Map<String, _testadapter.data.ClassPosition>",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		this.value = new haxe_ds_StringMap();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			var this1 = this.value;
			var key;
			try {
				var key1 = new JsonParser_$6(this.errors,this.putils,2);
				var _this = this.putils;
				key = key1.loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JString(field.name),new hxjsonast_Position(pos.file,pos.min - 1,pos.max - 1)),variable);
			} catch( _g1 ) {
				haxe_NativeStackTrace.lastError = _g1;
				var _g2 = haxe_Exception.caught(_g1).unwrap();
				if(js_Boot.__instanceof(_g2,json2object_InternalError)) {
					var e = _g2;
					if(e != json2object_InternalError.ParsingThrow) {
						throw haxe_Exception.thrown(e);
					}
					continue;
				} else {
					throw _g1;
				}
			}
			var value;
			try {
				value = new JsonParser_$29(this.errors,this.putils,2).loadJson(field.value,field.name);
			} catch( _g3 ) {
				haxe_NativeStackTrace.lastError = _g3;
				var _g4 = haxe_Exception.caught(_g3).unwrap();
				if(js_Boot.__instanceof(_g4,json2object_InternalError)) {
					var e1 = _g4;
					if(e1 != json2object_InternalError.ParsingThrow) {
						throw haxe_Exception.thrown(e1);
					}
					continue;
				} else {
					throw _g3;
				}
			}
			this1.h[key] = value;
		}
	}
	,getAuto: function() {
		return new JsonParser_$2([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$2
});
var JsonParser_$21 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_21"] = JsonParser_$21;
JsonParser_$21.__name__ = "JsonParser_21";
JsonParser_$21.__super__ = json2object_reader_BaseParser;
JsonParser_$21.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"Float",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonNumber: function(f,pos,variable) {
		this.value = this.loadJsonFloat(f,pos,variable,this.value);
	}
	,getAuto: function() {
		return new JsonParser_$21([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$21
});
var JsonParser_$23 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_23"] = JsonParser_$23;
JsonParser_$23.__name__ = "JsonParser_23";
JsonParser_$23.__super__ = json2object_reader_BaseParser;
JsonParser_$23.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"Int",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonNumber: function(f,pos,variable) {
		this.value = this.loadJsonInt(f,pos,variable,this.value);
	}
	,getAuto: function() {
		return new JsonParser_$23([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$23
});
var JsonParser_$24 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_24"] = JsonParser_$24;
JsonParser_$24.__name__ = "JsonParser_24";
JsonParser_$24.__super__ = json2object_reader_BaseParser;
JsonParser_$24.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.value = "success";
		this.errors.push(json2object_Error.IncorrectType(variable,"_testadapter.data.TestState",pos));
		this.objectThrow(pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonString: function(s,pos,variable) {
		this.value = this.loadString(s,pos,variable,["success","failure","error","ignore"],"success");
	}
	,getAuto: function() {
		return new JsonParser_$24([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$24
});
var JsonParser_$25 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
	this.value = 0;
};
$hxClasses["JsonParser_25"] = JsonParser_$25;
JsonParser_$25.__name__ = "JsonParser_25";
JsonParser_$25.__super__ = json2object_reader_BaseParser;
JsonParser_$25.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"Float",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNumber: function(f,pos,variable) {
		this.value = this.loadJsonFloat(f,pos,variable,this.value);
	}
	,getAuto: function() {
		return new JsonParser_$25([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$25
});
var JsonParser_$29 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_29"] = JsonParser_$29;
JsonParser_$29.__name__ = "JsonParser_29";
JsonParser_$29.__super__ = json2object_reader_BaseParser;
JsonParser_$29.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ pos : _testadapter.data.Pos, methods : Map<String, { line : Null<Int> }> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["methods","pos"],[false,false]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "methods":
				this.value.methods = this.loadObjectField(($_=new JsonParser_$31(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"methods",assigned,this.value.methods,pos);
				break;
			case "pos":
				this.value.pos = this.loadObjectField(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"pos",assigned,this.value.pos,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { methods : new JsonParser_$31([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), pos : new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$29
});
var JsonParser_$31 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_31"] = JsonParser_$31;
JsonParser_$31.__name__ = "JsonParser_31";
JsonParser_$31.__super__ = json2object_reader_BaseParser;
JsonParser_$31.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"haxe.ds.Map<String, { line : Null<Int> }>",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		this.value = new haxe_ds_StringMap();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			var this1 = this.value;
			var key;
			try {
				var key1 = new JsonParser_$6(this.errors,this.putils,2);
				var _this = this.putils;
				key = key1.loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JString(field.name),new hxjsonast_Position(pos.file,pos.min - 1,pos.max - 1)),variable);
			} catch( _g1 ) {
				haxe_NativeStackTrace.lastError = _g1;
				var _g2 = haxe_Exception.caught(_g1).unwrap();
				if(js_Boot.__instanceof(_g2,json2object_InternalError)) {
					var e = _g2;
					if(e != json2object_InternalError.ParsingThrow) {
						throw haxe_Exception.thrown(e);
					}
					continue;
				} else {
					throw _g1;
				}
			}
			var value;
			try {
				value = new JsonParser_$32(this.errors,this.putils,2).loadJson(field.value,field.name);
			} catch( _g3 ) {
				haxe_NativeStackTrace.lastError = _g3;
				var _g4 = haxe_Exception.caught(_g3).unwrap();
				if(js_Boot.__instanceof(_g4,json2object_InternalError)) {
					var e1 = _g4;
					if(e1 != json2object_InternalError.ParsingThrow) {
						throw haxe_Exception.thrown(e1);
					}
					continue;
				} else {
					throw _g3;
				}
			}
			this1.h[key] = value;
		}
	}
	,getAuto: function() {
		return new JsonParser_$31([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$31
});
var JsonParser_$32 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_32"] = JsonParser_$32;
JsonParser_$32.__name__ = "JsonParser_32";
JsonParser_$32.__super__ = json2object_reader_BaseParser;
JsonParser_$32.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ line : Null<Int> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["line"],[false]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			if(field.name == "line") {
				this.value.line = this.loadObjectField(($_=new JsonParser_$23(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"line",assigned,this.value.line,pos);
			} else {
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { line : new JsonParser_$23([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$32
});
var JsonParser_$4 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_4"] = JsonParser_$4;
JsonParser_$4.__name__ = "JsonParser_4";
JsonParser_$4.__super__ = json2object_reader_BaseParser;
JsonParser_$4.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ name : String, classes : Array<_testadapter.data.TestClassResults> }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["classes","name"],[false,false]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "classes":
				this.value.classes = this.loadObjectField(($_=new JsonParser_$5(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"classes",assigned,this.value.classes,pos);
				break;
			case "name":
				this.value.name = this.loadObjectField(($_=new JsonParser_$6(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"name",assigned,this.value.name,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { classes : new JsonParser_$5([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), name : new JsonParser_$6([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$4
});
var JsonParser_$5 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_5"] = JsonParser_$5;
JsonParser_$5.__name__ = "JsonParser_5";
JsonParser_$5.__super__ = json2object_reader_BaseParser;
JsonParser_$5.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"Array<_testadapter.data.TestClassResults>",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonArray: function(a,pos,variable) {
		this.value = this.loadJsonArrayValue(a,($_=new JsonParser_$8(this.errors,this.putils,2),$bind($_,$_.loadJson)),variable);
	}
	,getAuto: function() {
		return new JsonParser_$5([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$5
});
var JsonParser_$6 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_6"] = JsonParser_$6;
JsonParser_$6.__name__ = "JsonParser_6";
JsonParser_$6.__super__ = json2object_reader_BaseParser;
JsonParser_$6.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"String",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonString: function(s,pos,variable) {
		this.value = s;
	}
	,getAuto: function() {
		return new JsonParser_$6([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$6
});
var JsonParser_$8 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_8"] = JsonParser_$8;
JsonParser_$8.__name__ = "JsonParser_8";
JsonParser_$8.__super__ = json2object_reader_BaseParser;
JsonParser_$8.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"{ ?pos : Null<_testadapter.data.Pos>, name : String, methods : Array<_testadapter.data.TestMethodResults>, id : String }",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonObject: function(o,pos,variable) {
		var assigned = new haxe_ds_StringMap();
		this.objectSetupAssign(assigned,["id","methods","name","pos"],[false,false,false,true]);
		this.value = this.getAuto();
		var _g = 0;
		while(_g < o.length) {
			var field = o[_g];
			++_g;
			switch(field.name) {
			case "id":
				this.value.id = this.loadObjectField(($_=new JsonParser_$6(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"id",assigned,this.value.id,pos);
				break;
			case "methods":
				this.value.methods = this.loadObjectField(($_=new JsonParser_$9(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"methods",assigned,this.value.methods,pos);
				break;
			case "name":
				this.value.name = this.loadObjectField(($_=new JsonParser_$6(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"name",assigned,this.value.name,pos);
				break;
			case "pos":
				this.value.pos = this.loadObjectField(($_=new JsonParser_$12(this.errors,this.putils,1),$bind($_,$_.loadJson)),field,"pos",assigned,this.value.pos,pos);
				break;
			default:
				this.errors.push(json2object_Error.UnknownVariable(field.name,this.putils.convertPosition(field.namePos)));
			}
		}
		this.objectErrors(assigned,pos);
	}
	,getAuto: function() {
		return { id : new JsonParser_$6([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), methods : new JsonParser_$9([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), name : new JsonParser_$6([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1))), pos : new JsonParser_$12([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)))};
	}
	,__class__: JsonParser_$8
});
var JsonParser_$9 = function(errors,putils,errorType) {
	if(errorType == null) {
		errorType = 0;
	}
	json2object_reader_BaseParser.call(this,errors,putils,errorType);
};
$hxClasses["JsonParser_9"] = JsonParser_$9;
JsonParser_$9.__name__ = "JsonParser_9";
JsonParser_$9.__super__ = json2object_reader_BaseParser;
JsonParser_$9.prototype = $extend(json2object_reader_BaseParser.prototype,{
	onIncorrectType: function(pos,variable) {
		this.errors.push(json2object_Error.IncorrectType(variable,"Array<_testadapter.data.TestMethodResults>",pos));
		json2object_reader_BaseParser.prototype.onIncorrectType.call(this,pos,variable);
	}
	,loadJsonNull: function(pos,variable) {
		this.value = null;
	}
	,loadJsonArray: function(a,pos,variable) {
		this.value = this.loadJsonArrayValue(a,($_=new JsonParser_$17(this.errors,this.putils,2),$bind($_,$_.loadJson)),variable);
	}
	,getAuto: function() {
		return new JsonParser_$9([],this.putils,0).loadJson(new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position("",0,1)));
	}
	,__class__: JsonParser_$9
});
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = "Lambda";
Lambda.array = function(it) {
	var a = [];
	var i = $getIterator(it);
	while(i.hasNext()) {
		var i1 = i.next();
		a.push(i1);
	}
	return a;
};
Lambda.has = function(it,elt) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		if(x1 == elt) {
			return true;
		}
	}
	return false;
};
var Main = function() { };
$hxClasses["Main"] = Main;
Main.__name__ = "Main";
Main.main = function() {
	utest_UTest.run([new injection_InjectionTest(),new config_ConfigTest(),new lifetime_LifetimeTest(),new segregation_SegregationTest(),new destructable_DestructableTest(),new binding_BindingTest(),new iterators_IteratorTest(),new generic_GenericTest(),new protected_ProtectedTest(),new extensions_ExtensionsTest(),new utils_UtilsTest(),new consistency_ConsistencyTest(),new mocking_MockTest()]);
};
Math.__name__ = "Math";
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = "Reflect";
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return null;
	}
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) {
		return null;
	} else {
		var tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["get_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			return o[tmp]();
		} else {
			return o[field];
		}
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compare = function(a,b) {
	if(a == b) {
		return 0;
	} else if(a > b) {
		return 1;
	} else {
		return -1;
	}
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) {
		return true;
	}
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
		return false;
	}
	if(f1.scope == f2.scope && f1.method == f2.method) {
		return f1.method != null;
	} else {
		return false;
	}
};
Reflect.isObject = function(v) {
	if(v == null) {
		return false;
	}
	var t = typeof(v);
	if(!(t == "string" || t == "object" && v.__enum__ == null)) {
		if(t == "function") {
			return (v.__name__ || v.__ename__) != null;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = "Std";
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = "StringBuf";
StringBuf.prototype = {
	b: null
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = "StringTools";
StringTools.startsWith = function(s,start) {
	if(s.length >= start.length) {
		return s.lastIndexOf(start,0) == 0;
	} else {
		return false;
	}
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var ValueType = $hxEnums["ValueType"] = { __ename__:"ValueType",__constructs__:null
	,TNull: {_hx_name:"TNull",_hx_index:0,__enum__:"ValueType",toString:$estr}
	,TInt: {_hx_name:"TInt",_hx_index:1,__enum__:"ValueType",toString:$estr}
	,TFloat: {_hx_name:"TFloat",_hx_index:2,__enum__:"ValueType",toString:$estr}
	,TBool: {_hx_name:"TBool",_hx_index:3,__enum__:"ValueType",toString:$estr}
	,TObject: {_hx_name:"TObject",_hx_index:4,__enum__:"ValueType",toString:$estr}
	,TFunction: {_hx_name:"TFunction",_hx_index:5,__enum__:"ValueType",toString:$estr}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TClass",$_.__params__ = ["c"],$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType",toString:$estr}; },$_._hx_name="TEnum",$_.__params__ = ["e"],$_)
	,TUnknown: {_hx_name:"TUnknown",_hx_index:8,__enum__:"ValueType",toString:$estr}
};
ValueType.__constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TClass,ValueType.TEnum,ValueType.TUnknown];
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = "Type";
Type.getEnum = function(o) {
	if(o == null) {
		return null;
	}
	return $hxEnums[o.__enum__];
};
Type.createInstance = function(cl,args) {
	var ctor = Function.prototype.bind.apply(cl,[null].concat(args));
	return new (ctor);
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.typeof = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "function":
		if(v.__name__ || v.__ename__) {
			return ValueType.TObject;
		}
		return ValueType.TFunction;
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) {
			return ValueType.TInt;
		}
		return ValueType.TFloat;
	case "object":
		if(v == null) {
			return ValueType.TNull;
		}
		var e = v.__enum__;
		if(e != null) {
			return ValueType.TEnum($hxEnums[e]);
		}
		var c = js_Boot.getClass(v);
		if(c != null) {
			return ValueType.TClass(c);
		}
		return ValueType.TObject;
	case "string":
		return ValueType.TClass(String);
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumParameters = function(e) {
	var enm = $hxEnums[e.__enum__];
	var params = enm.__constructs__[e._hx_index].__params__;
	if(params != null) {
		var _g = [];
		var _g1 = 0;
		while(_g1 < params.length) {
			var p = params[_g1];
			++_g1;
			_g.push(e[p]);
		}
		return _g;
	} else {
		return [];
	}
};
var _$testadapter_data_Data = function() { };
$hxClasses["_testadapter.data.Data"] = _$testadapter_data_Data;
_$testadapter_data_Data.__name__ = "_testadapter.data.Data";
_$testadapter_data_Data.save = function(path,content) {
	var directory = haxe_io_Path.directory(path);
	if(!sys_FileSystem.exists(directory)) {
		sys_FileSystem.createDirectory(directory);
	}
	js_node_Fs.writeFileSync(path,JSON.stringify(content,null,"\t"));
};
_$testadapter_data_Data.clear = function(path) {
	if(sys_FileSystem.exists(path)) {
		js_node_Fs.unlinkSync(path);
	}
};
var _$testadapter_data_SuiteIdentifier = $hxEnums["_testadapter.data.SuiteIdentifier"] = { __ename__:"_testadapter.data.SuiteIdentifier",__constructs__:null
	,ClassName: ($_=function(className) { return {_hx_index:0,className:className,__enum__:"_testadapter.data.SuiteIdentifier",toString:$estr}; },$_._hx_name="ClassName",$_.__params__ = ["className"],$_)
	,SuiteNameAndPos: ($_=function(name,fileName,lineNumber) { return {_hx_index:1,name:name,fileName:fileName,lineNumber:lineNumber,__enum__:"_testadapter.data.SuiteIdentifier",toString:$estr}; },$_._hx_name="SuiteNameAndPos",$_.__params__ = ["name","fileName","lineNumber"],$_)
	,SuiteNameAndFile: ($_=function(name,fileName) { return {_hx_index:2,name:name,fileName:fileName,__enum__:"_testadapter.data.SuiteIdentifier",toString:$estr}; },$_._hx_name="SuiteNameAndFile",$_.__params__ = ["name","fileName"],$_)
};
_$testadapter_data_SuiteIdentifier.__constructs__ = [_$testadapter_data_SuiteIdentifier.ClassName,_$testadapter_data_SuiteIdentifier.SuiteNameAndPos,_$testadapter_data_SuiteIdentifier.SuiteNameAndFile];
var _$testadapter_data_TestIdentifier = $hxEnums["_testadapter.data.TestIdentifier"] = { __ename__:"_testadapter.data.TestIdentifier",__constructs__:null
	,TestName: ($_=function(name) { return {_hx_index:0,name:name,__enum__:"_testadapter.data.TestIdentifier",toString:$estr}; },$_._hx_name="TestName",$_.__params__ = ["name"],$_)
	,TestNameAndPos: ($_=function(name,fileName,lineNumber) { return {_hx_index:1,name:name,fileName:fileName,lineNumber:lineNumber,__enum__:"_testadapter.data.TestIdentifier",toString:$estr}; },$_._hx_name="TestNameAndPos",$_.__params__ = ["name","fileName","lineNumber"],$_)
};
_$testadapter_data_TestIdentifier.__constructs__ = [_$testadapter_data_TestIdentifier.TestName,_$testadapter_data_TestIdentifier.TestNameAndPos];
var _$testadapter_data_SuiteId = {};
_$testadapter_data_SuiteId.toString = function(this1) {
	switch(this1._hx_index) {
	case 0:
		var className = this1.className;
		return className;
	case 1:
		var name = this1.name;
		var fileName = this1.fileName;
		var lineNumber = this1.lineNumber;
		return "" + name + " [" + fileName + ":" + lineNumber + "]";
	case 2:
		var name = this1.name;
		var fileName = this1.fileName;
		return "" + name + " [" + fileName + "]";
	}
};
var _$testadapter_data_TestFilter = function(baseFolder) {
	this.baseFolder = baseFolder;
	this.testFilters = { include : [], exclude : []};
	this.loaded = false;
};
$hxClasses["_testadapter.data.TestFilter"] = _$testadapter_data_TestFilter;
_$testadapter_data_TestFilter.__name__ = "_testadapter.data.TestFilter";
_$testadapter_data_TestFilter.hasFilters = function(testFilters) {
	if(testFilters != null) {
		return testFilters.include.length + testFilters.exclude.length > 0;
	} else {
		return false;
	}
};
_$testadapter_data_TestFilter.shouldRunTest = function(testFilters,className,testName) {
	if(!_$testadapter_data_TestFilter.hasFilters(testFilters)) {
		return true;
	}
	var location = "" + className + "." + testName;
	var _g = 0;
	var _g1 = testFilters.exclude;
	while(_g < _g1.length) {
		var filter = _g1[_g];
		++_g;
		if(location == filter) {
			return false;
		}
		if(StringTools.startsWith(location,filter + ".")) {
			return false;
		}
	}
	var _g = 0;
	var _g1 = testFilters.include;
	while(_g < _g1.length) {
		var filter = _g1[_g];
		++_g;
		if(location == filter) {
			return true;
		}
		if(StringTools.startsWith(location,filter + ".")) {
			return true;
		}
	}
	return false;
};
_$testadapter_data_TestFilter.prototype = {
	testFilters: null
	,baseFolder: null
	,loaded: null
	,set: function(include,exclude) {
		this.testFilters.include = [];
		this.testFilters.exclude = [];
		var _g = 0;
		while(_g < include.length) {
			var f = include[_g];
			++_g;
			if(StringTools.startsWith(f,"root:")) {
				this.testFilters.include = [];
				break;
			}
			this.testFilters.include.push(f);
		}
		var _g = 0;
		while(_g < exclude.length) {
			var f = exclude[_g];
			++_g;
			this.testFilters.exclude.push(f);
		}
		this.save(this.baseFolder);
	}
	,get: function() {
		if(!this.loaded) {
			this.load();
		}
		return this.testFilters;
	}
	,clear: function() {
		this.testFilters.include = [];
		this.testFilters.exclude = [];
		this.save();
	}
	,save: function(baseFolder) {
		var fileName = this.getFileName(baseFolder);
		if(_$testadapter_data_TestFilter.hasFilters(this.testFilters)) {
			_$testadapter_data_Data.save(fileName,this.testFilters);
		} else {
			_$testadapter_data_Data.clear(fileName);
		}
	}
	,load: function() {
		this.testFilters.include = [];
		this.testFilters.exclude = [];
		var fileName = this.getFileName();
		if(!sys_FileSystem.exists(fileName)) {
			return;
		}
		var content = js_node_Fs.readFileSync(fileName,{ encoding : "utf8"});
		var filters = JSON.parse(content);
		var _g = 0;
		var _g1 = filters.include;
		while(_g < _g1.length) {
			var filter = _g1[_g];
			++_g;
			var reg_r = new RegExp(" <[0-9]+>","".split("u").join(""));
			filter = filter.replace(reg_r,"");
			this.testFilters.include.push(filter);
		}
		var _g = 0;
		var _g1 = filters.exclude;
		while(_g < _g1.length) {
			var filter = _g1[_g];
			++_g;
			var reg_r = new RegExp(" <[0-9]+>","".split("u").join(""));
			filter = filter.replace(reg_r,"");
			this.testFilters.exclude.push(filter);
		}
		this.loaded = true;
	}
	,getFileName: function(baseFolder) {
		return haxe_io_Path.join([baseFolder,".unittest","filter.json"]);
	}
	,__class__: _$testadapter_data_TestFilter
};
var _$testadapter_data_TestPositions = function(baseFolder,positions) {
	this.baseFolder = baseFolder;
	this.positions = positions;
};
$hxClasses["_testadapter.data.TestPositions"] = _$testadapter_data_TestPositions;
_$testadapter_data_TestPositions.__name__ = "_testadapter.data.TestPositions";
_$testadapter_data_TestPositions.load = function(baseFolder) {
	var fileName = _$testadapter_data_TestPositions.getFileName(baseFolder);
	if(!sys_FileSystem.exists(fileName)) {
		return null;
	}
	var content = js_node_Fs.readFileSync(fileName,{ encoding : "utf8"});
	var parser = new JsonParser_$2();
	var positions = parser.fromJson(content,fileName);
	return new _$testadapter_data_TestPositions(baseFolder,positions);
};
_$testadapter_data_TestPositions.getFileName = function(baseFolder) {
	return haxe_io_Path.join([baseFolder,".unittest","positions.json"]);
};
_$testadapter_data_TestPositions.prototype = {
	baseFolder: null
	,positions: null
	,add: function(className,testName,pos) {
		if(testName == null) {
			var this1 = this.positions;
			var v = { methods : new haxe_ds_StringMap(), pos : pos};
			this1.h[className] = v;
		} else {
			if(this.positions.h[className] == null) {
				var this1 = this.positions;
				var v = { methods : new haxe_ds_StringMap(), pos : pos};
				this1.h[className] = v;
			}
			var v = { line : pos.line};
			this.positions.h[className].methods.h[testName] = v;
		}
	}
	,get: function(className,testName) {
		var clazz = this.positions.h[className];
		if(clazz == null || clazz.pos == null || clazz.methods == null) {
			return null;
		}
		if(testName == null) {
			return clazz.pos;
		}
		if(clazz.methods.h[testName] == null) {
			return clazz.pos;
		}
		return { file : clazz.pos.file, line : clazz.methods.h[testName].line};
	}
	,resolveClassName: function(fileName,lineNumber) {
		var h = this.positions.h;
		var clazz_h = h;
		var clazz_keys = Object.keys(h);
		var clazz_length = clazz_keys.length;
		var clazz_current = 0;
		while(clazz_current < clazz_length) {
			var clazz = clazz_keys[clazz_current++];
			var classPositions = this.positions.h[clazz];
			if(classPositions.pos.file != fileName) {
				continue;
			}
			if(classPositions.pos.line == lineNumber) {
				return clazz;
			}
			var h = classPositions.methods.h;
			var method_h = h;
			var method_keys = Object.keys(h);
			var method_length = method_keys.length;
			var method_current = 0;
			while(method_current < method_length) {
				var method = method_keys[method_current++];
				var methodPos = classPositions.methods.h[method];
				if(methodPos.line == lineNumber) {
					return clazz;
				}
			}
		}
		return null;
	}
	,save: function() {
		_$testadapter_data_Data.save(_$testadapter_data_TestPositions.getFileName(this.baseFolder),this.positions);
	}
	,__class__: _$testadapter_data_TestPositions
};
var _$testadapter_data_TestResults = function(baseFolder) {
	this.baseFolder = baseFolder;
	this.positions = _$testadapter_data_TestPositions.load(baseFolder);
	this.suiteResults = _$testadapter_data_TestResults.load(baseFolder);
};
$hxClasses["_testadapter.data.TestResults"] = _$testadapter_data_TestResults;
_$testadapter_data_TestResults.__name__ = "_testadapter.data.TestResults";
_$testadapter_data_TestResults.clear = function(baseFolder) {
	_$testadapter_data_Data.clear(_$testadapter_data_TestResults.getFileName(baseFolder));
};
_$testadapter_data_TestResults.load = function(baseFolder) {
	var emptySuite = function() {
		return { name : "root", classes : []};
	};
	var dataFile = _$testadapter_data_TestResults.getFileName(baseFolder);
	if(!sys_FileSystem.exists(dataFile)) {
		return emptySuite();
	}
	var content = js_node_Fs.readFileSync(dataFile,{ encoding : "utf8"});
	var parser = new JsonParser_$4();
	return parser.fromJson(content,dataFile);
};
_$testadapter_data_TestResults.getFileName = function(baseFolder) {
	return haxe_io_Path.join([baseFolder,_$testadapter_data_TestResults.getRelativeFileName()]);
};
_$testadapter_data_TestResults.getRelativeFileName = function() {
	return haxe_io_Path.join([".unittest","results.json"]);
};
_$testadapter_data_TestResults.prototype = {
	baseFolder: null
	,suiteResults: null
	,positions: null
	,add: function(suiteId,testId,executionTime,state,message,errorPos) {
		var line = null;
		var className;
		var suitePos;
		switch(suiteId._hx_index) {
		case 0:
			var name = suiteId.className;
			className = name;
			suitePos = this.positions.get(className,null);
			break;
		case 1:
			var name = suiteId.name;
			var fileName = suiteId.fileName;
			var lineNumber = suiteId.lineNumber;
			className = name;
			suitePos = { file : fileName, line : lineNumber};
			break;
		case 2:
			var name = suiteId.name;
			var fileName = suiteId.fileName;
			className = name;
			suitePos = { file : fileName, line : 0};
			break;
		}
		var testName;
		switch(testId._hx_index) {
		case 0:
			var name = testId.name;
			testName = name;
			var pos = this.positions.get(_$testadapter_data_SuiteId.toString(suiteId),name);
			if(pos != null) {
				line = pos.line;
			}
			break;
		case 1:
			var _g = testId.fileName;
			var name = testId.name;
			var lineNumber = testId.lineNumber;
			testName = name;
			line = lineNumber;
			break;
		}
		var makeTest = function() {
			var testName1 = testName;
			var executionTime1 = executionTime;
			var state1 = state;
			var message1 = message;
			var hrtime = process.hrtime();
			return { name : testName1, executionTime : executionTime1, state : state1, message : message1, timestamp : hrtime[0] + hrtime[1] / 1e9, line : line, errorPos : errorPos};
		};
		var _g = 0;
		var _g1 = this.suiteResults.classes;
		while(_g < _g1.length) {
			var data = _g1[_g];
			++_g;
			if(data.id == _$testadapter_data_SuiteId.toString(suiteId)) {
				var _g2 = [];
				var _g3 = 0;
				var _g4 = data.methods;
				while(_g3 < _g4.length) {
					var v = _g4[_g3];
					++_g3;
					if(v.name != testName) {
						_g2.push(v);
					}
				}
				data.methods = _g2;
				data.methods.push(makeTest());
				return;
			}
		}
		this.suiteResults.classes.push({ id : _$testadapter_data_SuiteId.toString(suiteId), name : className, methods : [makeTest()], pos : suitePos});
	}
	,save: function() {
		this.suiteResults.classes.sort($bind(this,this.sortClasses));
		_$testadapter_data_Data.save(_$testadapter_data_TestResults.getFileName(this.baseFolder),this.suiteResults);
	}
	,sortClasses: function(a,b) {
		if(a.id < b.id) {
			return -1;
		}
		if(a.id > b.id) {
			return 1;
		}
		return 0;
	}
	,__class__: _$testadapter_data_TestResults
};
var utest_ui_common_IReport = function() { };
$hxClasses["utest.ui.common.IReport"] = utest_ui_common_IReport;
utest_ui_common_IReport.__name__ = "utest.ui.common.IReport";
utest_ui_common_IReport.__isInterface__ = true;
utest_ui_common_IReport.prototype = {
	displaySuccessResults: null
	,displayHeader: null
	,setHandler: null
	,__class__: utest_ui_common_IReport
};
var _$testadapter_utest_Reporter = function(runner,baseFolder) {
	this.testResults = new _$testadapter_data_TestResults(baseFolder);
	this.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.NeverShowSuccessResults;
	this.displayHeader = utest_ui_common_HeaderDisplayMode.NeverShowHeader;
	this.aggregator = new utest_ui_common_ResultAggregator(runner,true);
	this.aggregator.onComplete.add($bind(this,this.complete));
};
$hxClasses["_testadapter.utest.Reporter"] = _$testadapter_utest_Reporter;
_$testadapter_utest_Reporter.__name__ = "_testadapter.utest.Reporter";
_$testadapter_utest_Reporter.__interfaces__ = [utest_ui_common_IReport];
_$testadapter_utest_Reporter.prototype = {
	displaySuccessResults: null
	,displayHeader: null
	,testResults: null
	,aggregator: null
	,complete: function(result) {
		var _g = 0;
		var _g1 = result.packageNames();
		while(_g < _g1.length) {
			var packageName = _g1[_g];
			++_g;
			var pack = result.getPackage(packageName);
			var _g2 = 0;
			var _g3 = pack.classNames();
			while(_g2 < _g3.length) {
				var className = _g3[_g2];
				++_g2;
				var cls = pack.getClass(className);
				var _g4 = 0;
				var _g5 = cls.methodNames();
				while(_g4 < _g5.length) {
					var testName = _g5[_g4];
					++_g4;
					var fix = cls.get(testName);
					var message = null;
					var state = "failure";
					var errorPos = null;
					var _g6 = fix.iterator();
					_hx_loop4: while(_g6.head != null) {
						var val = _g6.head.item;
						_g6.head = _g6.head.next;
						var assertation = val;
						switch(assertation._hx_index) {
						case 0:
							var _g7 = assertation.pos;
							state = "success";
							break;
						case 1:
							var msg = assertation.msg;
							var pos = assertation.pos;
							state = "failure";
							message = msg;
							errorPos = { line : pos.lineNumber - 1, file : pos.fileName};
							break _hx_loop4;
						case 2:
							var e = assertation.e;
							var s = assertation.stack;
							state = "error";
							message = Std.string(e) + this.dumpStack(s);
							break _hx_loop4;
						case 3:
							var e1 = assertation.e;
							var s1 = assertation.stack;
							state = "error";
							message = Std.string(e1) + this.dumpStack(s1);
							break _hx_loop4;
						case 4:
							var e2 = assertation.e;
							var s2 = assertation.stack;
							state = "error";
							message = Std.string(e2) + this.dumpStack(s2);
							break _hx_loop4;
						case 5:
							var missedAsyncs = assertation.missedAsyncs;
							var s3 = assertation.stack;
							state = "error";
							message = "missed async calls: " + missedAsyncs + this.dumpStack(s3);
							break _hx_loop4;
						case 6:
							var e3 = assertation.e;
							var s4 = assertation.stack;
							state = "error";
							message = Std.string(e3) + this.dumpStack(s4);
							break _hx_loop4;
						case 7:
							var msg1 = assertation.msg;
							state = "failure";
							message = msg1;
							break _hx_loop4;
						case 8:
							var reason = assertation.reason;
							state = "ignore";
							message = reason;
							break;
						}
					}
					var dotPath = packageName == "" ? className : "" + packageName + "." + className;
					var executionTime = null;
					if(Object.prototype.hasOwnProperty.call(fix,"executionTime")) {
						executionTime = Reflect.field(fix,"executionTime");
					}
					this.testResults.add(_$testadapter_data_SuiteIdentifier.ClassName(dotPath),_$testadapter_data_TestIdentifier.TestName(testName),executionTime,state,message,errorPos);
				}
			}
		}
		this.testResults.save();
	}
	,dumpStack: function(stack) {
		if(stack.length == 0) {
			return "";
		}
		var parts = haxe_CallStack.toString(stack).split("\n");
		var r = [];
		var _g = 0;
		while(_g < parts.length) {
			var part = parts[_g];
			++_g;
			if(part.indexOf(" utest.") >= 0) {
				continue;
			}
			r.push(part);
		}
		return r.join("\n");
	}
	,setHandler: function(handler) {
	}
	,__class__: _$testadapter_utest_Reporter
};
var utest_ITest = function() { };
$hxClasses["utest.ITest"] = utest_ITest;
utest_ITest.__name__ = "utest.ITest";
utest_ITest.__isInterface__ = true;
var utest_Test = function() {
};
$hxClasses["utest.Test"] = utest_Test;
utest_Test.__name__ = "utest.Test";
utest_Test.__interfaces__ = [utest_ITest];
utest_Test.prototype = {
	__initializeUtest__: function() {
		var init = { tests : [], dependencies : [], accessories : { }};
		return init;
	}
	,__class__: utest_Test
};
var binding_BindingTest = function() {
	utest_Test.call(this);
};
$hxClasses["binding.BindingTest"] = binding_BindingTest;
binding_BindingTest.__name__ = "binding.BindingTest";
binding_BindingTest.__super__ = utest_Test;
binding_BindingTest.prototype = $extend(utest_Test.prototype,{
	testBinding: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,binding_ChainedDependency.__name__,binding_FirstChainDependency);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,binding_ChainedDependency.__name__,binding_SecondChainDependency).asBinding();
		var provider = collection.createProvider();
		var service = binding_ChainedDependency;
		var firstService = provider.handleGetService(service.__name__,service,null);
		var service = binding_ChainedDependency;
		var secondService = provider.handleGetService(service.__name__,service,binding_SecondChainDependency);
		utest_Assert.equals(firstService.getChain(),secondService,null,{ fileName : "src/binding/BindingTest.hx", lineNumber : 19, className : "binding.BindingTest", methodName : "testBinding"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testBinding", dependencies : [], execute : function() {
			_gthis.testBinding();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: binding_BindingTest
});
var hx_injection_Service = function() { };
$hxClasses["hx.injection.Service"] = hx_injection_Service;
hx_injection_Service.__name__ = "hx.injection.Service";
hx_injection_Service.__isInterface__ = true;
hx_injection_Service.prototype = {
	getConstructorArgs: null
	,__class__: hx_injection_Service
};
var binding_ChainedDependency = function() { };
$hxClasses["binding.ChainedDependency"] = binding_ChainedDependency;
binding_ChainedDependency.__name__ = "binding.ChainedDependency";
binding_ChainedDependency.__isInterface__ = true;
binding_ChainedDependency.__interfaces__ = [hx_injection_Service];
binding_ChainedDependency.prototype = {
	getChain: null
	,__class__: binding_ChainedDependency
};
var binding_FirstChainDependency = function(chain) {
	this._chain = chain;
};
$hxClasses["binding.FirstChainDependency"] = binding_FirstChainDependency;
binding_FirstChainDependency.__name__ = "binding.FirstChainDependency";
binding_FirstChainDependency.__interfaces__ = [binding_ChainedDependency];
binding_FirstChainDependency.prototype = {
	_chain: null
	,getChain: function() {
		return this._chain;
	}
	,getConstructorArgs: function() {
		return ["binding.ChainedDependency|binding.SecondChainDependency"];
	}
	,__class__: binding_FirstChainDependency
};
var binding_SecondChainDependency = function() {
};
$hxClasses["binding.SecondChainDependency"] = binding_SecondChainDependency;
binding_SecondChainDependency.__name__ = "binding.SecondChainDependency";
binding_SecondChainDependency.__interfaces__ = [binding_ChainedDependency];
binding_SecondChainDependency.prototype = {
	getChain: function() {
		return null;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: binding_SecondChainDependency
};
var config_Config = function() {
};
$hxClasses["config.Config"] = config_Config;
config_Config.__name__ = "config.Config";
config_Config.prototype = {
	word: null
	,__class__: config_Config
};
var config_ConfigTest = function() {
	utest_Test.call(this);
};
$hxClasses["config.ConfigTest"] = config_ConfigTest;
config_ConfigTest.__name__ = "config.ConfigTest";
config_ConfigTest.__super__ = utest_Test;
config_ConfigTest.prototype = $extend(utest_Test.prototype,{
	testConfiguredService: function() {
		var content = "{\r\n            \"test\": {\r\n                \"word\": \"Hello\"\r\n            }\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		var config = new config_Config();
		config.word = configuration.getString("test.word");
		var collection = new hx_injection_ServiceCollection();
		var implementation = config_ConfiguredService;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		collection.addConfig(config);
		var provider = collection.createProvider();
		var service = config_ConfiguredService;
		var service1 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(service1.getValue(),"Hello",null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 30, className : "config.ConfigTest", methodName : "testConfiguredService"});
	}
	,testConfigurationInner: function() {
		var content = "{\r\n            \"outer\": {\r\n                \"inner\": \"myValue\"\r\n            }\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getString("outer.inner"),"myValue",null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 42, className : "config.ConfigTest", methodName : "testConfigurationInner"});
	}
	,testConfigurationInt: function() {
		var content = "{\r\n            \"value\": 5\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getInt("value"),5,null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 54, className : "config.ConfigTest", methodName : "testConfigurationInt"});
	}
	,testConfigurationBool: function() {
		var content = "{\r\n            \"value\": true\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getBool("value"),true,null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 65, className : "config.ConfigTest", methodName : "testConfigurationBool"});
	}
	,testConfigurationFloat: function() {
		var content = "{\r\n            \"value\": 1.0\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getFloat("value"),1.0,null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 76, className : "config.ConfigTest", methodName : "testConfigurationFloat"});
	}
	,testConfigurationString: function() {
		var content = "{\r\n            \"value\": \"Hi there!\"\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getString("value"),"Hi there!",null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 87, className : "config.ConfigTest", methodName : "testConfigurationString"});
	}
	,testConfigurationIntArray: function() {
		var content = "{\r\n            \"value\": [5]\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getIntArray("value")[0],5,null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 99, className : "config.ConfigTest", methodName : "testConfigurationIntArray"});
	}
	,testConfigurationBoolArray: function() {
		var content = "{\r\n            \"value\": [true]\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getBoolArray("value")[0],true,null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 110, className : "config.ConfigTest", methodName : "testConfigurationBoolArray"});
	}
	,testConfigurationFloatArray: function() {
		var content = "{\r\n            \"value\": [1.0]\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getFloatArray("value")[0],1.0,null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 121, className : "config.ConfigTest", methodName : "testConfigurationFloatArray"});
	}
	,testConfigurationStringArray: function() {
		var content = "{\r\n            \"value\": [\"Hi there!\"]\r\n        }";
		var json = JSON.parse(content);
		var configuration = new hx_injection_config_Configuration(json);
		utest_Assert.equals(configuration.getStringArray("value")[0],"Hi there!",null,{ fileName : "src/config/ConfigTest.hx", lineNumber : 132, className : "config.ConfigTest", methodName : "testConfigurationStringArray"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testConfiguredService", dependencies : [], execute : function() {
			_gthis.testConfiguredService();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationStringArray", dependencies : [], execute : function() {
			_gthis.testConfigurationStringArray();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationString", dependencies : [], execute : function() {
			_gthis.testConfigurationString();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationIntArray", dependencies : [], execute : function() {
			_gthis.testConfigurationIntArray();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationInt", dependencies : [], execute : function() {
			_gthis.testConfigurationInt();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationInner", dependencies : [], execute : function() {
			_gthis.testConfigurationInner();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationFloatArray", dependencies : [], execute : function() {
			_gthis.testConfigurationFloatArray();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationFloat", dependencies : [], execute : function() {
			_gthis.testConfigurationFloat();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationBoolArray", dependencies : [], execute : function() {
			_gthis.testConfigurationBoolArray();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testConfigurationBool", dependencies : [], execute : function() {
			_gthis.testConfigurationBool();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: config_ConfigTest
});
var config_ConfiguredService = function(config) {
	this._config = config;
};
$hxClasses["config.ConfiguredService"] = config_ConfiguredService;
config_ConfiguredService.__name__ = "config.ConfiguredService";
config_ConfiguredService.__interfaces__ = [hx_injection_Service];
config_ConfiguredService.prototype = {
	_config: null
	,getValue: function() {
		return this._config.word;
	}
	,getConstructorArgs: function() {
		return ["config.Config"];
	}
	,__class__: config_ConfiguredService
};
var consistency_ADependency = function(dependency) {
	this._dependency = dependency;
};
$hxClasses["consistency.ADependency"] = consistency_ADependency;
consistency_ADependency.__name__ = "consistency.ADependency";
consistency_ADependency.__interfaces__ = [hx_injection_Service];
consistency_ADependency.prototype = {
	_dependency: null
	,id: function() {
		return this._dependency.id();
	}
	,getConstructorArgs: function() {
		return ["consistency.BDependency"];
	}
	,__class__: consistency_ADependency
};
var consistency_BDependency = function() {
};
$hxClasses["consistency.BDependency"] = consistency_BDependency;
consistency_BDependency.__name__ = "consistency.BDependency";
consistency_BDependency.__interfaces__ = [hx_injection_Service];
consistency_BDependency.prototype = {
	id: function() {
		return 3;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: consistency_BDependency
};
var consistency_ConsistencyTest = function() {
	utest_Test.call(this);
};
$hxClasses["consistency.ConsistencyTest"] = consistency_ConsistencyTest;
consistency_ConsistencyTest.__name__ = "consistency.ConsistencyTest";
consistency_ConsistencyTest.__super__ = utest_Test;
consistency_ConsistencyTest.prototype = $extend(utest_Test.prototype,{
	testSingletonIntoSingleton: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = consistency_ADependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var implementation = consistency_BDependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = consistency_ADependency;
		var dependency = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(3,dependency.id(),null,{ fileName : "src/consistency/ConsistencyTest.hx", lineNumber : 18, className : "consistency.ConsistencyTest", methodName : "testSingletonIntoSingleton"});
	}
	,testTransientIntoSingleton: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = consistency_ADependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var implementation = consistency_BDependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Transient,implementation.__name__,implementation);
		var provider = collection.createProvider();
		utest_Assert.raises(function() {
			var service = consistency_ADependency;
			provider.handleGetService(service.__name__,service,null);
		},haxe_Exception,null,null,{ fileName : "src/consistency/ConsistencyTest.hx", lineNumber : 28, className : "consistency.ConsistencyTest", methodName : "testTransientIntoSingleton"});
	}
	,testSingletonIntoTransient: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = consistency_ADependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Transient,implementation.__name__,implementation);
		var implementation = consistency_BDependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = consistency_ADependency;
		var dependency = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(3,dependency.id(),null,{ fileName : "src/consistency/ConsistencyTest.hx", lineNumber : 39, className : "consistency.ConsistencyTest", methodName : "testSingletonIntoTransient"});
	}
	,testScopedIntoSingleton: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = consistency_ADependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var implementation = consistency_BDependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Scoped,implementation.__name__,implementation);
		var provider = collection.createProvider();
		utest_Assert.raises(function() {
			var service = consistency_ADependency;
			provider.handleGetService(service.__name__,service,null);
		},haxe_Exception,null,null,{ fileName : "src/consistency/ConsistencyTest.hx", lineNumber : 49, className : "consistency.ConsistencyTest", methodName : "testScopedIntoSingleton"});
	}
	,testSingletonIntoScoped: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = consistency_ADependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Scoped,implementation.__name__,implementation);
		var implementation = consistency_BDependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = consistency_ADependency;
		var dependency = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(3,dependency.id(),null,{ fileName : "src/consistency/ConsistencyTest.hx", lineNumber : 60, className : "consistency.ConsistencyTest", methodName : "testSingletonIntoScoped"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testTransientIntoSingleton", dependencies : [], execute : function() {
			_gthis.testTransientIntoSingleton();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testSingletonIntoTransient", dependencies : [], execute : function() {
			_gthis.testSingletonIntoTransient();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testSingletonIntoSingleton", dependencies : [], execute : function() {
			_gthis.testSingletonIntoSingleton();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testSingletonIntoScoped", dependencies : [], execute : function() {
			_gthis.testSingletonIntoScoped();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testScopedIntoSingleton", dependencies : [], execute : function() {
			_gthis.testScopedIntoSingleton();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: consistency_ConsistencyTest
});
var hx_injection_Destructable = function() { };
$hxClasses["hx.injection.Destructable"] = hx_injection_Destructable;
hx_injection_Destructable.__name__ = "hx.injection.Destructable";
hx_injection_Destructable.__isInterface__ = true;
hx_injection_Destructable.prototype = {
	destroy: null
	,__class__: hx_injection_Destructable
};
var destructable_DestructableService = function() { };
$hxClasses["destructable.DestructableService"] = destructable_DestructableService;
destructable_DestructableService.__name__ = "destructable.DestructableService";
destructable_DestructableService.__isInterface__ = true;
destructable_DestructableService.__interfaces__ = [hx_injection_Service];
destructable_DestructableService.prototype = {
	getMeme: null
	,__class__: destructable_DestructableService
};
var destructable_ConcreteDestructableService = function() {
	this._meme = new destructable_Meme();
};
$hxClasses["destructable.ConcreteDestructableService"] = destructable_ConcreteDestructableService;
destructable_ConcreteDestructableService.__name__ = "destructable.ConcreteDestructableService";
destructable_ConcreteDestructableService.__interfaces__ = [hx_injection_Destructable,destructable_DestructableService];
destructable_ConcreteDestructableService.prototype = {
	_meme: null
	,getMeme: function() {
		return this._meme;
	}
	,destroy: function() {
		this._meme = null;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: destructable_ConcreteDestructableService
};
var destructable_DestructableTest = function() {
	utest_Test.call(this);
};
$hxClasses["destructable.DestructableTest"] = destructable_DestructableTest;
destructable_DestructableTest.__name__ = "destructable.DestructableTest";
destructable_DestructableTest.__super__ = utest_Test;
destructable_DestructableTest.prototype = $extend(utest_Test.prototype,{
	testSingletonCreated: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,destructable_DestructableService.__name__,destructable_ConcreteDestructableService);
		var provider = collection.createProvider();
		var service = destructable_DestructableService;
		var service1 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.notNull(service1.getMeme(),null,{ fileName : "src/destructable/DestructableTest.hx", lineNumber : 15, className : "destructable.DestructableTest", methodName : "testSingletonCreated"});
	}
	,testSingletonDestroyed: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,destructable_DestructableService.__name__,destructable_ConcreteDestructableService);
		var provider = collection.createProvider();
		var service = destructable_DestructableService;
		var service1 = provider.handleGetService(service.__name__,service,null);
		provider.destroy();
		utest_Assert.isNull(service1.getMeme(),null,{ fileName : "src/destructable/DestructableTest.hx", lineNumber : 24, className : "destructable.DestructableTest", methodName : "testSingletonDestroyed"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testSingletonDestroyed", dependencies : [], execute : function() {
			_gthis.testSingletonDestroyed();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testSingletonCreated", dependencies : [], execute : function() {
			_gthis.testSingletonCreated();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: destructable_DestructableTest
});
var destructable_Meme = function() {
};
$hxClasses["destructable.Meme"] = destructable_Meme;
destructable_Meme.__name__ = "destructable.Meme";
destructable_Meme.prototype = {
	__class__: destructable_Meme
};
var extensions_AbstractBase = function() { };
$hxClasses["extensions.AbstractBase"] = extensions_AbstractBase;
extensions_AbstractBase.__name__ = "extensions.AbstractBase";
extensions_AbstractBase.__interfaces__ = [hx_injection_Service];
extensions_AbstractBase.prototype = {
	getConstructorArgs: null
	,Start: null
	,__class__: extensions_AbstractBase
};
var extensions_SomeClass = function() {
};
$hxClasses["extensions.SomeClass"] = extensions_SomeClass;
extensions_SomeClass.__name__ = "extensions.SomeClass";
extensions_SomeClass.__super__ = extensions_AbstractBase;
extensions_SomeClass.prototype = $extend(extensions_AbstractBase.prototype,{
	Start: function() {
		return 123;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: extensions_SomeClass
});
var extensions_ExtensionsTest = function() {
	utest_Test.call(this);
};
$hxClasses["extensions.ExtensionsTest"] = extensions_ExtensionsTest;
extensions_ExtensionsTest.__name__ = "extensions.ExtensionsTest";
extensions_ExtensionsTest.__super__ = utest_Test;
extensions_ExtensionsTest.prototype = $extend(utest_Test.prototype,{
	testMain: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,extensions_AbstractBase.__name__,extensions_SomeClass);
		var service = extensions_AbstractBase;
		utest_Assert.equals(123,collection.createProvider().handleGetService(service.__name__,service,null).Start(),null,{ fileName : "src/extensions/ExtensionsTest.hx", lineNumber : 34, className : "extensions.ExtensionsTest", methodName : "testMain"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testMain", dependencies : [], execute : function() {
			_gthis.testMain();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: extensions_ExtensionsTest
});
var generic_GenericDependency = function() { };
$hxClasses["generic.GenericDependency"] = generic_GenericDependency;
generic_GenericDependency.__name__ = "generic.GenericDependency";
generic_GenericDependency.__isInterface__ = true;
generic_GenericDependency.__interfaces__ = [hx_injection_Service];
generic_GenericDependency.prototype = {
	getObject: null
	,__class__: generic_GenericDependency
};
var generic_GenericTest = function() {
	utest_Test.call(this);
};
$hxClasses["generic.GenericTest"] = generic_GenericTest;
generic_GenericTest.__name__ = "generic.GenericTest";
generic_GenericTest.__super__ = utest_Test;
generic_GenericTest.prototype = $extend(utest_Test.prototype,{
	testGenerics: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,hx_injection_generics_Generic.of(generic_GenericDependency,Int).signature,generic_TestDependency);
		var provider = collection.createProvider();
		var service = hx_injection_generics_Generic.of(generic_GenericDependency,Int);
		var service1 = provider.handleGetService(service.signature,service.basetype,null);
		utest_Assert.equals(service1.getObject(),5,null,{ fileName : "src/generic/GenericTest.hx", lineNumber : 20, className : "generic.GenericTest", methodName : "testGenerics"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testGenerics", dependencies : [], execute : function() {
			_gthis.testGenerics();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: generic_GenericTest
});
var generic_TestDependency = function() {
};
$hxClasses["generic.TestDependency"] = generic_TestDependency;
generic_TestDependency.__name__ = "generic.TestDependency";
generic_TestDependency.__interfaces__ = [generic_GenericDependency];
generic_TestDependency.prototype = {
	getObject: function() {
		return 5;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: generic_TestDependency
};
var haxe_StackItem = $hxEnums["haxe.StackItem"] = { __ename__:"haxe.StackItem",__constructs__:null
	,CFunction: {_hx_name:"CFunction",_hx_index:0,__enum__:"haxe.StackItem",toString:$estr}
	,Module: ($_=function(m) { return {_hx_index:1,m:m,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="Module",$_.__params__ = ["m"],$_)
	,FilePos: ($_=function(s,file,line,column) { return {_hx_index:2,s:s,file:file,line:line,column:column,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="FilePos",$_.__params__ = ["s","file","line","column"],$_)
	,Method: ($_=function(classname,method) { return {_hx_index:3,classname:classname,method:method,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="Method",$_.__params__ = ["classname","method"],$_)
	,LocalFunction: ($_=function(v) { return {_hx_index:4,v:v,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="LocalFunction",$_.__params__ = ["v"],$_)
};
haxe_StackItem.__constructs__ = [haxe_StackItem.CFunction,haxe_StackItem.Module,haxe_StackItem.FilePos,haxe_StackItem.Method,haxe_StackItem.LocalFunction];
var haxe_CallStack = {};
haxe_CallStack.callStack = function() {
	return haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.callStack());
};
haxe_CallStack.exceptionStack = function(fullStack) {
	if(fullStack == null) {
		fullStack = false;
	}
	var eStack = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.exceptionStack());
	return fullStack ? eStack : haxe_CallStack.subtract(eStack,haxe_CallStack.callStack());
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	var _g1 = stack;
	while(_g < _g1.length) {
		var s = _g1[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.subtract = function(this1,stack) {
	var startIndex = -1;
	var i = -1;
	while(++i < this1.length) {
		var _g = 0;
		var _g1 = stack.length;
		while(_g < _g1) {
			var j = _g++;
			if(haxe_CallStack.equalItems(this1[i],stack[j])) {
				if(startIndex < 0) {
					startIndex = i;
				}
				++i;
				if(i >= this1.length) {
					break;
				}
			} else {
				startIndex = -1;
			}
		}
		if(startIndex >= 0) {
			break;
		}
	}
	if(startIndex >= 0) {
		return this1.slice(0,startIndex);
	} else {
		return this1;
	}
};
haxe_CallStack.equalItems = function(item1,item2) {
	if(item1 == null) {
		if(item2 == null) {
			return true;
		} else {
			return false;
		}
	} else {
		switch(item1._hx_index) {
		case 0:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 0) {
				return true;
			} else {
				return false;
			}
			break;
		case 1:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 1) {
				var m2 = item2.m;
				var m1 = item1.m;
				return m1 == m2;
			} else {
				return false;
			}
			break;
		case 2:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 2) {
				var item21 = item2.s;
				var file2 = item2.file;
				var line2 = item2.line;
				var col2 = item2.column;
				var col1 = item1.column;
				var line1 = item1.line;
				var file1 = item1.file;
				var item11 = item1.s;
				if(file1 == file2 && line1 == line2 && col1 == col2) {
					return haxe_CallStack.equalItems(item11,item21);
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 3:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 3) {
				var class2 = item2.classname;
				var method2 = item2.method;
				var method1 = item1.method;
				var class1 = item1.classname;
				if(class1 == class2) {
					return method1 == method2;
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 4:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 4) {
				var v2 = item2.v;
				var v1 = item1.v;
				return v1 == v2;
			} else {
				return false;
			}
			break;
		}
	}
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s._hx_index) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s.m;
		b.b += "module ";
		b.b += m == null ? "null" : "" + m;
		break;
	case 2:
		var s1 = s.s;
		var file = s.file;
		var line = s.line;
		var col = s.column;
		if(s1 != null) {
			haxe_CallStack.itemToString(b,s1);
			b.b += " (";
		}
		b.b += file == null ? "null" : "" + file;
		b.b += " line ";
		b.b += line == null ? "null" : "" + line;
		if(col != null) {
			b.b += " column ";
			b.b += col == null ? "null" : "" + col;
		}
		if(s1 != null) {
			b.b += ")";
		}
		break;
	case 3:
		var cname = s.classname;
		var meth = s.method;
		b.b += Std.string(cname == null ? "<unknown>" : cname);
		b.b += ".";
		b.b += meth == null ? "null" : "" + meth;
		break;
	case 4:
		var n = s.v;
		b.b += "local function #";
		b.b += n == null ? "null" : "" + n;
		break;
	}
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = "haxe.IMap";
haxe_IMap.__isInterface__ = true;
haxe_IMap.prototype = {
	get: null
	,keys: null
	,__class__: haxe_IMap
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
	this.__skipStack = 0;
	var old = Error.prepareStackTrace;
	Error.prepareStackTrace = function(e) { return e.stack; }
	if(((native) instanceof Error)) {
		this.stack = native.stack;
	} else {
		var e = null;
		if(Error.captureStackTrace) {
			Error.captureStackTrace(this,haxe_Exception);
			e = this;
		} else {
			e = new Error();
			if(typeof(e.stack) == "undefined") {
				try { throw e; } catch(_) {}
				this.__skipStack++;
			}
		}
		this.stack = e.stack;
	}
	Error.prepareStackTrace = old;
};
$hxClasses["haxe.Exception"] = haxe_Exception;
haxe_Exception.__name__ = "haxe.Exception";
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		e.__skipStack++;
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	__skipStack: null
	,__nativeException: null
	,__previousException: null
	,unwrap: function() {
		return this.__nativeException;
	}
	,toString: function() {
		return this.get_message();
	}
	,__shiftStack: function() {
		this.__skipStack++;
	}
	,get_message: function() {
		return this.message;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,get_stack: function() {
		var _g = this.__exceptionStack;
		if(_g == null) {
			var value = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.normalize(this.stack),this.__skipStack);
			this.setProperty("__exceptionStack",value);
			return value;
		} else {
			var s = _g;
			return s;
		}
	}
	,setProperty: function(name,value) {
		try {
			Object.defineProperty(this,name,{ value : value});
		} catch( _g ) {
			this[name] = value;
		}
	}
	,__class__: haxe_Exception
	,__properties__: {get_native:"get_native",get_stack:"get_stack",get_message:"get_message"}
});
var haxe_Log = function() { };
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = "haxe.Log";
haxe_Log.formatOutput = function(v,infos) {
	var str = Std.string(v);
	if(infos == null) {
		return str;
	}
	var pstr = infos.fileName + ":" + infos.lineNumber;
	if(infos.customParams != null) {
		var _g = 0;
		var _g1 = infos.customParams;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			str += ", " + Std.string(v);
		}
	}
	return pstr + ": " + str;
};
haxe_Log.trace = function(v,infos) {
	var str = haxe_Log.formatOutput(v,infos);
	if(typeof(console) != "undefined" && console.log != null) {
		console.log(str);
	}
};
var haxe_NativeStackTrace = function() { };
$hxClasses["haxe.NativeStackTrace"] = haxe_NativeStackTrace;
haxe_NativeStackTrace.__name__ = "haxe.NativeStackTrace";
haxe_NativeStackTrace.saveStack = function(e) {
	haxe_NativeStackTrace.lastError = e;
};
haxe_NativeStackTrace.callStack = function() {
	var e = new Error("");
	var stack = haxe_NativeStackTrace.tryHaxeStack(e);
	if(typeof(stack) == "undefined") {
		try {
			throw e;
		} catch( _g ) {
		}
		stack = e.stack;
	}
	return haxe_NativeStackTrace.normalize(stack,2);
};
haxe_NativeStackTrace.exceptionStack = function() {
	return haxe_NativeStackTrace.normalize(haxe_NativeStackTrace.tryHaxeStack(haxe_NativeStackTrace.lastError));
};
haxe_NativeStackTrace.toHaxe = function(s,skip) {
	if(skip == null) {
		skip = 0;
	}
	if(s == null) {
		return [];
	} else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") {
			stack.shift();
		}
		var m = [];
		var _g = 0;
		var _g1 = stack.length;
		while(_g < _g1) {
			var i = _g++;
			if(skip > i) {
				continue;
			}
			var line = stack[i];
			var matched = line.match(/^    at ([A-Za-z0-9_. ]+) \(([^)]+):([0-9]+):([0-9]+)\)$/);
			if(matched != null) {
				var path = matched[1].split(".");
				if(path[0] == "$hxClasses") {
					path.shift();
				}
				var meth = path.pop();
				var file = matched[2];
				var line1 = Std.parseInt(matched[3]);
				var column = Std.parseInt(matched[4]);
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function" ? haxe_StackItem.LocalFunction() : meth == "Global code" ? null : haxe_StackItem.Method(path.join("."),meth),file,line1,column));
			} else {
				m.push(haxe_StackItem.Module(StringTools.trim(line)));
			}
		}
		return m;
	} else if(skip > 0 && Array.isArray(s)) {
		return s.slice(skip);
	} else {
		return s;
	}
};
haxe_NativeStackTrace.tryHaxeStack = function(e) {
	if(e == null) {
		return [];
	}
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = haxe_NativeStackTrace.prepareHxStackTrace;
	var stack = e.stack;
	Error.prepareStackTrace = oldValue;
	return stack;
};
haxe_NativeStackTrace.prepareHxStackTrace = function(e,callsites) {
	var stack = [];
	var _g = 0;
	while(_g < callsites.length) {
		var site = callsites[_g];
		++_g;
		if(haxe_NativeStackTrace.wrapCallSite != null) {
			site = haxe_NativeStackTrace.wrapCallSite(site);
		}
		var method = null;
		var fullName = site.getFunctionName();
		if(fullName != null) {
			var idx = fullName.lastIndexOf(".");
			if(idx >= 0) {
				var className = fullName.substring(0,idx);
				var methodName = fullName.substring(idx + 1);
				method = haxe_StackItem.Method(className,methodName);
			} else {
				method = haxe_StackItem.Method(null,fullName);
			}
		}
		var fileName = site.getFileName();
		var fileAddr = fileName == null ? -1 : fileName.indexOf("file:");
		if(haxe_NativeStackTrace.wrapCallSite != null && fileAddr > 0) {
			fileName = fileName.substring(fileAddr + 6);
		}
		stack.push(haxe_StackItem.FilePos(method,fileName,site.getLineNumber(),site.getColumnNumber()));
	}
	return stack;
};
haxe_NativeStackTrace.normalize = function(stack,skipItems) {
	if(skipItems == null) {
		skipItems = 0;
	}
	if(Array.isArray(stack) && skipItems > 0) {
		return stack.slice(skipItems);
	} else if(typeof(stack) == "string") {
		switch(stack.substring(0,6)) {
		case "Error\n":case "Error:":
			++skipItems;
			break;
		default:
		}
		return haxe_NativeStackTrace.skipLines(stack,skipItems);
	} else {
		return stack;
	}
};
haxe_NativeStackTrace.skipLines = function(stack,skip,pos) {
	if(pos == null) {
		pos = 0;
	}
	if(skip > 0) {
		pos = stack.indexOf("\n",pos);
		if(pos < 0) {
			return "";
		} else {
			return haxe_NativeStackTrace.skipLines(stack,--skip,pos + 1);
		}
	} else {
		return stack.substring(pos);
	}
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = "haxe.Timer";
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
	this.__skipStack++;
};
$hxClasses["haxe.ValueException"] = haxe_ValueException;
haxe_ValueException.__name__ = "haxe.ValueException";
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	value: null
	,unwrap: function() {
		return this.value;
	}
	,__class__: haxe_ValueException
});
var haxe_ds_List = function() {
	this.length = 0;
};
$hxClasses["haxe.ds.List"] = haxe_ds_List;
haxe_ds_List.__name__ = "haxe.ds.List";
haxe_ds_List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = new haxe_ds__$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l.item == v) {
				if(prev == null) {
					this.h = l.next;
				} else {
					prev.next = l.next;
				}
				if(this.q == l) {
					this.q = prev;
				}
				this.length--;
				return true;
			}
			prev = l;
			l = l.next;
		}
		return false;
	}
	,iterator: function() {
		return new haxe_ds__$List_ListIterator(this.h);
	}
	,__class__: haxe_ds_List
};
var haxe_ds__$List_ListNode = function(item,next) {
	this.item = item;
	this.next = next;
};
$hxClasses["haxe.ds._List.ListNode"] = haxe_ds__$List_ListNode;
haxe_ds__$List_ListNode.__name__ = "haxe.ds._List.ListNode";
haxe_ds__$List_ListNode.prototype = {
	item: null
	,next: null
	,__class__: haxe_ds__$List_ListNode
};
var haxe_ds__$List_ListIterator = function(head) {
	this.head = head;
};
$hxClasses["haxe.ds._List.ListIterator"] = haxe_ds__$List_ListIterator;
haxe_ds__$List_ListIterator.__name__ = "haxe.ds._List.ListIterator";
haxe_ds__$List_ListIterator.prototype = {
	head: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		var val = this.head.item;
		this.head = this.head.next;
		return val;
	}
	,__class__: haxe_ds__$List_ListIterator
};
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = "haxe.ds.StringMap";
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,get: function(key) {
		return this.h[key];
	}
	,keys: function() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this.h);
	}
	,__class__: haxe_ds_StringMap
};
var haxe_ds__$StringMap_StringMapKeyIterator = function(h) {
	this.h = h;
	this.keys = Object.keys(h);
	this.length = this.keys.length;
	this.current = 0;
};
$hxClasses["haxe.ds._StringMap.StringMapKeyIterator"] = haxe_ds__$StringMap_StringMapKeyIterator;
haxe_ds__$StringMap_StringMapKeyIterator.__name__ = "haxe.ds._StringMap.StringMapKeyIterator";
haxe_ds__$StringMap_StringMapKeyIterator.prototype = {
	h: null
	,keys: null
	,length: null
	,current: null
	,hasNext: function() {
		return this.current < this.length;
	}
	,next: function() {
		return this.keys[this.current++];
	}
	,__class__: haxe_ds__$StringMap_StringMapKeyIterator
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = "haxe.io.Bytes";
haxe_io_Bytes.prototype = {
	length: null
	,b: null
	,__class__: haxe_io_Bytes
};
var haxe_io_Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = "haxe.io.Eof";
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:"haxe.io.Error",__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
var haxe_io_Input = function() { };
$hxClasses["haxe.io.Input"] = haxe_io_Input;
haxe_io_Input.__name__ = "haxe.io.Input";
var haxe_io_Output = function() { };
$hxClasses["haxe.io.Output"] = haxe_io_Output;
haxe_io_Output.__name__ = "haxe.io.Output";
var haxe_io_Path = function(path) {
	switch(path) {
	case ".":case "..":
		this.dir = path;
		this.file = "";
		return;
	}
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		this.dir = HxOverrides.substr(path,0,c2);
		path = HxOverrides.substr(path,c2 + 1,null);
		this.backslash = true;
	} else if(c2 < c1) {
		this.dir = HxOverrides.substr(path,0,c1);
		path = HxOverrides.substr(path,c1 + 1,null);
	} else {
		this.dir = null;
	}
	var cp = path.lastIndexOf(".");
	if(cp != -1) {
		this.ext = HxOverrides.substr(path,cp + 1,null);
		this.file = HxOverrides.substr(path,0,cp);
	} else {
		this.ext = null;
		this.file = path;
	}
};
$hxClasses["haxe.io.Path"] = haxe_io_Path;
haxe_io_Path.__name__ = "haxe.io.Path";
haxe_io_Path.directory = function(path) {
	var s = new haxe_io_Path(path);
	if(s.dir == null) {
		return "";
	}
	return s.dir;
};
haxe_io_Path.join = function(paths) {
	var _g = [];
	var _g1 = 0;
	var _g2 = paths;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v != null && v != "") {
			_g.push(v);
		}
	}
	var paths = _g;
	if(paths.length == 0) {
		return "";
	}
	var path = paths[0];
	var _g = 1;
	var _g1 = paths.length;
	while(_g < _g1) {
		var i = _g++;
		path = haxe_io_Path.addTrailingSlash(path);
		path += paths[i];
	}
	return haxe_io_Path.normalize(path);
};
haxe_io_Path.normalize = function(path) {
	var slash = "/";
	path = path.split("\\").join(slash);
	if(path == slash) {
		return slash;
	}
	var target = [];
	var _g = 0;
	var _g1 = path.split(slash);
	while(_g < _g1.length) {
		var token = _g1[_g];
		++_g;
		if(token == ".." && target.length > 0 && target[target.length - 1] != "..") {
			target.pop();
		} else if(token == "") {
			if(target.length > 0 || HxOverrides.cca(path,0) == 47) {
				target.push(token);
			}
		} else if(token != ".") {
			target.push(token);
		}
	}
	var tmp = target.join(slash);
	var acc_b = "";
	var colon = false;
	var slashes = false;
	var _g2_offset = 0;
	var _g2_s = tmp;
	while(_g2_offset < _g2_s.length) {
		var s = _g2_s;
		var index = _g2_offset++;
		var c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		var c1 = c;
		if(c1 >= 65536) {
			++_g2_offset;
		}
		var c2 = c1;
		switch(c2) {
		case 47:
			if(!colon) {
				slashes = true;
			} else {
				var i = c2;
				colon = false;
				if(slashes) {
					acc_b += "/";
					slashes = false;
				}
				acc_b += String.fromCodePoint(i);
			}
			break;
		case 58:
			acc_b += ":";
			colon = true;
			break;
		default:
			var i1 = c2;
			colon = false;
			if(slashes) {
				acc_b += "/";
				slashes = false;
			}
			acc_b += String.fromCodePoint(i1);
		}
	}
	return acc_b;
};
haxe_io_Path.addTrailingSlash = function(path) {
	if(path.length == 0) {
		return "/";
	}
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		if(c2 != path.length - 1) {
			return path + "\\";
		} else {
			return path;
		}
	} else if(c1 != path.length - 1) {
		return path + "/";
	} else {
		return path;
	}
};
haxe_io_Path.prototype = {
	dir: null
	,file: null
	,ext: null
	,backslash: null
	,__class__: haxe_io_Path
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
$hxClasses["haxe.iterators.ArrayIterator"] = haxe_iterators_ArrayIterator;
haxe_iterators_ArrayIterator.__name__ = "haxe.iterators.ArrayIterator";
haxe_iterators_ArrayIterator.prototype = {
	array: null
	,current: null
	,hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var haxe_rtti_Meta = function() { };
$hxClasses["haxe.rtti.Meta"] = haxe_rtti_Meta;
haxe_rtti_Meta.__name__ = "haxe.rtti.Meta";
haxe_rtti_Meta.getMeta = function(t) {
	return t.__meta__;
};
haxe_rtti_Meta.getFields = function(t) {
	var meta = haxe_rtti_Meta.getMeta(t);
	if(meta == null || meta.fields == null) {
		return { };
	} else {
		return meta.fields;
	}
};
var hx_injection_InternalServiceType = $hxEnums["hx.injection.InternalServiceType"] = { __ename__:"hx.injection.InternalServiceType",__constructs__:null
	,Singleton: ($_=function(implementation) { return {_hx_index:0,implementation:implementation,__enum__:"hx.injection.InternalServiceType",toString:$estr}; },$_._hx_name="Singleton",$_.__params__ = ["implementation"],$_)
	,Transient: ($_=function(implementation) { return {_hx_index:1,implementation:implementation,__enum__:"hx.injection.InternalServiceType",toString:$estr}; },$_._hx_name="Transient",$_.__params__ = ["implementation"],$_)
	,Scoped: ($_=function(implementation) { return {_hx_index:2,implementation:implementation,__enum__:"hx.injection.InternalServiceType",toString:$estr}; },$_._hx_name="Scoped",$_.__params__ = ["implementation"],$_)
};
hx_injection_InternalServiceType.__constructs__ = [hx_injection_InternalServiceType.Singleton,hx_injection_InternalServiceType.Transient,hx_injection_InternalServiceType.Scoped];
var hx_injection_ServiceCollection = function() {
	this._configs = new haxe_ds_StringMap();
	this._requestedServices = new haxe_ds_StringMap();
	this._instancedServices = new haxe_ds_StringMap();
};
$hxClasses["hx.injection.ServiceCollection"] = hx_injection_ServiceCollection;
hx_injection_ServiceCollection.__name__ = "hx.injection.ServiceCollection";
hx_injection_ServiceCollection.prototype = {
	_configs: null
	,_requestedServices: null
	,_instancedServices: null
	,addConfig: function(config) {
		var _this = this._configs;
		var c = js_Boot.getClass(config);
		var key = c.__name__;
		_this.h[key] = config;
	}
	,handleServiceAdd: function(type,name,implementation) {
		var serviceName = name;
		var implementationName = implementation.__name__;
		var implementationType;
		switch(type._hx_index) {
		case 0:
			implementationType = hx_injection_InternalServiceType.Singleton(implementationName);
			break;
		case 1:
			implementationType = hx_injection_InternalServiceType.Transient(implementationName);
			break;
		case 2:
			implementationType = hx_injection_InternalServiceType.Scoped(implementationName);
			break;
		}
		var definition = this.initialiseDefinition(serviceName);
		definition.add(implementationType);
		return new hx_injection_ServiceConfig(definition,implementation.__name__,implementationType);
	}
	,handleInstanceAdd: function(service,instance) {
		var serviceName = service.__name__;
		this._instancedServices.h[serviceName] = instance;
	}
	,createProvider: function() {
		this.handleServiceAdd(hx_injection_ServiceType.Singleton,hx_injection_ServiceProvider.__name__,hx_injection_ServiceProvider);
		var provider = new hx_injection_ServiceProvider(this._configs,this._requestedServices,this._instancedServices);
		return provider;
	}
	,configExists: function(arg) {
		return this._configs.h[arg] != null;
	}
	,initialiseDefinition: function(type) {
		var definition = this._requestedServices.h[type];
		if(definition == null) {
			definition = new hx_injection_ServiceDefinition();
			this._requestedServices.h[type] = definition;
		}
		return definition;
	}
	,__class__: hx_injection_ServiceCollection
};
var hx_injection_ServiceConfig = function(definition,type,implementation) {
	this._definition = definition;
	this._type = type;
	this._implementation = implementation;
};
$hxClasses["hx.injection.ServiceConfig"] = hx_injection_ServiceConfig;
hx_injection_ServiceConfig.__name__ = "hx.injection.ServiceConfig";
hx_injection_ServiceConfig.prototype = {
	_definition: null
	,_type: null
	,_implementation: null
	,asBinding: function() {
		this._definition.setBinding(this._type);
	}
	,__class__: hx_injection_ServiceConfig
};
var hx_injection_ServiceGroup = function() { };
$hxClasses["hx.injection.ServiceGroup"] = hx_injection_ServiceGroup;
hx_injection_ServiceGroup.__name__ = "hx.injection.ServiceGroup";
hx_injection_ServiceGroup.__isInterface__ = true;
hx_injection_ServiceGroup.prototype = {
	getServices: null
	,getServiceAtKey: null
	,__class__: hx_injection_ServiceGroup
};
var hx_injection_ServiceDefinition = function() {
	this._bindings = new haxe_ds_StringMap();
	this._services = [];
};
$hxClasses["hx.injection.ServiceDefinition"] = hx_injection_ServiceDefinition;
hx_injection_ServiceDefinition.__name__ = "hx.injection.ServiceDefinition";
hx_injection_ServiceDefinition.__interfaces__ = [hx_injection_ServiceGroup];
hx_injection_ServiceDefinition.prototype = {
	_bindings: null
	,_services: null
	,add: function(type) {
		this._services.push(type);
	}
	,setBinding: function(key) {
		this._bindings.h[key] = this._services.length - 1;
	}
	,getServices: function() {
		return this._services;
	}
	,getServiceAtKey: function(key) {
		return this._services[this._bindings.h[key]];
	}
	,__class__: hx_injection_ServiceDefinition
};
var hx_injection_ServiceExtensions = function() { };
$hxClasses["hx.injection.ServiceExtensions"] = hx_injection_ServiceExtensions;
hx_injection_ServiceExtensions.__name__ = "hx.injection.ServiceExtensions";
var hx_injection_ServiceProvider = function(configs,services,instances) {
	this._requestedConfigs = configs;
	this._requestedServices = services;
	this._requestedInstances = instances;
	this._resolvedSingletonOrder = [];
	this._resolvedSingletons = new haxe_ds_StringMap();
	this._resolvedScopeOrder = [];
	this._resolvedScopes = new haxe_ds_StringMap();
	this.registerSelf();
};
$hxClasses["hx.injection.ServiceProvider"] = hx_injection_ServiceProvider;
hx_injection_ServiceProvider.__name__ = "hx.injection.ServiceProvider";
hx_injection_ServiceProvider.__interfaces__ = [hx_injection_Service,hx_injection_Destructable];
hx_injection_ServiceProvider.prototype = {
	_requestedConfigs: null
	,_requestedServices: null
	,_requestedInstances: null
	,_resolvedSingletonOrder: null
	,_resolvedSingletons: null
	,_resolvedScopeOrder: null
	,_resolvedScopes: null
	,registerSelf: function() {
		var name = hx_injection_ServiceProvider.__name__;
		this._resolvedSingletonOrder.push(name);
		this._resolvedSingletons.h[name] = this;
	}
	,handleGetService: function(name,service,binding) {
		var serviceName = name;
		var instance = this._requestedInstances.h[name];
		if(instance != null) {
			return instance;
		}
		var requestedGroup = this._requestedServices.h[serviceName];
		var requestedService = null;
		if(binding == null) {
			requestedService = requestedGroup.getServices()[0];
		} else {
			requestedService = requestedGroup.getServiceAtKey(binding.__name__);
		}
		if(requestedService == null) {
			throw new haxe_Exception("Service of type '" + serviceName + "' not found.");
		}
		var implementation = this.handleServiceRequest(serviceName,requestedService);
		return implementation;
	}
	,handleGetServices: function(name,service) {
		var serviceName = name;
		var requestedGroup = this._requestedServices.h[serviceName];
		var services = [];
		var requestedServices = requestedGroup.getServices();
		if(requestedServices == null) {
			throw new haxe_Exception("Service of type '" + serviceName + "' not found.");
		}
		var _g = 0;
		while(_g < requestedServices.length) {
			var service = requestedServices[_g];
			++_g;
			services.push(this.handleServiceRequest(serviceName,service));
		}
		return services;
	}
	,newScope: function() {
		this.destroyScopes();
		this._resolvedScopes = new haxe_ds_StringMap();
		return this;
	}
	,handleServiceRequest: function(name,serviceType) {
		switch(serviceType._hx_index) {
		case 0:
			var implementation = serviceType.implementation;
			return this.handleSingletonService(name,implementation);
		case 1:
			var implementation = serviceType.implementation;
			return this.handleTransientService(name,implementation);
		case 2:
			var implementation = serviceType.implementation;
			return this.handleScopedService(name,implementation);
		}
	}
	,handleSingletonService: function(name,implementation) {
		var instance = this.getSingleton(implementation);
		if(instance == null) {
			instance = this.buildDependencyTree(name,implementation);
			this._resolvedSingletonOrder.splice(0,0,implementation);
			this._resolvedSingletons.h[implementation] = instance;
		}
		return instance;
	}
	,handleTransientService: function(name,implementation) {
		return this.buildDependencyTree(name,implementation);
	}
	,handleScopedService: function(name,implementation) {
		var instance = this.getScoped(implementation);
		if(instance == null) {
			instance = this.buildDependencyTree(name,implementation);
			this._resolvedScopeOrder.splice(0,0,implementation);
			this._resolvedScopes.h[implementation] = instance;
		}
		return instance;
	}
	,buildDependencyTree: function(name,service) {
		var dependencies = [];
		var args = this.getServiceArgs(service);
		var _g = 0;
		while(_g < args.length) {
			var arg = args[_g];
			++_g;
			var reg = new EReg("Iterable\\((.+)\\)","");
			var matched = reg.match(arg);
			if(matched) {
				var type = reg.matched(1);
				var dependencyArray = this.getRequestedService(type);
				if(dependencyArray != null) {
					var iterator = [];
					var _g1 = 0;
					while(_g1 < dependencyArray.length) {
						var dependency = dependencyArray[_g1];
						++_g1;
						var serviceInstance = this.handleServiceRequest(name,dependency);
						this.checkLifetimeInjection(name,dependency);
						iterator.push(serviceInstance);
					}
					dependencies.push(iterator);
					continue;
				}
			} else {
				var binding = arg.split("|");
				var serviceType = null;
				if(binding.length == 2) {
					serviceType = this.getBoundService(binding[0],binding[1]);
				} else {
					serviceType = this.getRequestedService(arg) != null ? this.getRequestedService(arg)[0] : null;
				}
				if(serviceType != null) {
					var serviceInstance1 = this.handleServiceRequest(name,serviceType);
					this.checkLifetimeInjection(name,serviceType);
					dependencies.push(serviceInstance1);
					continue;
				}
			}
			var config = this.getRequestedConfig(arg);
			if(config != null) {
				dependencies.push(config);
				continue;
			}
			throw new haxe_Exception("Dependency " + arg + " for " + service + " is missing. Did you add it to the collection?");
		}
		var cl = $hxClasses[service];
		if(cl != null) {
			return Type.createInstance(cl,dependencies);
		} else {
			throw new haxe_Exception("Cannot resolve " + service + " into a class.");
		}
	}
	,checkLifetimeInjection: function(name,next) {
		var group = this._requestedServices.h[name];
		var _g = 0;
		var _g1 = group.getServices();
		while(_g < _g1.length) {
			var service = _g1[_g];
			++_g;
			if(service._hx_index == 0) {
				var implementation = service.implementation;
				switch(next._hx_index) {
				case 1:
					var implementation1 = next.implementation;
					throw new haxe_Exception("Attempting to inject " + Std.string(next) + " into Singleton(" + name + ")");
				case 2:
					var implementation2 = next.implementation;
					throw new haxe_Exception("Attempting to inject " + Std.string(next) + " into Singleton(" + name + ")");
				default:
				}
			}
		}
	}
	,getServiceArgs: function(service) {
		var type = $hxClasses[service];
		var instance = Object.create(type.prototype);
		return instance.getConstructorArgs();
	}
	,getSingleton: function(serviceName) {
		return this._resolvedSingletons.h[serviceName];
	}
	,getScoped: function(serviceName) {
		return this._resolvedScopes.h[serviceName];
	}
	,getRequestedConfig: function(config) {
		return this._requestedConfigs.h[config];
	}
	,getRequestedService: function(serviceName) {
		var requested = this._requestedServices.h[serviceName];
		if(requested != null) {
			return requested.getServices();
		}
		return null;
	}
	,getBoundService: function(serviceName,key) {
		var requested = this._requestedServices.h[serviceName];
		return requested.getServiceAtKey(key);
	}
	,destroy: function() {
		this.destroyScopes();
		this.destroySingletons();
		this._requestedConfigs = null;
		this._requestedServices = null;
		this._resolvedSingletons = null;
		this._resolvedScopes = null;
	}
	,destroySingletons: function() {
		var _g = 0;
		var _g1 = this._resolvedSingletonOrder;
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var singleton = this._resolvedSingletons.h[key];
			if(js_Boot.__implements(singleton,hx_injection_Destructable) && singleton != this) {
				(js_Boot.__cast(singleton , hx_injection_Destructable)).destroy();
			}
		}
	}
	,destroyScopes: function() {
		var _g = 0;
		var _g1 = this._resolvedScopeOrder;
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			var scope = this._resolvedSingletons.h[key];
			if(js_Boot.__implements(scope,hx_injection_Destructable)) {
				(js_Boot.__cast(scope , hx_injection_Destructable)).destroy();
			}
		}
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: hx_injection_ServiceProvider
};
var hx_injection_ServiceType = $hxEnums["hx.injection.ServiceType"] = { __ename__:"hx.injection.ServiceType",__constructs__:null
	,Singleton: {_hx_name:"Singleton",_hx_index:0,__enum__:"hx.injection.ServiceType",toString:$estr}
	,Transient: {_hx_name:"Transient",_hx_index:1,__enum__:"hx.injection.ServiceType",toString:$estr}
	,Scoped: {_hx_name:"Scoped",_hx_index:2,__enum__:"hx.injection.ServiceType",toString:$estr}
};
hx_injection_ServiceType.__constructs__ = [hx_injection_ServiceType.Singleton,hx_injection_ServiceType.Transient,hx_injection_ServiceType.Scoped];
var hx_injection_config_Configuration = function(group) {
	this._group = group;
};
$hxClasses["hx.injection.config.Configuration"] = hx_injection_config_Configuration;
hx_injection_config_Configuration.__name__ = "hx.injection.config.Configuration";
hx_injection_config_Configuration.prototype = {
	_group: null
	,getString: function(key) {
		var value = this.extractValue(key);
		if(typeof(value) == "string") {
			return js_Boot.__cast(value , String);
		}
		throw haxe_Exception.thrown(this.createException("String"));
	}
	,getFloat: function(key) {
		var value = this.extractValue(key);
		if(typeof(value) == "number") {
			return js_Boot.__cast(value , Float);
		}
		throw haxe_Exception.thrown(this.createException("Float"));
	}
	,getInt: function(key) {
		var value = this.extractValue(key);
		if(typeof(value) == "number" && ((value | 0) === value)) {
			return js_Boot.__cast(value , Int);
		}
		throw haxe_Exception.thrown(this.createException("Int"));
	}
	,getBool: function(key) {
		var value = this.extractValue(key);
		if(typeof(value) == "boolean") {
			return js_Boot.__cast(value , Bool);
		}
		throw haxe_Exception.thrown(this.createException("Bool"));
	}
	,getStringArray: function(key) {
		var value = this.extractValue(key);
		if(((value) instanceof Array)) {
			if(typeof(value[0]) == "string") {
				return value;
			}
		}
		throw haxe_Exception.thrown(this.createException("Array<String>"));
	}
	,getFloatArray: function(key) {
		var value = this.extractValue(key);
		if(((value) instanceof Array)) {
			if(typeof(value[0]) == "number") {
				return value;
			}
		}
		throw haxe_Exception.thrown(this.createException("Array<Float>"));
	}
	,getIntArray: function(key) {
		var value = this.extractValue(key);
		if(js_Boot.__instanceof(value[0],Int)) {
			if(js_Boot.__instanceof(value[0],Int)) {
				return value;
			}
		}
		throw haxe_Exception.thrown(this.createException("Array<Int>"));
	}
	,getBoolArray: function(key) {
		var value = this.extractValue(key);
		if(typeof(value[0]) == "boolean") {
			if(typeof(value[0]) == "boolean") {
				return value;
			}
		}
		throw haxe_Exception.thrown(this.createException("Array<Bool>"));
	}
	,extractValue: function(key) {
		var fields = key.split(".");
		var current = this._group;
		var _g = 0;
		while(_g < fields.length) {
			var field = fields[_g];
			++_g;
			current = Reflect.field(current,field.toLowerCase());
			if(current == null) {
				throw new haxe_Exception("No such value corresponding to '" + key + "'. Does it exist in the collection?");
			}
		}
		return current;
	}
	,createException: function(type) {
		return new haxe_Exception("Unable to resolve desired value as \"" + type + "\"");
	}
	,__class__: hx_injection_config_Configuration
};
var hx_injection_generics_Generic = function() { };
$hxClasses["hx.injection.generics.Generic"] = hx_injection_generics_Generic;
hx_injection_generics_Generic.__name__ = "hx.injection.generics.Generic";
hx_injection_generics_Generic.of = function(basetype) {
	var $l=arguments.length;
	var params = new Array($l>1?$l-1:0);
	for(var $i=1;$i<$l;++$i){params[$i-1]=arguments[$i];}
	var signature = basetype.__name__;
	var _g_current = 0;
	var _g_args = params;
	while(_g_current < _g_args.length) {
		var param = _g_args[_g_current++];
		signature += "_" + hx_injection_generics_Generic.handleClassName(param);
	}
	return { signature : signature, basetype : basetype};
};
hx_injection_generics_Generic.handleClassName = function(param) {
	return param.__name__.split(".").join("_");
};
var hx_injection_testing_Mock = function() { };
$hxClasses["hx.injection.testing.Mock"] = hx_injection_testing_Mock;
hx_injection_testing_Mock.__name__ = "hx.injection.testing.Mock";
var hxjsonast_Error = function(message,pos) {
	this.message = message;
	this.pos = pos;
};
$hxClasses["hxjsonast.Error"] = hxjsonast_Error;
hxjsonast_Error.__name__ = "hxjsonast.Error";
hxjsonast_Error.prototype = {
	message: null
	,pos: null
	,__class__: hxjsonast_Error
};
var hxjsonast_Json = function(value,pos) {
	this.value = value;
	this.pos = pos;
};
$hxClasses["hxjsonast.Json"] = hxjsonast_Json;
hxjsonast_Json.__name__ = "hxjsonast.Json";
hxjsonast_Json.prototype = {
	value: null
	,pos: null
	,__class__: hxjsonast_Json
};
var hxjsonast_JsonValue = $hxEnums["hxjsonast.JsonValue"] = { __ename__:"hxjsonast.JsonValue",__constructs__:null
	,JString: ($_=function(s) { return {_hx_index:0,s:s,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JString",$_.__params__ = ["s"],$_)
	,JNumber: ($_=function(s) { return {_hx_index:1,s:s,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JNumber",$_.__params__ = ["s"],$_)
	,JObject: ($_=function(fields) { return {_hx_index:2,fields:fields,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JObject",$_.__params__ = ["fields"],$_)
	,JArray: ($_=function(values) { return {_hx_index:3,values:values,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JArray",$_.__params__ = ["values"],$_)
	,JBool: ($_=function(b) { return {_hx_index:4,b:b,__enum__:"hxjsonast.JsonValue",toString:$estr}; },$_._hx_name="JBool",$_.__params__ = ["b"],$_)
	,JNull: {_hx_name:"JNull",_hx_index:5,__enum__:"hxjsonast.JsonValue",toString:$estr}
};
hxjsonast_JsonValue.__constructs__ = [hxjsonast_JsonValue.JString,hxjsonast_JsonValue.JNumber,hxjsonast_JsonValue.JObject,hxjsonast_JsonValue.JArray,hxjsonast_JsonValue.JBool,hxjsonast_JsonValue.JNull];
var hxjsonast_JObjectField = function(name,namePos,value) {
	this.name = name;
	this.namePos = namePos;
	this.value = value;
};
$hxClasses["hxjsonast.JObjectField"] = hxjsonast_JObjectField;
hxjsonast_JObjectField.__name__ = "hxjsonast.JObjectField";
hxjsonast_JObjectField.prototype = {
	name: null
	,namePos: null
	,value: null
	,__class__: hxjsonast_JObjectField
};
var hxjsonast_Parser = function(source,filename) {
	this.source = source;
	this.filename = filename;
	this.pos = 0;
};
$hxClasses["hxjsonast.Parser"] = hxjsonast_Parser;
hxjsonast_Parser.__name__ = "hxjsonast.Parser";
hxjsonast_Parser.parse = function(source,filename) {
	return new hxjsonast_Parser(source,filename).doParse();
};
hxjsonast_Parser.prototype = {
	source: null
	,filename: null
	,pos: null
	,doParse: function() {
		var result = this.parseRec();
		var c;
		while(true) {
			c = this.source.charCodeAt(this.pos++);
			var c1 = c;
			if(!(c1 == c1)) {
				break;
			}
			switch(c) {
			case 9:case 10:case 13:case 32:
				break;
			default:
				this.invalidChar();
			}
		}
		return result;
	}
	,parseRec: function() {
		while(true) {
			var c = this.source.charCodeAt(this.pos++);
			switch(c) {
			case 9:case 10:case 13:case 32:
				break;
			case 34:
				var save = this.pos;
				var s = this.parseString();
				return new hxjsonast_Json(hxjsonast_JsonValue.JString(s),new hxjsonast_Position(this.filename,save - 1,this.pos));
			case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				var start = this.pos - 1;
				var minus = c == 45;
				var digit = !minus;
				var zero = c == 48;
				var point = false;
				var e = false;
				var pm = false;
				var end = false;
				while(true) {
					switch(this.source.charCodeAt(this.pos++)) {
					case 43:case 45:
						if(!e || pm) {
							this.invalidNumber(start);
						}
						digit = false;
						pm = true;
						break;
					case 46:
						if(minus || point || e) {
							this.invalidNumber(start);
						}
						digit = false;
						point = true;
						break;
					case 48:
						if(zero && !point) {
							this.invalidNumber(start);
						}
						if(minus) {
							minus = false;
							zero = true;
						}
						digit = true;
						break;
					case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						if(zero && !point) {
							this.invalidNumber(start);
						}
						if(minus) {
							minus = false;
						}
						digit = true;
						zero = false;
						break;
					case 69:case 101:
						if(minus || zero || e) {
							this.invalidNumber(start);
						}
						digit = false;
						e = true;
						break;
					default:
						if(!digit) {
							this.invalidNumber(start);
						}
						this.pos--;
						end = true;
					}
					if(end) {
						break;
					}
				}
				var s1 = HxOverrides.substr(this.source,start,this.pos - start);
				return new hxjsonast_Json(hxjsonast_JsonValue.JNumber(s1),new hxjsonast_Position(this.filename,start,this.pos));
			case 91:
				var values = [];
				var comma = null;
				var startPos = this.pos - 1;
				while(true) switch(this.source.charCodeAt(this.pos++)) {
				case 9:case 10:case 13:case 32:
					break;
				case 44:
					if(comma) {
						comma = false;
					} else {
						this.invalidChar();
					}
					break;
				case 93:
					if(comma == false) {
						this.invalidChar();
					}
					return new hxjsonast_Json(hxjsonast_JsonValue.JArray(values),new hxjsonast_Position(this.filename,startPos,this.pos));
				default:
					if(comma) {
						this.invalidChar();
					}
					this.pos--;
					values.push(this.parseRec());
					comma = true;
				}
				break;
			case 102:
				var save1 = this.pos;
				if(this.source.charCodeAt(this.pos++) != 97 || this.source.charCodeAt(this.pos++) != 108 || this.source.charCodeAt(this.pos++) != 115 || this.source.charCodeAt(this.pos++) != 101) {
					this.pos = save1;
					this.invalidChar();
				}
				return new hxjsonast_Json(hxjsonast_JsonValue.JBool(false),new hxjsonast_Position(this.filename,save1 - 1,this.pos));
			case 110:
				var save2 = this.pos;
				if(this.source.charCodeAt(this.pos++) != 117 || this.source.charCodeAt(this.pos++) != 108 || this.source.charCodeAt(this.pos++) != 108) {
					this.pos = save2;
					this.invalidChar();
				}
				return new hxjsonast_Json(hxjsonast_JsonValue.JNull,new hxjsonast_Position(this.filename,save2 - 1,this.pos));
			case 116:
				var save3 = this.pos;
				if(this.source.charCodeAt(this.pos++) != 114 || this.source.charCodeAt(this.pos++) != 117 || this.source.charCodeAt(this.pos++) != 101) {
					this.pos = save3;
					this.invalidChar();
				}
				return new hxjsonast_Json(hxjsonast_JsonValue.JBool(true),new hxjsonast_Position(this.filename,save3 - 1,this.pos));
			case 123:
				var fields = [];
				var names_h = Object.create(null);
				var field = null;
				var fieldPos = null;
				var comma1 = null;
				var startPos1 = this.pos - 1;
				while(true) switch(this.source.charCodeAt(this.pos++)) {
				case 9:case 10:case 13:case 32:
					break;
				case 34:
					if(field != null || comma1) {
						this.invalidChar();
					}
					var fieldStartPos = this.pos - 1;
					field = this.parseString();
					fieldPos = new hxjsonast_Position(this.filename,fieldStartPos,this.pos);
					if(Object.prototype.hasOwnProperty.call(names_h,field)) {
						throw haxe_Exception.thrown(new hxjsonast_Error("Duplicate field name \"" + field + "\"",fieldPos));
					} else {
						names_h[field] = true;
					}
					break;
				case 44:
					if(comma1) {
						comma1 = false;
					} else {
						this.invalidChar();
					}
					break;
				case 58:
					if(field == null) {
						this.invalidChar();
					}
					fields.push(new hxjsonast_JObjectField(field,fieldPos,this.parseRec()));
					field = null;
					fieldPos = null;
					comma1 = true;
					break;
				case 125:
					if(field != null || comma1 == false) {
						this.invalidChar();
					}
					return new hxjsonast_Json(hxjsonast_JsonValue.JObject(fields),new hxjsonast_Position(this.filename,startPos1,this.pos));
				default:
					this.invalidChar();
				}
				break;
			default:
				this.invalidChar();
			}
		}
	}
	,parseString: function() {
		var start = this.pos;
		var buf = null;
		while(true) {
			var c = this.source.charCodeAt(this.pos++);
			if(c == 34) {
				break;
			}
			if(c == 92) {
				if(buf == null) {
					buf = new StringBuf();
				}
				var s = this.source;
				var len = this.pos - start - 1;
				buf.b += len == null ? HxOverrides.substr(s,start,null) : HxOverrides.substr(s,start,len);
				c = this.source.charCodeAt(this.pos++);
				switch(c) {
				case 34:case 47:case 92:
					buf.b += String.fromCodePoint(c);
					break;
				case 98:
					buf.b += String.fromCodePoint(8);
					break;
				case 102:
					buf.b += String.fromCodePoint(12);
					break;
				case 110:
					buf.b += String.fromCodePoint(10);
					break;
				case 114:
					buf.b += String.fromCodePoint(13);
					break;
				case 116:
					buf.b += String.fromCodePoint(9);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.source,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCodePoint(uc);
					break;
				default:
					throw haxe_Exception.thrown(new hxjsonast_Error("Invalid escape sequence \\" + String.fromCodePoint(c),new hxjsonast_Position(this.filename,this.pos - 2,this.pos)));
				}
				start = this.pos;
			} else if(c != c) {
				this.pos--;
				throw haxe_Exception.thrown(new hxjsonast_Error("Unclosed string",new hxjsonast_Position(this.filename,start - 1,this.pos)));
			}
		}
		if(buf == null) {
			return HxOverrides.substr(this.source,start,this.pos - start - 1);
		} else {
			var s = this.source;
			var len = this.pos - start - 1;
			buf.b += len == null ? HxOverrides.substr(s,start,null) : HxOverrides.substr(s,start,len);
			return buf.b;
		}
	}
	,parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45;
		var digit = !minus;
		var zero = c == 48;
		var point = false;
		var e = false;
		var pm = false;
		var end = false;
		while(true) {
			switch(this.source.charCodeAt(this.pos++)) {
			case 43:case 45:
				if(!e || pm) {
					this.invalidNumber(start);
				}
				digit = false;
				pm = true;
				break;
			case 46:
				if(minus || point || e) {
					this.invalidNumber(start);
				}
				digit = false;
				point = true;
				break;
			case 48:
				if(zero && !point) {
					this.invalidNumber(start);
				}
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) {
					this.invalidNumber(start);
				}
				if(minus) {
					minus = false;
				}
				digit = true;
				zero = false;
				break;
			case 69:case 101:
				if(minus || zero || e) {
					this.invalidNumber(start);
				}
				digit = false;
				e = true;
				break;
			default:
				if(!digit) {
					this.invalidNumber(start);
				}
				this.pos--;
				end = true;
			}
			if(end) {
				break;
			}
		}
		var s = HxOverrides.substr(this.source,start,this.pos - start);
		return new hxjsonast_Json(hxjsonast_JsonValue.JNumber(s),new hxjsonast_Position(this.filename,start,this.pos));
	}
	,nextChar: function() {
		return this.source.charCodeAt(this.pos++);
	}
	,mk: function(pos,value) {
		return new hxjsonast_Json(value,pos);
	}
	,mkPos: function(min,max) {
		return new hxjsonast_Position(this.filename,min,max);
	}
	,invalidChar: function() {
		this.pos--;
		throw haxe_Exception.thrown(new hxjsonast_Error("Invalid character: " + this.source.charAt(this.pos),new hxjsonast_Position(this.filename,this.pos,this.pos + 1)));
	}
	,invalidNumber: function(start) {
		throw haxe_Exception.thrown(new hxjsonast_Error("Invalid number: " + this.source.substring(start,this.pos),new hxjsonast_Position(this.filename,start,this.pos)));
	}
	,__class__: hxjsonast_Parser
};
var hxjsonast_Position = function(file,min,max) {
	this.file = file;
	this.min = min;
	this.max = max;
};
$hxClasses["hxjsonast.Position"] = hxjsonast_Position;
hxjsonast_Position.__name__ = "hxjsonast.Position";
hxjsonast_Position.prototype = {
	file: null
	,min: null
	,max: null
	,__class__: hxjsonast_Position
};
var injection_BaseWordService = function() {
};
$hxClasses["injection.BaseWordService"] = injection_BaseWordService;
injection_BaseWordService.__name__ = "injection.BaseWordService";
injection_BaseWordService.__interfaces__ = [hx_injection_Service];
injection_BaseWordService.prototype = {
	say: null
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: injection_BaseWordService
};
var injection_InjectionTest = function() {
	utest_Test.call(this);
};
$hxClasses["injection.InjectionTest"] = injection_InjectionTest;
injection_InjectionTest.__name__ = "injection.InjectionTest";
injection_InjectionTest.__super__ = utest_Test;
injection_InjectionTest.prototype = $extend(utest_Test.prototype,{
	testProvider: function() {
		var collection = new hx_injection_ServiceCollection();
		var provider = collection.createProvider();
		var service = hx_injection_ServiceProvider;
		var providerAgain = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(provider,providerAgain,null,{ fileName : "src/injection/InjectionTest.hx", lineNumber : 16, className : "injection.InjectionTest", methodName : "testProvider"});
	}
	,testSelfInjection: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = injection_SelfInjected;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = injection_SelfInjected;
		var injected = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(injected.get(),provider,null,{ fileName : "src/injection/InjectionTest.hx", lineNumber : 26, className : "injection.InjectionTest", methodName : "testSelfInjection"});
	}
	,testLoudInjection: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,injection_BaseWordService.__name__,injection_WordService);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,injection_TestService.__name__,injection_LoudTestService);
		var provider = collection.createProvider();
		var service = injection_BaseWordService;
		var service1 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(service1.say("Test"),"TEST",null,{ fileName : "src/injection/InjectionTest.hx", lineNumber : 37, className : "injection.InjectionTest", methodName : "testLoudInjection"});
	}
	,testQuietInjection: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,injection_BaseWordService.__name__,injection_WordService);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,injection_TestService.__name__,injection_QuietTestService);
		var provider = collection.createProvider();
		var service = injection_BaseWordService;
		var service1 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(service1.say("Test"),"test",null,{ fileName : "src/injection/InjectionTest.hx", lineNumber : 48, className : "injection.InjectionTest", methodName : "testQuietInjection"});
	}
	,testInstanceInjection: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleInstanceAdd(injection_BaseWordService,new injection_InstanceService("Hello"));
		var provider = collection.createProvider();
		var service = injection_BaseWordService;
		var injected = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(injected.say("World!"),"HelloWorld!",null,{ fileName : "src/injection/InjectionTest.hx", lineNumber : 58, className : "injection.InjectionTest", methodName : "testInstanceInjection"});
	}
	,testInstanceSelfBinding: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleInstanceAdd(injection_InstanceService,new injection_InstanceService("Hello"));
		var provider = collection.createProvider();
		var service = injection_InstanceService;
		var injected = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(injected.say("World!"),"HelloWorld!",null,{ fileName : "src/injection/InjectionTest.hx", lineNumber : 68, className : "injection.InjectionTest", methodName : "testInstanceSelfBinding"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testSelfInjection", dependencies : [], execute : function() {
			_gthis.testSelfInjection();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testQuietInjection", dependencies : [], execute : function() {
			_gthis.testQuietInjection();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testProvider", dependencies : [], execute : function() {
			_gthis.testProvider();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testLoudInjection", dependencies : [], execute : function() {
			_gthis.testLoudInjection();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testInstanceSelfBinding", dependencies : [], execute : function() {
			_gthis.testInstanceSelfBinding();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testInstanceInjection", dependencies : [], execute : function() {
			_gthis.testInstanceInjection();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: injection_InjectionTest
});
var injection_InstanceService = function(word) {
	injection_BaseWordService.call(this);
	this._word = word;
};
$hxClasses["injection.InstanceService"] = injection_InstanceService;
injection_InstanceService.__name__ = "injection.InstanceService";
injection_InstanceService.__super__ = injection_BaseWordService;
injection_InstanceService.prototype = $extend(injection_BaseWordService.prototype,{
	_word: null
	,say: function(word) {
		return "" + this._word + word;
	}
	,getConstructorArgs: function() {
		return ["String"];
	}
	,__class__: injection_InstanceService
});
var injection_TestService = function() { };
$hxClasses["injection.TestService"] = injection_TestService;
injection_TestService.__name__ = "injection.TestService";
injection_TestService.__isInterface__ = true;
injection_TestService.__interfaces__ = [hx_injection_Service];
injection_TestService.prototype = {
	transform: null
	,__class__: injection_TestService
};
var injection_LoudTestService = function() {
};
$hxClasses["injection.LoudTestService"] = injection_LoudTestService;
injection_LoudTestService.__name__ = "injection.LoudTestService";
injection_LoudTestService.__interfaces__ = [injection_TestService];
injection_LoudTestService.prototype = {
	transform: function(word) {
		return word.toUpperCase();
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: injection_LoudTestService
};
var injection_QuietTestService = function() {
};
$hxClasses["injection.QuietTestService"] = injection_QuietTestService;
injection_QuietTestService.__name__ = "injection.QuietTestService";
injection_QuietTestService.__interfaces__ = [injection_TestService];
injection_QuietTestService.prototype = {
	transform: function(word) {
		return word.toLowerCase();
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: injection_QuietTestService
};
var injection_SelfInjected = function(provider) {
	this._provider = provider;
};
$hxClasses["injection.SelfInjected"] = injection_SelfInjected;
injection_SelfInjected.__name__ = "injection.SelfInjected";
injection_SelfInjected.__interfaces__ = [hx_injection_Service];
injection_SelfInjected.prototype = {
	_provider: null
	,get: function() {
		return this._provider;
	}
	,getConstructorArgs: function() {
		return ["hx.injection.ServiceProvider"];
	}
	,__class__: injection_SelfInjected
};
var injection_WordService = function(test) {
	injection_BaseWordService.call(this);
	this._test = test;
};
$hxClasses["injection.WordService"] = injection_WordService;
injection_WordService.__name__ = "injection.WordService";
injection_WordService.__interfaces__ = [hx_injection_Service];
injection_WordService.__super__ = injection_BaseWordService;
injection_WordService.prototype = $extend(injection_BaseWordService.prototype,{
	_test: null
	,say: function(msg) {
		return this._test.transform(msg);
	}
	,getConstructorArgs: function() {
		return ["injection.TestService"];
	}
	,__class__: injection_WordService
});
var iterators_Dependency = function() { };
$hxClasses["iterators.Dependency"] = iterators_Dependency;
iterators_Dependency.__name__ = "iterators.Dependency";
iterators_Dependency.__isInterface__ = true;
iterators_Dependency.__interfaces__ = [hx_injection_Service];
iterators_Dependency.prototype = {
	getNumber: null
	,__class__: iterators_Dependency
};
var iterators_FirstDependency = function() {
};
$hxClasses["iterators.FirstDependency"] = iterators_FirstDependency;
iterators_FirstDependency.__name__ = "iterators.FirstDependency";
iterators_FirstDependency.__interfaces__ = [iterators_Dependency];
iterators_FirstDependency.prototype = {
	getNumber: function() {
		return 1;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: iterators_FirstDependency
};
var iterators_GenericDependency = function() {
};
$hxClasses["iterators.GenericDependency"] = iterators_GenericDependency;
iterators_GenericDependency.__name__ = "iterators.GenericDependency";
iterators_GenericDependency.__interfaces__ = [hx_injection_Service];
iterators_GenericDependency.prototype = {
	doThing: function(t) {
		return t;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: iterators_GenericDependency
};
var iterators_IteratorTest = function() {
	utest_Test.call(this);
};
$hxClasses["iterators.IteratorTest"] = iterators_IteratorTest;
iterators_IteratorTest.__name__ = "iterators.IteratorTest";
iterators_IteratorTest.__super__ = utest_Test;
iterators_IteratorTest.prototype = $extend(utest_Test.prototype,{
	testIterators: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,iterators_Dependency.__name__,iterators_FirstDependency);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,iterators_Dependency.__name__,iterators_SecondDependency);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,iterators_Dependency.__name__,iterators_ThirdDependency);
		var implementation = iterators_SumDependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = iterators_SumDependency;
		var service1 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(service1.result(),6,null,{ fileName : "src/iterators/IteratorTest.hx", lineNumber : 21, className : "iterators.IteratorTest", methodName : "testIterators"});
	}
	,testFirst: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,iterators_Dependency.__name__,iterators_FirstDependency);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,iterators_Dependency.__name__,iterators_SecondDependency);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,iterators_Dependency.__name__,iterators_ThirdDependency);
		var implementation = iterators_SingleDependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = iterators_SingleDependency;
		var service1 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(service1.result(),1,null,{ fileName : "src/iterators/IteratorTest.hx", lineNumber : 34, className : "iterators.IteratorTest", methodName : "testFirst"});
	}
	,testGeneric: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = hx_injection_generics_Generic.of(iterators_GenericDependency,Int);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.signature,implementation.basetype);
		var implementation = hx_injection_generics_Generic.of(iterators_GenericDependency,Int);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.signature,implementation.basetype);
		var implementation = hx_injection_generics_Generic.of(iterators_GenericDependency,Int);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.signature,implementation.basetype);
		var implementation = iterators_TestDependency;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = iterators_TestDependency;
		var service1 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(service1.doThing(),3,null,{ fileName : "src/iterators/IteratorTest.hx", lineNumber : 48, className : "iterators.IteratorTest", methodName : "testGeneric"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testIterators", dependencies : [], execute : function() {
			_gthis.testIterators();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testGeneric", dependencies : [], execute : function() {
			_gthis.testGeneric();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testFirst", dependencies : [], execute : function() {
			_gthis.testFirst();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: iterators_IteratorTest
});
var iterators_SecondDependency = function() {
};
$hxClasses["iterators.SecondDependency"] = iterators_SecondDependency;
iterators_SecondDependency.__name__ = "iterators.SecondDependency";
iterators_SecondDependency.__interfaces__ = [iterators_Dependency];
iterators_SecondDependency.prototype = {
	getNumber: function() {
		return 2;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: iterators_SecondDependency
};
var iterators_SingleDependency = function(dependencies) {
	this._dependencies = dependencies;
};
$hxClasses["iterators.SingleDependency"] = iterators_SingleDependency;
iterators_SingleDependency.__name__ = "iterators.SingleDependency";
iterators_SingleDependency.__interfaces__ = [hx_injection_Service];
iterators_SingleDependency.prototype = {
	_dependencies: null
	,result: function() {
		return this._dependencies.getNumber();
	}
	,getConstructorArgs: function() {
		return ["iterators.Dependency"];
	}
	,__class__: iterators_SingleDependency
};
var iterators_SumDependency = function(dependencies) {
	this._dependencies = dependencies;
};
$hxClasses["iterators.SumDependency"] = iterators_SumDependency;
iterators_SumDependency.__name__ = "iterators.SumDependency";
iterators_SumDependency.__interfaces__ = [hx_injection_Service];
iterators_SumDependency.prototype = {
	_dependencies: null
	,result: function() {
		var out = 0;
		var dependency = $getIterator(this._dependencies);
		while(dependency.hasNext()) {
			var dependency1 = dependency.next();
			out += dependency1.getNumber();
		}
		return out;
	}
	,getConstructorArgs: function() {
		return ["Iterable(iterators.Dependency)"];
	}
	,__class__: iterators_SumDependency
};
var iterators_TestDependency = function(dependency) {
	this._dependencies = dependency;
};
$hxClasses["iterators.TestDependency"] = iterators_TestDependency;
iterators_TestDependency.__name__ = "iterators.TestDependency";
iterators_TestDependency.__interfaces__ = [hx_injection_Service];
iterators_TestDependency.prototype = {
	_dependencies: null
	,doThing: function() {
		var out = 0;
		var dependency = $getIterator(this._dependencies);
		while(dependency.hasNext()) {
			var dependency1 = dependency.next();
			out += dependency1.doThing(1);
		}
		return out;
	}
	,getConstructorArgs: function() {
		return ["Iterable(iterators.GenericDependency_Int)"];
	}
	,__class__: iterators_TestDependency
};
var iterators_ThirdDependency = function() {
};
$hxClasses["iterators.ThirdDependency"] = iterators_ThirdDependency;
iterators_ThirdDependency.__name__ = "iterators.ThirdDependency";
iterators_ThirdDependency.__interfaces__ = [iterators_Dependency];
iterators_ThirdDependency.prototype = {
	getNumber: function() {
		return 3;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: iterators_ThirdDependency
};
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = "js.Boot";
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__implements = function(o,iface) {
	return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
};
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_node_Fs = require("fs");
var js_node_KeyValue = {};
js_node_KeyValue.__properties__ = {get_value:"get_value",get_key:"get_key"};
js_node_KeyValue.get_key = function(this1) {
	return this1[0];
};
js_node_KeyValue.get_value = function(this1) {
	return this1[1];
};
var js_node_Path = require("path");
var js_node_buffer_Buffer = require("buffer").Buffer;
var js_node_stream_WritableNewOptionsAdapter = {};
js_node_stream_WritableNewOptionsAdapter.from = function(options) {
	if(!Object.prototype.hasOwnProperty.call(options,"final")) {
		Object.defineProperty(options,"final",{ get : function() {
			return options.final_;
		}});
	}
	return options;
};
var json2object_Error = $hxEnums["json2object.Error"] = { __ename__:"json2object.Error",__constructs__:null
	,IncorrectType: ($_=function(variable,expected,pos) { return {_hx_index:0,variable:variable,expected:expected,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="IncorrectType",$_.__params__ = ["variable","expected","pos"],$_)
	,IncorrectEnumValue: ($_=function(value,expected,pos) { return {_hx_index:1,value:value,expected:expected,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="IncorrectEnumValue",$_.__params__ = ["value","expected","pos"],$_)
	,InvalidEnumConstructor: ($_=function(value,expected,pos) { return {_hx_index:2,value:value,expected:expected,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="InvalidEnumConstructor",$_.__params__ = ["value","expected","pos"],$_)
	,UninitializedVariable: ($_=function(variable,pos) { return {_hx_index:3,variable:variable,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="UninitializedVariable",$_.__params__ = ["variable","pos"],$_)
	,UnknownVariable: ($_=function(variable,pos) { return {_hx_index:4,variable:variable,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="UnknownVariable",$_.__params__ = ["variable","pos"],$_)
	,ParserError: ($_=function(message,pos) { return {_hx_index:5,message:message,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="ParserError",$_.__params__ = ["message","pos"],$_)
	,CustomFunctionException: ($_=function(e,pos) { return {_hx_index:6,e:e,pos:pos,__enum__:"json2object.Error",toString:$estr}; },$_._hx_name="CustomFunctionException",$_.__params__ = ["e","pos"],$_)
};
json2object_Error.__constructs__ = [json2object_Error.IncorrectType,json2object_Error.IncorrectEnumValue,json2object_Error.InvalidEnumConstructor,json2object_Error.UninitializedVariable,json2object_Error.UnknownVariable,json2object_Error.ParserError,json2object_Error.CustomFunctionException];
var json2object_InternalError = $hxEnums["json2object.InternalError"] = { __ename__:"json2object.InternalError",__constructs__:null
	,AbstractNoJsonRepresentation: ($_=function(name) { return {_hx_index:0,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="AbstractNoJsonRepresentation",$_.__params__ = ["name"],$_)
	,CannotGenerateSchema: ($_=function(name) { return {_hx_index:1,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="CannotGenerateSchema",$_.__params__ = ["name"],$_)
	,HandleExpr: {_hx_name:"HandleExpr",_hx_index:2,__enum__:"json2object.InternalError",toString:$estr}
	,ParsingThrow: {_hx_name:"ParsingThrow",_hx_index:3,__enum__:"json2object.InternalError",toString:$estr}
	,UnsupportedAbstractEnumType: ($_=function(name) { return {_hx_index:4,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedAbstractEnumType",$_.__params__ = ["name"],$_)
	,UnsupportedEnumAbstractValue: ($_=function(name) { return {_hx_index:5,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedEnumAbstractValue",$_.__params__ = ["name"],$_)
	,UnsupportedMapKeyType: ($_=function(name) { return {_hx_index:6,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedMapKeyType",$_.__params__ = ["name"],$_)
	,UnsupportedSchemaObjectType: ($_=function(name) { return {_hx_index:7,name:name,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedSchemaObjectType",$_.__params__ = ["name"],$_)
	,UnsupportedSchemaType: ($_=function(type) { return {_hx_index:8,type:type,__enum__:"json2object.InternalError",toString:$estr}; },$_._hx_name="UnsupportedSchemaType",$_.__params__ = ["type"],$_)
};
json2object_InternalError.__constructs__ = [json2object_InternalError.AbstractNoJsonRepresentation,json2object_InternalError.CannotGenerateSchema,json2object_InternalError.HandleExpr,json2object_InternalError.ParsingThrow,json2object_InternalError.UnsupportedAbstractEnumType,json2object_InternalError.UnsupportedEnumAbstractValue,json2object_InternalError.UnsupportedMapKeyType,json2object_InternalError.UnsupportedSchemaObjectType,json2object_InternalError.UnsupportedSchemaType];
var json2object_CustomFunctionError = function(message) {
	this.message = message;
};
$hxClasses["json2object.CustomFunctionError"] = json2object_CustomFunctionError;
json2object_CustomFunctionError.__name__ = "json2object.CustomFunctionError";
json2object_CustomFunctionError.prototype = {
	message: null
	,__class__: json2object_CustomFunctionError
};
var json2object_JsonParser = function() { };
$hxClasses["json2object.JsonParser"] = json2object_JsonParser;
json2object_JsonParser.__name__ = "json2object.JsonParser";
var json2object_PositionUtils = function(content) {
	this.linesInfo = [];
	var s = 0;
	var e = 0;
	var i = 0;
	var lineCount = 0;
	while(i < content.length) switch(content.charAt(i)) {
	case "\n":
		e = i;
		this.linesInfo.push({ number : lineCount, start : s, end : e});
		++lineCount;
		++i;
		s = i;
		break;
	case "\r":
		e = i;
		if(content.charAt(i + 1) == "\n") {
			++e;
		}
		this.linesInfo.push({ number : lineCount, start : s, end : e});
		++lineCount;
		i = e + 1;
		s = i;
		break;
	default:
		++i;
	}
	this.linesInfo.push({ number : lineCount, start : s, end : i});
};
$hxClasses["json2object.PositionUtils"] = json2object_PositionUtils;
json2object_PositionUtils.__name__ = "json2object.PositionUtils";
json2object_PositionUtils.prototype = {
	linesInfo: null
	,convertPosition: function(position) {
		var file = position.file;
		var min = position.min;
		var max = position.max;
		var pos = { file : file, min : min + 1, max : max + 1, lines : []};
		var lastLine = this.linesInfo.length - 1;
		var bounds_min = 0;
		var bounds_max = lastLine;
		if(min > this.linesInfo[0].end) {
			while(bounds_max > bounds_min) {
				var i = (bounds_min + bounds_max) / 2 | 0;
				var line = this.linesInfo[i];
				if(line.start == min) {
					bounds_min = i;
					bounds_max = i;
				}
				if(line.end < min) {
					bounds_min = i + 1;
				}
				if(line.start > min || line.end >= min && line.start < min) {
					bounds_max = i;
				}
			}
		}
		var _g = bounds_min;
		var _g1 = this.linesInfo.length;
		while(_g < _g1) {
			var i = _g++;
			var line = this.linesInfo[i];
			if(line.start <= min && line.end >= max) {
				pos.lines.push({ number : line.number + 1, start : min - line.start + 1, end : max - line.start + 1});
				break;
			}
			if(line.start <= min && min <= line.end) {
				pos.lines.push({ number : line.number + 1, start : min - line.start + 1, end : line.end + 1});
			}
			if(line.start <= max && max <= line.end) {
				pos.lines.push({ number : line.number + 1, start : line.start + 1, end : max - line.start + 1});
			}
			if(line.start >= max || line.end >= max) {
				break;
			}
		}
		return pos;
	}
	,revert: function(position) {
		return new hxjsonast_Position(position.file,position.min - 1,position.max - 1);
	}
	,__class__: json2object_PositionUtils
};
var lifetime_IDPrinter = function() {
	this._id = Math.round(Math.random() * 12345678);
};
$hxClasses["lifetime.IDPrinter"] = lifetime_IDPrinter;
lifetime_IDPrinter.__name__ = "lifetime.IDPrinter";
lifetime_IDPrinter.__interfaces__ = [hx_injection_Service];
lifetime_IDPrinter.prototype = {
	_id: null
	,id: function() {
		return this._id;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: lifetime_IDPrinter
};
var lifetime_LifetimeTest = function() {
	utest_Test.call(this);
};
$hxClasses["lifetime.LifetimeTest"] = lifetime_LifetimeTest;
lifetime_LifetimeTest.__name__ = "lifetime.LifetimeTest";
lifetime_LifetimeTest.__super__ = utest_Test;
lifetime_LifetimeTest.prototype = $extend(utest_Test.prototype,{
	testSingletonEqual: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = lifetime_IDPrinter;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = lifetime_IDPrinter;
		var id1 = provider.handleGetService(service.__name__,service,null);
		provider.newScope();
		var service = lifetime_IDPrinter;
		var id2 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(id1.id(),id2.id(),null,{ fileName : "src/lifetime/LifetimeTest.hx", lineNumber : 18, className : "lifetime.LifetimeTest", methodName : "testSingletonEqual"});
	}
	,testTransientNotEqual: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = lifetime_IDPrinter;
		collection.handleServiceAdd(hx_injection_ServiceType.Transient,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = lifetime_IDPrinter;
		var id1 = provider.handleGetService(service.__name__,service,null);
		var service = lifetime_IDPrinter;
		var id2 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.notEquals(id1.id(),id2.id(),null,{ fileName : "src/lifetime/LifetimeTest.hx", lineNumber : 28, className : "lifetime.LifetimeTest", methodName : "testTransientNotEqual"});
	}
	,testScopedEqual: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = lifetime_IDPrinter;
		collection.handleServiceAdd(hx_injection_ServiceType.Scoped,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = lifetime_IDPrinter;
		var id1 = provider.handleGetService(service.__name__,service,null);
		var service = lifetime_IDPrinter;
		var id2 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(id1.id(),id2.id(),null,{ fileName : "src/lifetime/LifetimeTest.hx", lineNumber : 38, className : "lifetime.LifetimeTest", methodName : "testScopedEqual"});
	}
	,testScopedNotEqual: function() {
		var collection = new hx_injection_ServiceCollection();
		var implementation = lifetime_IDPrinter;
		collection.handleServiceAdd(hx_injection_ServiceType.Scoped,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = lifetime_IDPrinter;
		var id1 = provider.handleGetService(service.__name__,service,null);
		provider.newScope();
		var service = lifetime_IDPrinter;
		var id2 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.notEquals(id1.id(),id2.id(),null,{ fileName : "src/lifetime/LifetimeTest.hx", lineNumber : 50, className : "lifetime.LifetimeTest", methodName : "testScopedNotEqual"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testTransientNotEqual", dependencies : [], execute : function() {
			_gthis.testTransientNotEqual();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testSingletonEqual", dependencies : [], execute : function() {
			_gthis.testSingletonEqual();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testScopedNotEqual", dependencies : [], execute : function() {
			_gthis.testScopedNotEqual();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testScopedEqual", dependencies : [], execute : function() {
			_gthis.testScopedEqual();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: lifetime_LifetimeTest
});
var mocking_MockTest = function() {
	utest_Test.call(this);
};
$hxClasses["mocking.MockTest"] = mocking_MockTest;
mocking_MockTest.__name__ = "mocking.MockTest";
mocking_MockTest.__super__ = utest_Test;
mocking_MockTest.prototype = $extend(utest_Test.prototype,{
	testMock: function() {
		var collection = new hx_injection_ServiceCollection();
		var mock = mocks_MockedNumberService;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,mocking_NumberService.__name__,mock);
		var provider = collection.createProvider();
		var service = mocking_NumberService;
		var service1 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(7,service1.id(2),null,{ fileName : "src/mocking/MockTest.hx", lineNumber : 22, className : "mocking.MockTest", methodName : "testMock"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testMock", dependencies : [], execute : function() {
			_gthis.testMock();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: mocking_MockTest
});
var mocking_NumberService = function() { };
$hxClasses["mocking.NumberService"] = mocking_NumberService;
mocking_NumberService.__name__ = "mocking.NumberService";
mocking_NumberService.__isInterface__ = true;
mocking_NumberService.__interfaces__ = [hx_injection_Service];
mocking_NumberService.prototype = {
	id: null
	,other: null
	,__class__: mocking_NumberService
};
var mocks_MockedNumberService = function() {
};
$hxClasses["mocks.MockedNumberService"] = mocks_MockedNumberService;
mocks_MockedNumberService.__name__ = "mocks.MockedNumberService";
mocks_MockedNumberService.__interfaces__ = [mocking_NumberService];
mocks_MockedNumberService.prototype = {
	id: function(arg) {
		return 5 + arg;
	}
	,other: function() {
		return 0.0;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: mocks_MockedNumberService
};
var protected_Dependency = function() { };
$hxClasses["protected.Dependency"] = protected_Dependency;
protected_Dependency.__name__ = "protected.Dependency";
protected_Dependency.__isInterface__ = true;
protected_Dependency.__interfaces__ = [hx_injection_Service];
protected_Dependency.prototype = {
	id: null
	,__class__: protected_Dependency
};
var protected_MyDependency = function() {
};
$hxClasses["protected.MyDependency"] = protected_MyDependency;
protected_MyDependency.__name__ = "protected.MyDependency";
protected_MyDependency.__interfaces__ = [protected_Dependency];
protected_MyDependency.prototype = {
	id: function() {
		return 5;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: protected_MyDependency
};
var protected_OtherDependency = function() {
};
$hxClasses["protected.OtherDependency"] = protected_OtherDependency;
protected_OtherDependency.__name__ = "protected.OtherDependency";
protected_OtherDependency.__interfaces__ = [protected_Dependency];
protected_OtherDependency.prototype = {
	id: function() {
		return 3;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: protected_OtherDependency
};
var protected_ProtectedTest = function() {
	utest_Test.call(this);
};
$hxClasses["protected.ProtectedTest"] = protected_ProtectedTest;
protected_ProtectedTest.__name__ = "protected.ProtectedTest";
protected_ProtectedTest.__super__ = utest_Test;
protected_ProtectedTest.prototype = $extend(utest_Test.prototype,{
	testSingleton: function() {
		var collection = new hx_injection_ServiceCollection();
		var service = protected_Dependency;
		var _this = collection._requestedServices;
		var key = service.__name__;
		if(!Object.prototype.hasOwnProperty.call(_this.h,key)) {
			collection.handleServiceAdd(hx_injection_ServiceType.Singleton,service.__name__,protected_MyDependency);
		}
		var service = protected_Dependency;
		var _this = collection._requestedServices;
		var key = service.__name__;
		if(!Object.prototype.hasOwnProperty.call(_this.h,key)) {
			collection.handleServiceAdd(hx_injection_ServiceType.Singleton,service.__name__,protected_OtherDependency);
		}
		var provider = collection.createProvider();
		var service = protected_Dependency;
		var dependencies = provider.handleGetServices(service.__name__,service);
		var array = Lambda.array(dependencies);
		utest_Assert.equals(1,array.length,null,{ fileName : "src/protected/ProtectedTest.hx", lineNumber : 19, className : "protected.ProtectedTest", methodName : "testSingleton"});
	}
	,testTransient: function() {
		var collection = new hx_injection_ServiceCollection();
		var service = protected_Dependency;
		var _this = collection._requestedServices;
		var key = service.__name__;
		if(!Object.prototype.hasOwnProperty.call(_this.h,key)) {
			collection.handleServiceAdd(hx_injection_ServiceType.Transient,service.__name__,protected_MyDependency);
		}
		var service = protected_Dependency;
		var _this = collection._requestedServices;
		var key = service.__name__;
		if(!Object.prototype.hasOwnProperty.call(_this.h,key)) {
			collection.handleServiceAdd(hx_injection_ServiceType.Transient,service.__name__,protected_OtherDependency);
		}
		var provider = collection.createProvider();
		var service = protected_Dependency;
		var dependencies = provider.handleGetServices(service.__name__,service);
		var array = Lambda.array(dependencies);
		utest_Assert.equals(1,array.length,null,{ fileName : "src/protected/ProtectedTest.hx", lineNumber : 31, className : "protected.ProtectedTest", methodName : "testTransient"});
	}
	,testScoped: function() {
		var collection = new hx_injection_ServiceCollection();
		var service = protected_Dependency;
		var _this = collection._requestedServices;
		var key = service.__name__;
		if(!Object.prototype.hasOwnProperty.call(_this.h,key)) {
			collection.handleServiceAdd(hx_injection_ServiceType.Scoped,service.__name__,protected_MyDependency);
		}
		var service = protected_Dependency;
		var _this = collection._requestedServices;
		var key = service.__name__;
		if(!Object.prototype.hasOwnProperty.call(_this.h,key)) {
			collection.handleServiceAdd(hx_injection_ServiceType.Scoped,service.__name__,protected_OtherDependency);
		}
		var provider = collection.createProvider();
		var service = protected_Dependency;
		var dependencies = provider.handleGetServices(service.__name__,service);
		var array = Lambda.array(dependencies);
		utest_Assert.equals(1,array.length,null,{ fileName : "src/protected/ProtectedTest.hx", lineNumber : 43, className : "protected.ProtectedTest", methodName : "testScoped"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testTransient", dependencies : [], execute : function() {
			_gthis.testTransient();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testSingleton", dependencies : [], execute : function() {
			_gthis.testSingleton();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testScoped", dependencies : [], execute : function() {
			_gthis.testScoped();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: protected_ProtectedTest
});
var segregation_TextService = function() { };
$hxClasses["segregation.TextService"] = segregation_TextService;
segregation_TextService.__name__ = "segregation.TextService";
segregation_TextService.__isInterface__ = true;
segregation_TextService.__interfaces__ = [hx_injection_Service];
segregation_TextService.prototype = {
	getText: null
	,id: null
	,__class__: segregation_TextService
};
var segregation_NumberService = function() { };
$hxClasses["segregation.NumberService"] = segregation_NumberService;
segregation_NumberService.__name__ = "segregation.NumberService";
segregation_NumberService.__isInterface__ = true;
segregation_NumberService.__interfaces__ = [hx_injection_Service];
segregation_NumberService.prototype = {
	getNumber: null
	,id: null
	,__class__: segregation_NumberService
};
var segregation_ExampleService = function() {
	this._id = Math.floor(Math.random() * 65745);
};
$hxClasses["segregation.ExampleService"] = segregation_ExampleService;
segregation_ExampleService.__name__ = "segregation.ExampleService";
segregation_ExampleService.__interfaces__ = [segregation_TextService,segregation_NumberService];
segregation_ExampleService.prototype = {
	_id: null
	,getNumber: function() {
		return 0;
	}
	,getText: function() {
		return "Hello world!";
	}
	,id: function() {
		return this._id;
	}
	,getConstructorArgs: function() {
		return [];
	}
	,__class__: segregation_ExampleService
};
var segregation_SegregationTest = function() {
	utest_Test.call(this);
};
$hxClasses["segregation.SegregationTest"] = segregation_SegregationTest;
segregation_SegregationTest.__name__ = "segregation.SegregationTest";
segregation_SegregationTest.__super__ = utest_Test;
segregation_SegregationTest.prototype = $extend(utest_Test.prototype,{
	testSegregation: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,segregation_NumberService.__name__,segregation_ExampleService);
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,segregation_TextService.__name__,segregation_ExampleService);
		var provider = collection.createProvider();
		var service = segregation_NumberService;
		var service1 = provider.handleGetService(service.__name__,service,null);
		var service = segregation_TextService;
		var service2 = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(service1,service2,null,{ fileName : "src/segregation/SegregationTest.hx", lineNumber : 19, className : "segregation.SegregationTest", methodName : "testSegregation"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testSegregation", dependencies : [], execute : function() {
			_gthis.testSegregation();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: segregation_SegregationTest
});
var sys_FileSystem = function() { };
$hxClasses["sys.FileSystem"] = sys_FileSystem;
sys_FileSystem.__name__ = "sys.FileSystem";
sys_FileSystem.exists = function(path) {
	try {
		js_node_Fs.accessSync(path);
		return true;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return false;
	}
};
sys_FileSystem.createDirectory = function(path) {
	try {
		js_node_Fs.mkdirSync(path);
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		if(e.code == "ENOENT") {
			sys_FileSystem.createDirectory(js_node_Path.dirname(path));
			js_node_Fs.mkdirSync(path);
		} else {
			var stat;
			try {
				stat = js_node_Fs.statSync(path);
			} catch( _g1 ) {
				throw e;
			}
			if(!stat.isDirectory()) {
				throw e;
			}
		}
	}
};
var sys_io_FileInput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
$hxClasses["sys.io.FileInput"] = sys_io_FileInput;
sys_io_FileInput.__name__ = "sys.io.FileInput";
sys_io_FileInput.__super__ = haxe_io_Input;
sys_io_FileInput.prototype = $extend(haxe_io_Input.prototype,{
	fd: null
	,pos: null
	,readByte: function() {
		var buf = js_node_buffer_Buffer.alloc(1);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,0,1,this.pos);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos++;
		return buf[0];
	}
	,readBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,pos,len,this.pos);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos += bytesRead;
		return bytesRead;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,eof: function() {
		return this.pos >= js_node_Fs.fstatSync(this.fd).size;
	}
	,__class__: sys_io_FileInput
});
var sys_io_FileOutput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
$hxClasses["sys.io.FileOutput"] = sys_io_FileOutput;
sys_io_FileOutput.__name__ = "sys.io.FileOutput";
sys_io_FileOutput.__super__ = haxe_io_Output;
sys_io_FileOutput.prototype = $extend(haxe_io_Output.prototype,{
	fd: null
	,pos: null
	,writeByte: function(b) {
		var buf = js_node_buffer_Buffer.alloc(1);
		buf[0] = b;
		js_node_Fs.writeSync(this.fd,buf,0,1,this.pos);
		this.pos++;
	}
	,writeBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var wrote = js_node_Fs.writeSync(this.fd,buf,pos,len,this.pos);
		this.pos += wrote;
		return wrote;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,__class__: sys_io_FileOutput
});
var sys_io_FileSeek = $hxEnums["sys.io.FileSeek"] = { __ename__:"sys.io.FileSeek",__constructs__:null
	,SeekBegin: {_hx_name:"SeekBegin",_hx_index:0,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekCur: {_hx_name:"SeekCur",_hx_index:1,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekEnd: {_hx_name:"SeekEnd",_hx_index:2,__enum__:"sys.io.FileSeek",toString:$estr}
};
sys_io_FileSeek.__constructs__ = [sys_io_FileSeek.SeekBegin,sys_io_FileSeek.SeekCur,sys_io_FileSeek.SeekEnd];
var utest_Assert = function() { };
$hxClasses["utest.Assert"] = utest_Assert;
utest_Assert.__name__ = "utest.Assert";
utest_Assert.processResult = function(cond,getMessage,pos) {
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(getMessage(),pos));
	}
	return cond;
};
utest_Assert.isTrue = function(cond,msg,pos) {
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "expected true",pos));
	}
	return cond;
};
utest_Assert.isFalse = function(value,msg,pos) {
	var cond = value == false;
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "expected false",pos));
	}
	return cond;
};
utest_Assert.isNull = function(value,msg,pos) {
	var cond = value == null;
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "expected null but it is " + utest_Assert.q(value),pos));
	}
	return cond;
};
utest_Assert.notNull = function(value,msg,pos) {
	var cond = value != null;
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "expected not null",pos));
	}
	return cond;
};
utest_Assert.is = function(value,type,msg,pos) {
	return utest_Assert.isOfType(value,type,msg,pos);
};
utest_Assert.isOfType = function(value,type,msg,pos) {
	var cond = js_Boot.__instanceof(value,type);
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "expected type " + utest_Assert.typeToString(type) + " but it is " + utest_Assert.typeToString(value),pos));
	}
	return cond;
};
utest_Assert.notEquals = function(expected,value,msg,pos) {
	var cond = expected != value;
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "expected " + utest_Assert.q(expected) + " and test value " + utest_Assert.q(value) + " should be different",pos));
	}
	return cond;
};
utest_Assert.equals = function(expected,value,msg,pos) {
	var cond = expected == value;
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value),pos));
	}
	return cond;
};
utest_Assert.match = function(pattern,value,msg,pos) {
	var cond = pattern.match(value);
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "the value " + utest_Assert.q(value) + " does not match the provided pattern",pos));
	}
	return cond;
};
utest_Assert.floatEquals = function(expected,value,approx,msg,pos) {
	var cond = utest_Assert._floatEquals(expected,value,approx);
	if(utest_Assert.results == null) {
		throw haxe_Exception.thrown("Assert at " + pos.fileName + ":" + pos.lineNumber + " out of context. Most likely you are trying to assert after a test timeout.");
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg != null ? msg : "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value),pos));
	}
	return cond;
};
utest_Assert._floatEquals = function(expected,value,approx) {
	if(isNaN(expected)) {
		return isNaN(value);
	} else if(isNaN(value)) {
		return false;
	} else if(!isFinite(expected) && !isFinite(value)) {
		return expected > 0 == value > 0;
	}
	if(null == approx) {
		approx = 1e-5;
	}
	return Math.abs(value - expected) <= approx;
};
utest_Assert.getTypeName = function(v) {
	var _g = Type.typeof(v);
	switch(_g._hx_index) {
	case 0:
		return "`null`";
	case 1:
		return "Int";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 4:
		return "Object";
	case 5:
		return "function";
	case 6:
		var c = _g.c;
		return c.__name__;
	case 7:
		var e = _g.e;
		return e.__ename__;
	case 8:
		return "`Unknown`";
	}
};
utest_Assert.isIterable = function(v,isAnonym) {
	var fields = isAnonym ? Reflect.fields(v) : Type.getInstanceFields(js_Boot.getClass(v));
	if(!Lambda.has(fields,"iterator")) {
		return false;
	}
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
utest_Assert.isIterator = function(v,isAnonym) {
	var fields = isAnonym ? Reflect.fields(v) : Type.getInstanceFields(js_Boot.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) {
		return false;
	}
	if(Reflect.isFunction(Reflect.field(v,"next"))) {
		return Reflect.isFunction(Reflect.field(v,"hasNext"));
	} else {
		return false;
	}
};
utest_Assert.sameAs = function(expected,value,status,approx) {
	var texpected = utest_Assert.getTypeName(expected);
	var tvalue = utest_Assert.getTypeName(value);
	status.expectedValue = expected;
	status.actualValue = value;
	if(texpected != tvalue && !(texpected == "Int" && tvalue == "Float" || texpected == "Float" && tvalue == "Int")) {
		status.error = "expected type " + texpected + " but it is " + tvalue + (status.path == "" ? "" : " for field " + status.path);
		return false;
	}
	var _g = Type.typeof(expected);
	switch(_g._hx_index) {
	case 1:case 2:
		if(!utest_Assert._floatEquals(expected,value,approx)) {
			status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		return true;
	case 0:case 3:
		if(expected != value) {
			status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		return true;
	case 4:
		if(status.recursive || status.path == "") {
			var tfields = Reflect.fields(value);
			var fields = Reflect.fields(expected);
			var path = status.path;
			var _g1 = 0;
			while(_g1 < fields.length) {
				var field = fields[_g1];
				++_g1;
				HxOverrides.remove(tfields,field);
				status.path = path == "" ? field : path + "." + field;
				if(!Object.prototype.hasOwnProperty.call(value,field)) {
					status.error = "expected field " + status.path + " does not exist in " + utest_Assert.q(value);
					return false;
				}
				var e = Reflect.field(expected,field);
				if(Reflect.isFunction(e)) {
					continue;
				}
				var v = Reflect.field(value,field);
				if(!utest_Assert.sameAs(e,v,status,approx)) {
					return false;
				}
			}
			if(tfields.length > 0) {
				status.error = "the tested object has extra field(s) (" + tfields.join(", ") + ") not included in the expected ones";
				return false;
			}
		}
		if(utest_Assert.isIterator(expected,true)) {
			if(!utest_Assert.isIterator(value,true)) {
				status.error = "expected Iterable but it is not " + (status.path == "" ? "" : " for field " + status.path);
				return false;
			}
			if(status.recursive || status.path == "") {
				var evalues = Lambda.array({ iterator : function() {
					return expected;
				}});
				var vvalues = Lambda.array({ iterator : function() {
					return value;
				}});
				if(evalues.length != vvalues.length) {
					status.error = "expected " + evalues.length + " values in Iterator but they are " + vvalues.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path = status.path;
				var _g1 = 0;
				var _g2 = evalues.length;
				while(_g1 < _g2) {
					var i = _g1++;
					status.path = path == "" ? "iterator[" + i + "]" : path + "[" + i + "]";
					if(!utest_Assert.sameAs(evalues[i],vvalues[i],status,approx)) {
						status.error = "expected " + utest_Assert.q(status.expectedValue) + " but it is " + utest_Assert.q(status.actualValue) + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(utest_Assert.isIterable(expected,true)) {
			if(!utest_Assert.isIterable(value,true)) {
				status.error = "expected Iterator but it is not " + (status.path == "" ? "" : " for field " + status.path);
				return false;
			}
			if(status.recursive || status.path == "") {
				var evalues = Lambda.array(expected);
				var vvalues = Lambda.array(value);
				if(evalues.length != vvalues.length) {
					status.error = "expected " + evalues.length + " values in Iterable but they are " + vvalues.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path = status.path;
				var _g1 = 0;
				var _g2 = evalues.length;
				while(_g1 < _g2) {
					var i = _g1++;
					status.path = path == "" ? "iterable[" + i + "]" : path + "[" + i + "]";
					if(!utest_Assert.sameAs(evalues[i],vvalues[i],status,approx)) {
						return false;
					}
				}
			}
			return true;
		}
		return true;
	case 5:
		if(!Reflect.compareMethods(expected,value)) {
			status.error = "expected same function reference" + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		return true;
	case 6:
		var c = _g.c;
		var cexpected = c.__name__;
		var c = js_Boot.getClass(value);
		var cvalue = c.__name__;
		if(cexpected != cvalue) {
			status.error = "expected instance of " + utest_Assert.q(cexpected) + " but it is " + utest_Assert.q(cvalue) + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		if(typeof(expected) == "string") {
			if(expected == value) {
				return true;
			} else {
				status.error = "expected string '" + Std.string(expected) + "' but it is '" + Std.string(value) + "'";
				return false;
			}
		}
		if(((expected) instanceof Array)) {
			if(status.recursive || status.path == "") {
				if(expected.length != value.length) {
					status.error = "expected " + Std.string(expected.length) + " elements but they are " + Std.string(value.length) + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path = status.path;
				var _g1 = 0;
				var _g2 = expected.length;
				while(_g1 < _g2) {
					var i = _g1++;
					status.path = path == "" ? "array[" + i + "]" : path + "[" + i + "]";
					if(!utest_Assert.sameAs(expected[i],value[i],status,approx)) {
						status.error = "expected array element at [" + i + "] to have " + utest_Assert.q(status.expectedValue) + " but it is " + utest_Assert.q(status.actualValue) + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(((expected) instanceof Date)) {
			if(expected.getTime() != value.getTime()) {
				status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
				return false;
			}
			return true;
		}
		if(((expected) instanceof haxe_io_Bytes)) {
			if(status.recursive || status.path == "") {
				var ebytes = expected;
				var vbytes = value;
				if(ebytes.length != vbytes.length) {
					status.error = "expected " + ebytes.length + " bytes length but it is " + vbytes.length;
					return false;
				}
				var _g1 = 0;
				var _g2 = ebytes.length;
				while(_g1 < _g2) {
					var i = _g1++;
					if(ebytes.b[i] != vbytes.b[i]) {
						status.error = "expected byte #" + i + " to be " + ebytes.b[i] + " but it is " + vbytes.b[i] + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(js_Boot.__implements(expected,haxe_IMap)) {
			if(status.recursive || status.path == "") {
				var map = js_Boot.__cast(expected , haxe_IMap);
				var vmap = js_Boot.__cast(value , haxe_IMap);
				var _g1 = [];
				var k = map.keys();
				while(k.hasNext()) {
					var k1 = k.next();
					_g1.push(k1);
				}
				var keys = _g1;
				var _g1 = [];
				var k = vmap.keys();
				while(k.hasNext()) {
					var k1 = k.next();
					_g1.push(k1);
				}
				var vkeys = _g1;
				if(keys.length != vkeys.length) {
					status.error = "expected " + keys.length + " keys but they are " + vkeys.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path = status.path;
				var _g1 = 0;
				while(_g1 < keys.length) {
					var key = keys[_g1];
					++_g1;
					status.path = path == "" ? "hash[" + Std.string(key) + "]" : path + "[" + Std.string(key) + "]";
					if(!utest_Assert.sameAs(map.get(key),vmap.get(key),status,approx)) {
						status.error = "expected " + utest_Assert.q(status.expectedValue) + " but it is " + utest_Assert.q(status.actualValue) + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(utest_Assert.isIterator(expected,false)) {
			if(status.recursive || status.path == "") {
				var evalues = Lambda.array({ iterator : function() {
					return expected;
				}});
				var vvalues = Lambda.array({ iterator : function() {
					return value;
				}});
				if(evalues.length != vvalues.length) {
					status.error = "expected " + evalues.length + " values in Iterator but they are " + vvalues.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path = status.path;
				var _g1 = 0;
				var _g2 = evalues.length;
				while(_g1 < _g2) {
					var i = _g1++;
					status.path = path == "" ? "iterator[" + i + "]" : path + "[" + i + "]";
					if(!utest_Assert.sameAs(evalues[i],vvalues[i],status,approx)) {
						status.error = "expected " + utest_Assert.q(status.expectedValue) + " but it is " + utest_Assert.q(status.actualValue) + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(utest_Assert.isIterable(expected,false)) {
			if(status.recursive || status.path == "") {
				var evalues = Lambda.array(expected);
				var vvalues = Lambda.array(value);
				if(evalues.length != vvalues.length) {
					status.error = "expected " + evalues.length + " values in Iterable but they are " + vvalues.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path = status.path;
				var _g1 = 0;
				var _g2 = evalues.length;
				while(_g1 < _g2) {
					var i = _g1++;
					status.path = path == "" ? "iterable[" + i + "]" : path + "[" + i + "]";
					if(!utest_Assert.sameAs(evalues[i],vvalues[i],status,approx)) {
						return false;
					}
				}
			}
			return true;
		}
		if(status.recursive || status.path == "") {
			var fields = Type.getInstanceFields(js_Boot.getClass(expected));
			var path = status.path;
			var _g1 = 0;
			while(_g1 < fields.length) {
				var field = fields[_g1];
				++_g1;
				status.path = path == "" ? field : path + "." + field;
				var e = Reflect.field(expected,field);
				if(Reflect.isFunction(e)) {
					continue;
				}
				var v = Reflect.field(value,field);
				if(!utest_Assert.sameAs(e,v,status,approx)) {
					return false;
				}
			}
		}
		return true;
	case 7:
		var e = _g.e;
		var eexpected = e.__ename__;
		var e = Type.getEnum(value);
		var evalue = e.__ename__;
		if(eexpected != evalue) {
			status.error = "expected enumeration of " + utest_Assert.q(eexpected) + " but it is " + utest_Assert.q(evalue) + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		if(status.recursive || status.path == "") {
			if(expected._hx_index != value._hx_index) {
				var e = expected;
				var tmp = "expected enum constructor " + utest_Assert.q($hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name) + " but it is ";
				var e = value;
				status.error = tmp + utest_Assert.q($hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name) + (status.path == "" ? "" : " for field " + status.path);
				return false;
			}
			var eparams = Type.enumParameters(expected);
			var vparams = Type.enumParameters(value);
			var path = status.path;
			var _g = 0;
			var _g1 = eparams.length;
			while(_g < _g1) {
				var i = _g++;
				status.path = path == "" ? "enum[" + i + "]" : path + "[" + i + "]";
				if(!utest_Assert.sameAs(eparams[i],vparams[i],status,approx)) {
					status.error = "expected enum param " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path) + " with " + status.error;
					return false;
				}
			}
		}
		return true;
	case 8:
		throw haxe_Exception.thrown("Unable to compare two unknown types");
	}
};
utest_Assert.q = function(v) {
	if(typeof(v) == "string") {
		return "\"" + StringTools.replace(v,"\"","\\\"") + "\"";
	} else {
		return Std.string(v);
	}
};
utest_Assert.same = function(expected,value,recursive,msg,approx,pos) {
	if(null == approx) {
		approx = 1e-5;
	}
	var status = { recursive : null == recursive ? true : recursive, path : "", error : null, expectedValue : expected, actualValue : value};
	if(utest_Assert.sameAs(expected,value,status,approx)) {
		return utest_Assert.pass(msg,pos);
	} else {
		return utest_Assert.fail(msg == null ? status.error : msg,pos);
	}
};
utest_Assert.raises = function(method,type,msgNotThrown,msgWrongType,pos) {
	var name = type != null ? type.__name__ : "Dynamic";
	try {
		method();
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var ex = haxe_Exception.caught(_g).unwrap();
		if(null == type) {
			return utest_Assert.pass(null,pos);
		} else {
			if(null == msgWrongType) {
				msgWrongType = "expected throw of type " + name + " but it is " + Std.string(ex);
			}
			return utest_Assert.isTrue(js_Boot.__instanceof(ex,type),msgWrongType,pos);
		}
	}
	if(null == msgNotThrown) {
		msgNotThrown = "exception of type " + name + " not raised";
	}
	return utest_Assert.fail(msgNotThrown,pos);
};
utest_Assert.allows = function(possibilities,value,msg,pos) {
	if(Lambda.has(possibilities,value)) {
		return utest_Assert.isTrue(true,msg,pos);
	} else {
		return utest_Assert.fail(msg == null ? "value " + utest_Assert.q(value) + " not found in the expected possibilities " + Std.string(possibilities) : msg,pos);
	}
};
utest_Assert.contains = function(match,values,msg,pos) {
	if(Lambda.has(values,match)) {
		return utest_Assert.isTrue(true,msg,pos);
	} else {
		return utest_Assert.fail(msg == null ? "values " + utest_Assert.q(values) + " do not contain " + Std.string(match) : msg,pos);
	}
};
utest_Assert.notContains = function(match,values,msg,pos) {
	if(!Lambda.has(values,match)) {
		return utest_Assert.isTrue(true,msg,pos);
	} else {
		return utest_Assert.fail(msg == null ? "values " + utest_Assert.q(values) + " do contain " + Std.string(match) : msg,pos);
	}
};
utest_Assert.stringContains = function(match,value,msg,pos) {
	if(value != null && value.indexOf(match) >= 0) {
		return utest_Assert.isTrue(true,msg,pos);
	} else {
		return utest_Assert.fail(msg == null ? "value " + utest_Assert.q(value) + " does not contain " + utest_Assert.q(match) : msg,pos);
	}
};
utest_Assert.stringSequence = function(sequence,value,msg,pos) {
	if(null == value) {
		return utest_Assert.fail(msg == null ? "null argument value" : msg,pos);
	}
	var p = 0;
	var _g = 0;
	while(_g < sequence.length) {
		var s = sequence[_g];
		++_g;
		var p2 = value.indexOf(s,p);
		if(p2 < 0) {
			if(msg == null) {
				msg = "expected '" + s + "' after ";
				if(p > 0) {
					var cut = HxOverrides.substr(value,0,p);
					if(cut.length > 30) {
						cut = "..." + HxOverrides.substr(cut,-27,null);
					}
					msg += " '" + cut + "'";
				} else {
					msg += " begin";
				}
			}
			return utest_Assert.fail(msg,pos);
		}
		p = p2 + s.length;
	}
	return utest_Assert.isTrue(true,msg,pos);
};
utest_Assert.pass = function(msg,pos) {
	if(msg == null) {
		msg = "pass expected";
	}
	return utest_Assert.isTrue(true,msg,pos);
};
utest_Assert.fail = function(msg,pos) {
	if(msg == null) {
		msg = "failure expected";
	}
	return utest_Assert.isTrue(false,msg,pos);
};
utest_Assert.warn = function(msg) {
	utest_Assert.results.add(utest_Assertation.Warning(msg));
};
utest_Assert.createAsync = function(f,timeout) {
	return function() {
	};
};
utest_Assert.createEvent = function(f,timeout) {
	return function(e) {
	};
};
utest_Assert.typeToString = function(t) {
	try {
		var _t = js_Boot.getClass(t);
		if(_t != null) {
			t = _t;
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
	}
	try {
		return t.__name__;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
	}
	try {
		var _t = Type.getEnum(t);
		if(_t != null) {
			t = _t;
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
	}
	try {
		return t.__ename__;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
	}
	try {
		return Std.string(Type.typeof(t));
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
	}
	try {
		return Std.string(t);
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
	}
	return "<unable to retrieve type name>";
};
var utest_Assertation = $hxEnums["utest.Assertation"] = { __ename__:"utest.Assertation",__constructs__:null
	,Success: ($_=function(pos) { return {_hx_index:0,pos:pos,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="Success",$_.__params__ = ["pos"],$_)
	,Failure: ($_=function(msg,pos) { return {_hx_index:1,msg:msg,pos:pos,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="Failure",$_.__params__ = ["msg","pos"],$_)
	,Error: ($_=function(e,stack) { return {_hx_index:2,e:e,stack:stack,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="Error",$_.__params__ = ["e","stack"],$_)
	,SetupError: ($_=function(e,stack) { return {_hx_index:3,e:e,stack:stack,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="SetupError",$_.__params__ = ["e","stack"],$_)
	,TeardownError: ($_=function(e,stack) { return {_hx_index:4,e:e,stack:stack,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="TeardownError",$_.__params__ = ["e","stack"],$_)
	,TimeoutError: ($_=function(missedAsyncs,stack) { return {_hx_index:5,missedAsyncs:missedAsyncs,stack:stack,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="TimeoutError",$_.__params__ = ["missedAsyncs","stack"],$_)
	,AsyncError: ($_=function(e,stack) { return {_hx_index:6,e:e,stack:stack,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="AsyncError",$_.__params__ = ["e","stack"],$_)
	,Warning: ($_=function(msg) { return {_hx_index:7,msg:msg,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="Warning",$_.__params__ = ["msg"],$_)
	,Ignore: ($_=function(reason) { return {_hx_index:8,reason:reason,__enum__:"utest.Assertation",toString:$estr}; },$_._hx_name="Ignore",$_.__params__ = ["reason"],$_)
};
utest_Assertation.__constructs__ = [utest_Assertation.Success,utest_Assertation.Failure,utest_Assertation.Error,utest_Assertation.SetupError,utest_Assertation.TeardownError,utest_Assertation.TimeoutError,utest_Assertation.AsyncError,utest_Assertation.Warning,utest_Assertation.Ignore];
var utest_Async = function(timeoutMs) {
	if(timeoutMs == null) {
		timeoutMs = 250;
	}
	this.branches = [];
	this.callbacks = [];
	this.timedOut = false;
	this.resolved = false;
	this.timeoutMs = timeoutMs;
	var hrtime = process.hrtime();
	this.startTime = hrtime[0] + hrtime[1] / 1e9;
	this.timer = haxe_Timer.delay($bind(this,this.setTimedOutState),timeoutMs);
};
$hxClasses["utest.Async"] = utest_Async;
utest_Async.__name__ = "utest.Async";
utest_Async.getResolved = function() {
	if(utest_Async.resolvedInstance == null) {
		utest_Async.resolvedInstance = new utest_Async();
		utest_Async.resolvedInstance.done({ fileName : "utest/Async.hx", lineNumber : 30, className : "utest.Async", methodName : "getResolved"});
	}
	return utest_Async.resolvedInstance;
};
utest_Async.prototype = {
	resolved: null
	,timedOut: null
	,callbacks: null
	,timeoutMs: null
	,startTime: null
	,timer: null
	,branches: null
	,done: function(pos) {
		if(this.resolved) {
			if(this.timedOut) {
				throw haxe_Exception.thrown("Cannot done() at " + pos.fileName + ":" + pos.lineNumber + " because async is timed out.");
			} else {
				throw haxe_Exception.thrown("Cannot done() at " + pos.fileName + ":" + pos.lineNumber + " because async is done already.");
			}
		}
		this.resolved = true;
		this.timer.stop();
		var _g = 0;
		var _g1 = this.callbacks;
		while(_g < _g1.length) {
			var cb = _g1[_g];
			++_g;
			cb();
		}
	}
	,setTimeout: function(timeoutMs,pos) {
		if(this.resolved) {
			throw haxe_Exception.thrown("Cannot setTimeout(" + timeoutMs + ") at " + pos.fileName + ":" + pos.lineNumber + " because async is done.");
		}
		if(this.timedOut) {
			throw haxe_Exception.thrown("Cannot setTimeout(" + timeoutMs + ") at " + pos.fileName + ":" + pos.lineNumber + " because async is timed out.");
		}
		this.timer.stop();
		this.timeoutMs = timeoutMs;
		var hrtime = process.hrtime();
		var delay = timeoutMs - Math.round(1000 * (hrtime[0] + hrtime[1] / 1e9 - this.startTime));
		this.timer = haxe_Timer.delay($bind(this,this.setTimedOutState),delay);
	}
	,branch: function(fn,pos) {
		var branch = new utest_Async(this.timeoutMs);
		this.branches.push(branch);
		var _g = $bind(this,this.checkBranches);
		var pos1 = pos;
		branch.then(function() {
			_g(pos1);
		});
		if(fn != null) {
			fn(branch);
		}
		return branch;
	}
	,checkBranches: function(pos) {
		var _gthis = this;
		if(this.resolved) {
			return;
		}
		var _g = 0;
		var _g1 = this.branches;
		while(_g < _g1.length) {
			var branch = _g1[_g];
			++_g;
			if(!branch.resolved) {
				return;
			}
			if(branch.timedOut) {
				this.setTimedOutState();
				return;
			}
		}
		var branchCount = this.branches.length;
		haxe_Timer.delay(function() {
			if(branchCount == _gthis.branches.length) {
				_gthis.done(pos);
			}
		},5);
	}
	,then: function(cb) {
		if(this.resolved) {
			cb();
		} else {
			this.callbacks.push(cb);
		}
	}
	,setTimedOutState: function() {
		if(this.resolved) {
			return;
		}
		this.timedOut = true;
		this.done({ fileName : "utest/Async.hx", lineNumber : 115, className : "utest.Async", methodName : "setTimedOutState"});
	}
	,__class__: utest_Async
};
var utest__$Dispatcher_EventException = $hxEnums["utest._Dispatcher.EventException"] = { __ename__:"utest._Dispatcher.EventException",__constructs__:null
	,StopPropagation: {_hx_name:"StopPropagation",_hx_index:0,__enum__:"utest._Dispatcher.EventException",toString:$estr}
};
utest__$Dispatcher_EventException.__constructs__ = [utest__$Dispatcher_EventException.StopPropagation];
var utest_Dispatcher = function() {
	this.handlers = [];
};
$hxClasses["utest.Dispatcher"] = utest_Dispatcher;
utest_Dispatcher.__name__ = "utest.Dispatcher";
utest_Dispatcher.stop = function() {
	throw haxe_Exception.thrown(utest__$Dispatcher_EventException.StopPropagation);
};
utest_Dispatcher.prototype = {
	handlers: null
	,add: function(h) {
		this.handlers.push(h);
		return h;
	}
	,remove: function(h) {
		var _g = 0;
		var _g1 = this.handlers.length;
		while(_g < _g1) {
			var i = _g++;
			if(Reflect.compareMethods(this.handlers[i],h)) {
				return this.handlers.splice(i,1)[0];
			}
		}
		return null;
	}
	,clear: function() {
		this.handlers = [];
	}
	,dispatch: function(e) {
		try {
			var list = this.handlers.slice();
			var _g = 0;
			while(_g < list.length) {
				var l = list[_g];
				++_g;
				l(e);
			}
			return true;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			if(js_Boot.__instanceof(haxe_Exception.caught(_g).unwrap(),utest__$Dispatcher_EventException)) {
				return false;
			} else {
				throw _g;
			}
		}
	}
	,has: function() {
		return this.handlers.length > 0;
	}
	,__class__: utest_Dispatcher
};
var utest_Notifier = function() {
	this.handlers = [];
};
$hxClasses["utest.Notifier"] = utest_Notifier;
utest_Notifier.__name__ = "utest.Notifier";
utest_Notifier.stop = function() {
	throw haxe_Exception.thrown(utest__$Dispatcher_EventException.StopPropagation);
};
utest_Notifier.prototype = {
	handlers: null
	,add: function(h) {
		this.handlers.push(h);
		return h;
	}
	,remove: function(h) {
		var _g = 0;
		var _g1 = this.handlers.length;
		while(_g < _g1) {
			var i = _g++;
			if(Reflect.compareMethods(this.handlers[i],h)) {
				return this.handlers.splice(i,1)[0];
			}
		}
		return null;
	}
	,clear: function() {
		this.handlers = [];
	}
	,dispatch: function() {
		try {
			var list = this.handlers.slice();
			var _g = 0;
			while(_g < list.length) {
				var l = list[_g];
				++_g;
				l();
			}
			return true;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			if(js_Boot.__instanceof(haxe_Exception.caught(_g).unwrap(),utest__$Dispatcher_EventException)) {
				return false;
			} else {
				throw _g;
			}
		}
	}
	,has: function() {
		return this.handlers.length > 0;
	}
	,__class__: utest_Notifier
};
var utest_TestHandler = function(fixture) {
	this.wasBound = false;
	this.finished = false;
	if(fixture == null) {
		throw haxe_Exception.thrown("fixture argument is null");
	}
	this.fixture = fixture;
	this.results = new haxe_ds_List();
	this.asyncStack = new haxe_ds_List();
	this.onTested = new utest_Dispatcher();
	this.onTimeout = new utest_Dispatcher();
	this.onComplete = new utest_Dispatcher();
	this.onPrecheck = new utest_Dispatcher();
	if(fixture.ignoringInfo != null) {
		this.results.add(utest_Assertation.Ignore(fixture.ignoringInfo));
	}
};
$hxClasses["utest.TestHandler"] = utest_TestHandler;
utest_TestHandler.__name__ = "utest.TestHandler";
utest_TestHandler.exceptionStack = function(pops) {
	if(pops == null) {
		pops = 2;
	}
	var stack = haxe_CallStack.exceptionStack();
	while(pops-- > 0) stack.pop();
	return stack;
};
utest_TestHandler.prototype = {
	results: null
	,fixture: null
	,finished: null
	,asyncStack: null
	,onTested: null
	,onTimeout: null
	,onComplete: null
	,onPrecheck: null
	,precheck: null
	,wasBound: null
	,execute: function() {
		var _gthis = this;
		if(this.fixture.ignoringInfo != null) {
			this.executeFinally();
			return;
		}
		var isSync = true;
		var expectingAsync = true;
		var run = function() {
			if(isSync) {
				expectingAsync = false;
				return;
			}
			_gthis.executeFixtureMethod();
			_gthis.executeFinally();
		};
		try {
			this.executeMethod(this.fixture.setup);
			this.executeAsyncMethod(this.fixture.setupAsync,run);
			if(!expectingAsync) {
				this.executeFixtureMethod();
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			this.results.add(utest_Assertation.SetupError(e,utest_TestHandler.exceptionStack()));
		}
		isSync = false;
		if(!expectingAsync) {
			this.executeFinally();
		}
	}
	,executeFixtureMethod: function() {
		try {
			this.executeMethod(this.fixture.method);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			this.results.add(utest_Assertation.Error(e,utest_TestHandler.exceptionStack()));
		}
	}
	,executeFinally: function() {
		this.onPrecheck.dispatch(this);
		this.checkTested();
	}
	,checkTested: function() {
		if(this.expiration == null || this.asyncStack.length == 0) {
			this.tested();
		} else {
			var hrtime = process.hrtime();
			if(hrtime[0] + hrtime[1] / 1e9 > this.expiration) {
				this.timeout();
			} else {
				haxe_Timer.delay($bind(this,this.checkTested),10);
			}
		}
	}
	,expiration: null
	,setTimeout: function(timeout) {
		var hrtime = process.hrtime();
		var newExpire = hrtime[0] + hrtime[1] / 1e9 + timeout / 1000;
		this.expiration = this.expiration == null ? newExpire : newExpire > this.expiration ? newExpire : this.expiration;
	}
	,bindHandler: function() {
		if(this.wasBound) {
			return;
		}
		utest_Assert.results = this.results;
		utest_Assert.createAsync = $bind(this,this.addAsync);
		utest_Assert.createEvent = $bind(this,this.addEvent);
		this.wasBound = true;
	}
	,unbindHandler: function() {
		if(!this.wasBound) {
			return;
		}
		utest_Assert.results = null;
		utest_Assert.createAsync = function(f,t) {
			return function() {
			};
		};
		utest_Assert.createEvent = function(f,t) {
			return function(e) {
			};
		};
		this.wasBound = false;
	}
	,addAsync: function(f,timeout) {
		if(timeout == null) {
			timeout = 250;
		}
		if(null == f) {
			f = function() {
			};
		}
		this.asyncStack.add(f);
		var handler = this;
		this.setTimeout(timeout);
		return function() {
			if(!handler.asyncStack.remove(f)) {
				handler.results.add(utest_Assertation.AsyncError("async function already executed",[]));
				return;
			}
			try {
				handler.bindHandler();
				f();
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				handler.results.add(utest_Assertation.AsyncError(e,utest_TestHandler.exceptionStack(0)));
			}
		};
	}
	,addEvent: function(f,timeout) {
		if(timeout == null) {
			timeout = 250;
		}
		this.asyncStack.add(f);
		var handler = this;
		this.setTimeout(timeout);
		return function(e) {
			if(!handler.asyncStack.remove(f)) {
				handler.results.add(utest_Assertation.AsyncError("event already executed",[]));
				return;
			}
			try {
				handler.bindHandler();
				f(e);
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				handler.results.add(utest_Assertation.AsyncError(e,utest_TestHandler.exceptionStack(0)));
			}
		};
	}
	,executeMethod: function(name) {
		if(name == null) {
			return;
		}
		this.bindHandler();
		Reflect.field(this.fixture.target,name).apply(this.fixture.target,[]);
	}
	,executeAsyncMethod: function(name,done) {
		if(name == null) {
			done();
			return;
		}
		this.bindHandler();
		Reflect.field(this.fixture.target,name).apply(this.fixture.target,[done]);
	}
	,tested: function() {
		if(this.results.length == 0) {
			this.results.add(utest_Assertation.Warning("no assertions"));
		}
		this.onTested.dispatch(this);
		this.completed();
	}
	,timeout: function() {
		this.results.add(utest_Assertation.TimeoutError(this.asyncStack.length,[]));
		this.onTimeout.dispatch(this);
		this.completed();
	}
	,completed: function() {
		var _gthis = this;
		if(this.fixture.ignoringInfo != null) {
			this.completedFinally();
			return;
		}
		var isSync = true;
		var expectingAsync = true;
		var complete = function() {
			if(isSync) {
				expectingAsync = false;
				return;
			}
			_gthis.completedFinally();
		};
		try {
			this.executeMethod(this.fixture.teardown);
			this.executeAsyncMethod(this.fixture.teardownAsync,complete);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			this.results.add(utest_Assertation.TeardownError(e,utest_TestHandler.exceptionStack(2)));
		}
		isSync = false;
		if(!expectingAsync) {
			this.completedFinally();
		}
	}
	,completedFinally: function() {
		this.finished = true;
		this.unbindHandler();
		this.onComplete.dispatch(this);
	}
	,__class__: utest_TestHandler
};
var utest_ITestHandler = function(fixture) {
	utest_TestHandler.call(this,fixture);
	if(!fixture.isITest) {
		throw haxe_Exception.thrown("Invalid fixture type for utest.ITestHandler");
	}
	this.testCase = js_Boot.__cast(fixture.target , utest_ITest);
	this.test = fixture.test;
	if(this.test == null) {
		throw haxe_Exception.thrown("Fixture is missing test data");
	}
};
$hxClasses["utest.ITestHandler"] = utest_ITestHandler;
utest_ITestHandler.__name__ = "utest.ITestHandler";
utest_ITestHandler.__super__ = utest_TestHandler;
utest_ITestHandler.prototype = $extend(utest_TestHandler.prototype,{
	testCase: null
	,test: null
	,setupAsync: null
	,testAsync: null
	,teardownAsync: null
	,execute: function() {
		if(this.fixture.ignoringInfo != null) {
			this.executeFinally();
			return;
		}
		this.bindHandler();
		this.runSetup();
	}
	,runSetup: function() {
		try {
			this.setupAsync = this.fixture.setupMethod();
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			this.results.add(utest_Assertation.SetupError(e,haxe_CallStack.exceptionStack()));
			this.completedFinally();
			return;
		}
		this.setupAsync.then($bind(this,this.checkSetup));
	}
	,checkSetup: function() {
		if(this.setupAsync.timedOut) {
			this.results.add(utest_Assertation.SetupError("Setup timeout",[]));
			this.completedFinally();
		} else {
			this.runTest();
		}
	}
	,runTest: function() {
		try {
			this.testAsync = this.test.execute();
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			this.results.add(utest_Assertation.Error(e,haxe_CallStack.exceptionStack()));
			this.runTeardown();
			return;
		}
		this.testAsync.then($bind(this,this.checkTest));
	}
	,checkTest: function() {
		this.onPrecheck.dispatch(this);
		if(this.testAsync.timedOut) {
			this.results.add(utest_Assertation.TimeoutError(1,[]));
			this.onTimeout.dispatch(this);
		} else if(this.testAsync.resolved) {
			if(this.results.length == 0) {
				this.results.add(utest_Assertation.Warning("no assertions"));
			}
			this.onTested.dispatch(this);
		} else {
			throw haxe_Exception.thrown("Unexpected test state");
		}
		this.runTeardown();
	}
	,runTeardown: function() {
		try {
			this.teardownAsync = this.fixture.teardownMethod();
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			this.results.add(utest_Assertation.TeardownError(e,haxe_CallStack.exceptionStack()));
			this.completedFinally();
			return;
		}
		this.teardownAsync.then($bind(this,this.checkTeardown));
	}
	,checkTeardown: function() {
		if(this.teardownAsync.timedOut) {
			this.results.add(utest_Assertation.TeardownError("Teardown timeout",[]));
		}
		this.completedFinally();
	}
	,bindHandler: function() {
		if(this.wasBound) {
			return;
		}
		utest_Assert.results = this.results;
		var msg = " is not allowed in tests extending utest.ITest. Add `async:utest.Async` argument to the test method instead.";
		utest_Assert.createAsync = function(f,t) {
			throw haxe_Exception.thrown("Assert.createAsync() " + msg);
		};
		utest_Assert.createEvent = function(f,t) {
			throw haxe_Exception.thrown("Assert.createEvent() " + msg);
		};
		this.wasBound = true;
	}
	,__class__: utest_ITestHandler
});
var utest_IgnoredFixture = {};
utest_IgnoredFixture.__properties__ = {get_ignoreReason:"get_ignoreReason",get_isIgnored:"get_isIgnored"};
utest_IgnoredFixture.NotIgnored = function() {
	var this1 = null;
	return this1;
};
utest_IgnoredFixture.Ignored = function(reason) {
	var this1 = reason != null ? reason : "";
	return this1;
};
utest_IgnoredFixture._new = function(reason) {
	var this1 = reason;
	return this1;
};
utest_IgnoredFixture.get_isIgnored = function(this1) {
	return this1 != null;
};
utest_IgnoredFixture.get_ignoreReason = function(this1) {
	return this1;
};
var utest_Runner = function() {
	this.executedFixtures = 0;
	this.pos = 0;
	this.complete = false;
	this.globalPattern = null;
	this.iTestFixtures = new haxe_ds_StringMap();
	this.fixtures = [];
	this.onProgress = new utest_Dispatcher();
	this.onStart = new utest_Dispatcher();
	this.onComplete = new utest_Dispatcher();
	this.onPrecheck = new utest_Dispatcher();
	this.onTestStart = new utest_Dispatcher();
	this.onTestComplete = new utest_Dispatcher();
	this.length = 0;
	var envPattern = null;
	if(envPattern != null) {
		this.globalPattern = new EReg(envPattern,"");
	}
	if(!_$testadapter_data_TestFilter.hasFilters({ include : [], exclude : []})) {
		_$testadapter_data_TestResults.clear("D:\\Workspaces\\Haxe\\Libraries\\haxe-injection\\tests\\unit/");
	}
	new _$testadapter_utest_Reporter(this,"D:\\Workspaces\\Haxe\\Libraries\\haxe-injection\\tests\\unit/");
};
$hxClasses["utest.Runner"] = utest_Runner;
utest_Runner.__name__ = "utest.Runner";
utest_Runner.prototype = {
	fixtures: null
	,iTestFixtures: null
	,onProgress: null
	,onStart: null
	,onComplete: null
	,onPrecheck: null
	,onTestStart: null
	,onTestComplete: null
	,length: null
	,globalPattern: null
	,complete: null
	,addCase: function(test,setup,teardown,prefix,pattern,setupAsync,teardownAsync) {
		if(teardownAsync == null) {
			teardownAsync = "teardownAsync";
		}
		if(setupAsync == null) {
			setupAsync = "setupAsync";
		}
		if(prefix == null) {
			prefix = "test";
		}
		if(teardown == null) {
			teardown = "teardown";
		}
		if(setup == null) {
			setup = "setup";
		}
		if(js_Boot.__implements(test,utest_ITest)) {
			this.addITest(test,pattern);
		} else {
			this.addCaseOld(test,setup,teardown,prefix,pattern,setupAsync,teardownAsync);
		}
	}
	,addITest: function(testCase,pattern) {
		var c = js_Boot.getClass(testCase);
		var className = c.__name__;
		if(Object.prototype.hasOwnProperty.call(this.iTestFixtures.h,className)) {
			throw haxe_Exception.thrown("Cannot add the same test twice.");
		}
		var fixtures = [];
		var init = testCase.__initializeUtest__();
		var cls = _$testadapter_data_SuiteIdentifier.ClassName(className);
		var _g = 0;
		var _g1 = init.tests;
		while(_g < _g1.length) {
			var test = _g1[_g];
			++_g;
			if(!this.isTestFixtureName(_$testadapter_data_SuiteId.toString(cls),test.name,["test","spec"],pattern,this.globalPattern)) {
				continue;
			}
			if(!_$testadapter_data_TestFilter.shouldRunTest({ include : [], exclude : []},_$testadapter_data_SuiteId.toString(cls),test.name)) {
				continue;
			}
			var fixture = utest_TestFixture.ofData(testCase,test,init.accessories);
			this.addFixture(fixture);
			fixtures.push(fixture);
		}
		if(fixtures.length <= 0) {
			return;
		}
		var this1 = this.iTestFixtures;
		var value = { caseInstance : testCase, setupClass : utest_utils_AccessoriesUtils.getSetupClass(init.accessories), dependencies : init.dependencies, fixtures : fixtures, teardownClass : utest_utils_AccessoriesUtils.getTeardownClass(init.accessories)};
		this1.h[className] = value;
	}
	,addCaseOld: function(test,setup,teardown,prefix,pattern,setupAsync,teardownAsync) {
		if(teardownAsync == null) {
			teardownAsync = "teardownAsync";
		}
		if(setupAsync == null) {
			setupAsync = "setupAsync";
		}
		if(prefix == null) {
			prefix = "test";
		}
		if(teardown == null) {
			teardown = "teardown";
		}
		if(setup == null) {
			setup = "setup";
		}
		if(!Reflect.isObject(test)) {
			throw haxe_Exception.thrown("can't add a null object as a test case");
		}
		if(!this.isMethod(test,setup)) {
			setup = null;
		}
		if(!this.isMethod(test,setupAsync)) {
			setupAsync = null;
		}
		if(!this.isMethod(test,teardown)) {
			teardown = null;
		}
		if(!this.isMethod(test,teardownAsync)) {
			teardownAsync = null;
		}
		var fields = Type.getInstanceFields(js_Boot.getClass(test));
		var c = js_Boot.getClass(test);
		var className = c.__name__;
		var _g = 0;
		while(_g < fields.length) {
			var field = fields[_g];
			++_g;
			if(!this.isMethod(test,field)) {
				continue;
			}
			if(!this.isTestFixtureName(className,field,[prefix],pattern,this.globalPattern)) {
				continue;
			}
			this.addFixture(new utest_TestFixture(test,field,setup,teardown,setupAsync,teardownAsync));
		}
	}
	,isTestFixtureName: function(caseName,testName,prefixes,pattern,globalPattern) {
		if(pattern == null && globalPattern == null) {
			var _g = 0;
			while(_g < prefixes.length) {
				var prefix = prefixes[_g];
				++_g;
				if(StringTools.startsWith(testName,prefix)) {
					return true;
				}
			}
			return false;
		}
		if(pattern == null) {
			pattern = globalPattern;
		}
		return pattern.match("" + caseName + "." + testName);
	}
	,addFixture: function(fixture) {
		this.fixtures.push(fixture);
		this.length++;
	}
	,getFixture: function(index) {
		return this.fixtures[index];
	}
	,isMethod: function(test,name) {
		try {
			return Reflect.isFunction(Reflect.field(test,name));
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return false;
		}
	}
	,run: function() {
		this.onStart.dispatch(this);
		var iTestRunner = new utest__$Runner_ITestRunner(this);
		iTestRunner.run();
		this.waitForCompletion();
	}
	,waitForCompletion: function() {
		if(!this.complete) {
			haxe_Timer.delay($bind(this,this.waitForCompletion),100);
		}
	}
	,pos: null
	,executedFixtures: null
	,runNext: function(finishedHandler) {
		var currentCase = null;
		var _g = this.pos;
		var _g1 = this.fixtures.length;
		while(_g < _g1) {
			var i = _g++;
			var fixture = this.fixtures[this.pos++];
			if(fixture.isITest) {
				continue;
			}
			if(currentCase != fixture.target) {
				currentCase = fixture.target;
				var c = js_Boot.getClass(currentCase);
				utest_utils_Print.startCase(c.__name__);
			}
			var handler = this.runFixture(fixture);
			if(!handler.finished) {
				handler.onComplete.add($bind(this,this.runNext));
				return;
			}
		}
		this.complete = true;
		this.onComplete.dispatch(this);
	}
	,runFixture: function(fixture) {
		var handler = fixture.isITest ? new utest_ITestHandler(fixture) : new utest_TestHandler(fixture);
		handler.onComplete.add($bind(this,this.testComplete));
		handler.onPrecheck.add(($_=this.onPrecheck,$bind($_,$_.dispatch)));
		utest_utils_Print.startTest(fixture.method);
		this.onTestStart.dispatch(handler);
		handler.execute();
		return handler;
	}
	,testComplete: function(h) {
		++this.executedFixtures;
		this.onTestComplete.dispatch(h);
		this.onProgress.dispatch({ result : utest_TestResult.ofHandler(h), done : this.executedFixtures, totals : this.length});
	}
	,__class__: utest_Runner
};
var utest__$Runner_ITestRunner = function(runner) {
	this.failedCases = [];
	this.failedTestsInCurrentCase = [];
	var _gthis = this;
	this.runner = runner;
	runner.onTestComplete.add(function(handler) {
		var _g_head = handler.results.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var result = val;
			if(result._hx_index == 0) {
				var _g = result.pos;
			} else {
				_gthis.failedTestsInCurrentCase.push(handler.fixture.method);
				var c = js_Boot.getClass(handler.fixture.target);
				_gthis.failedCases.push(c.__name__);
			}
		}
	});
};
$hxClasses["utest._Runner.ITestRunner"] = utest__$Runner_ITestRunner;
utest__$Runner_ITestRunner.__name__ = "utest._Runner.ITestRunner";
utest__$Runner_ITestRunner.prototype = {
	runner: null
	,cases: null
	,currentCaseName: null
	,currentCase: null
	,currentCaseFixtures: null
	,teardownClass: null
	,setupAsync: null
	,teardownAsync: null
	,failedTestsInCurrentCase: null
	,failedCases: null
	,run: function() {
		this.cases = this.orderClassesByDependencies();
		this.runCases();
	}
	,orderClassesByDependencies: function() {
		var _gthis = this;
		var result = [];
		var error = function(testCase,msg) {
			_gthis.runner.onProgress.dispatch({ totals : _gthis.runner.length, result : utest_TestResult.ofFailedSetupClass(testCase,utest_Assertation.SetupError(msg,[])), done : _gthis.runner.executedFixtures});
		};
		var added_h = Object.create(null);
		var addClass = null;
		addClass = function(cls,stack) {
			if(Object.prototype.hasOwnProperty.call(added_h,cls)) {
				return;
			}
			var data = _gthis.runner.iTestFixtures.h[cls];
			if(stack.indexOf(cls) >= 0) {
				error(data.caseInstance,"Circular dependencies among test classes detected: " + stack.join(" -> "));
				return;
			}
			stack.push(cls);
			var dependencies = data.dependencies;
			var _g = 0;
			while(_g < dependencies.length) {
				var dependency = dependencies[_g];
				++_g;
				if(Object.prototype.hasOwnProperty.call(_gthis.runner.iTestFixtures.h,dependency)) {
					addClass(dependency,stack);
				} else {
					error(data.caseInstance,"This class depends on " + dependency + ", but it cannot be found. Was it added to test runner?");
					return;
				}
			}
			result.push(cls);
			added_h[cls] = true;
		};
		var h = this.runner.iTestFixtures.h;
		var cls_h = h;
		var cls_keys = Object.keys(h);
		var cls_length = cls_keys.length;
		var cls_current = 0;
		while(cls_current < cls_length) {
			var cls = cls_keys[cls_current++];
			addClass(cls,[]);
		}
		return new haxe_iterators_ArrayIterator(result);
	}
	,failedDependencies: function(data) {
		var _g = 0;
		var _g1 = data.dependencies;
		while(_g < _g1.length) {
			var dependency = _g1[_g];
			++_g;
			if(this.failedCases.indexOf(dependency) >= 0) {
				return true;
			}
		}
		return false;
	}
	,runCases: function() {
		while(this.cases.hasNext()) {
			this.currentCaseName = this.cases.next();
			var data = this.runner.iTestFixtures.h[this.currentCaseName];
			this.currentCase = data.caseInstance;
			this.failedTestsInCurrentCase = [];
			if(this.failedDependencies(data)) {
				this.failedCases.push(this.currentCaseName);
				continue;
			}
			utest_utils_Print.startCase(this.currentCaseName);
			this.currentCaseFixtures = data.fixtures;
			this.teardownClass = data.teardownClass;
			try {
				this.setupAsync = data.setupClass();
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				this.setupFailed(utest_Assertation.SetupError("setupClass failed: " + Std.string(e),haxe_CallStack.exceptionStack()));
				return;
			}
			if(this.setupAsync.resolved) {
				if(!this.runFixtures()) {
					return;
				}
			} else {
				this.setupAsync.then($bind(this,this.checkSetup));
				return;
			}
		}
		this.runner.runNext();
	}
	,checkSetup: function() {
		if(this.setupAsync.timedOut) {
			this.setupFailed(utest_Assertation.SetupError("setupClass timeout",[]));
		} else {
			this.runFixtures();
		}
	}
	,setupFailed: function(assertation) {
		this.runner.executedFixtures += this.currentCaseFixtures.length;
		this.runner.onProgress.dispatch({ totals : this.runner.length, result : utest_TestResult.ofFailedSetupClass(this.currentCase,assertation), done : this.runner.executedFixtures});
		this.runCases();
	}
	,runFixtures: function(finishedHandler) {
		while(this.currentCaseFixtures.length > 0) {
			var fixture = this.currentCaseFixtures.shift();
			var _g = 0;
			var _g1 = fixture.test.dependencies;
			while(_g < _g1.length) {
				var dep = _g1[_g];
				++_g;
				if(this.failedTestsInCurrentCase.indexOf(dep) >= 0) {
					fixture.ignoringInfo = utest_IgnoredFixture.Ignored("Failed dependencies");
					break;
				}
			}
			var handler = this.runner.runFixture(fixture);
			if(!handler.finished) {
				handler.onComplete.add($bind(this,this.runFixtures));
				return false;
			}
		}
		try {
			this.teardownAsync = this.teardownClass();
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			this.teardownFailed(utest_Assertation.TeardownError("teardownClass failed: " + Std.string(e),haxe_CallStack.exceptionStack()));
			return true;
		}
		if(this.teardownAsync.resolved && finishedHandler == null) {
			return true;
		}
		this.teardownAsync.then($bind(this,this.checkTeardown));
		return false;
	}
	,checkTeardown: function() {
		if(this.teardownAsync.timedOut) {
			this.teardownFailed(utest_Assertation.TeardownError("teardownClass timeout",[]));
		}
		this.runCases();
	}
	,teardownFailed: function(assertation) {
		this.runner.onProgress.dispatch({ totals : this.runner.length, result : utest_TestResult.ofFailedTeardownClass(this.currentCase,assertation), done : this.runner.executedFixtures});
	}
	,__class__: utest__$Runner_ITestRunner
};
var utest_AccessoryName = function() { };
$hxClasses["utest.AccessoryName"] = utest_AccessoryName;
utest_AccessoryName.__name__ = "utest.AccessoryName";
var utest_TestFixture = function(target,method,setup,teardown,setupAsync,teardownAsync) {
	this.isITest = false;
	this.target = target;
	this.method = method;
	this.setup = setup;
	this.setupAsync = setupAsync;
	this.teardown = teardown;
	this.teardownAsync = teardownAsync;
	this.ignoringInfo = this.getIgnored();
};
$hxClasses["utest.TestFixture"] = utest_TestFixture;
utest_TestFixture.__name__ = "utest.TestFixture";
utest_TestFixture.ofData = function(target,test,accessories) {
	var fixture = new utest_TestFixture(target,test.name);
	fixture.isITest = true;
	fixture.test = test;
	fixture.setupMethod = utest_utils_AccessoriesUtils.getSetup(accessories);
	fixture.teardownMethod = utest_utils_AccessoriesUtils.getTeardown(accessories);
	return fixture;
};
utest_TestFixture.prototype = {
	target: null
	,method: null
	,setup: null
	,setupAsync: null
	,teardown: null
	,teardownAsync: null
	,ignoringInfo: null
	,isITest: null
	,test: null
	,setupMethod: null
	,teardownMethod: null
	,checkMethod: function(name,arg) {
		var field = Reflect.field(this.target,name);
		if(field == null) {
			throw haxe_Exception.thrown(arg + " function " + name + " is not a field of target");
		}
		if(!Reflect.isFunction(field)) {
			throw haxe_Exception.thrown(arg + " function " + name + " is not a function");
		}
	}
	,getIgnored: function() {
		var metas = haxe_rtti_Meta.getFields(js_Boot.getClass(this.target));
		var metasForTestMetas = Reflect.getProperty(metas,this.method);
		if(metasForTestMetas == null || !Object.prototype.hasOwnProperty.call(metasForTestMetas,"Ignored")) {
			return utest_IgnoredFixture.NotIgnored();
		}
		var ignoredArgs = Reflect.getProperty(metasForTestMetas,"Ignored");
		if(ignoredArgs == null || ignoredArgs.length == 0 || ignoredArgs[0] == null) {
			return utest_IgnoredFixture.Ignored();
		}
		var ignoredReason = Std.string(ignoredArgs[0]);
		return utest_IgnoredFixture.Ignored(ignoredReason);
	}
	,__class__: utest_TestFixture
};
var utest_TestResult = function() {
};
$hxClasses["utest.TestResult"] = utest_TestResult;
utest_TestResult.__name__ = "utest.TestResult";
utest_TestResult.ofHandler = function(handler) {
	var r = new utest_TestResult();
	var c = js_Boot.getClass(handler.fixture.target);
	var path = c.__name__.split(".");
	r.cls = path.pop();
	r.pack = path.join(".");
	r.method = handler.fixture.method;
	r.setup = handler.fixture.setup;
	r.setupAsync = handler.fixture.setupAsync;
	r.teardown = handler.fixture.teardown;
	r.teardownAsync = handler.fixture.teardownAsync;
	r.assertations = handler.results;
	return r;
};
utest_TestResult.ofFailedSetupClass = function(testCase,assertation) {
	var r = new utest_TestResult();
	var c = js_Boot.getClass(testCase);
	var path = c.__name__.split(".");
	r.cls = path.pop();
	r.pack = path.join(".");
	r.method = "setup";
	r.assertations = new haxe_ds_List();
	r.assertations.add(assertation);
	return r;
};
utest_TestResult.ofFailedTeardownClass = function(testCase,assertation) {
	var r = new utest_TestResult();
	var c = js_Boot.getClass(testCase);
	var path = c.__name__.split(".");
	r.cls = path.pop();
	r.pack = path.join(".");
	r.method = "setup";
	r.assertations = new haxe_ds_List();
	r.assertations.add(assertation);
	return r;
};
utest_TestResult.prototype = {
	pack: null
	,cls: null
	,method: null
	,setup: null
	,setupAsync: null
	,teardown: null
	,teardownAsync: null
	,assertations: null
	,__class__: utest_TestResult
};
var utest_UTest = function() { };
$hxClasses["utest.UTest"] = utest_UTest;
utest_UTest.__name__ = "utest.UTest";
utest_UTest.run = function(cases,callback) {
	var runner = new utest_Runner();
	var _g = 0;
	while(_g < cases.length) {
		var eachCase = cases[_g];
		++_g;
		runner.addCase(eachCase);
	}
	if(null != callback) {
		runner.onComplete.add(function(_) {
			callback();
		});
	}
	utest_ui_Report.create(runner);
	runner.run();
};
var utest_ui_Report = function() { };
$hxClasses["utest.ui.Report"] = utest_ui_Report;
utest_ui_Report.__name__ = "utest.ui.Report";
utest_ui_Report.create = function(runner,displaySuccessResults,headerDisplayMode) {
	var report = new utest_ui_text_PrintReport(runner);
	if(null == displaySuccessResults) {
		report.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors;
	} else {
		report.displaySuccessResults = displaySuccessResults;
	}
	if(null == headerDisplayMode) {
		report.displayHeader = utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults;
	} else {
		report.displayHeader = headerDisplayMode;
	}
	return report;
};
var utest_ui_common_ClassResult = function(className,setupName,teardownName) {
	this.fixtures = new haxe_ds_StringMap();
	this.className = className;
	this.setupName = setupName;
	this.hasSetup = setupName != null;
	this.teardownName = teardownName;
	this.hasTeardown = teardownName != null;
	this.methods = 0;
	this.stats = new utest_ui_common_ResultStats();
};
$hxClasses["utest.ui.common.ClassResult"] = utest_ui_common_ClassResult;
utest_ui_common_ClassResult.__name__ = "utest.ui.common.ClassResult";
utest_ui_common_ClassResult.prototype = {
	fixtures: null
	,className: null
	,setupName: null
	,teardownName: null
	,hasSetup: null
	,hasTeardown: null
	,methods: null
	,stats: null
	,add: function(result) {
		if(Object.prototype.hasOwnProperty.call(this.fixtures.h,result.methodName)) {
			throw haxe_Exception.thrown("invalid duplicated fixture: " + this.className + "." + result.methodName);
		}
		this.stats.wire(result.stats);
		this.methods++;
		this.fixtures.h[result.methodName] = result;
	}
	,get: function(method) {
		return this.fixtures.h[method];
	}
	,exists: function(method) {
		return Object.prototype.hasOwnProperty.call(this.fixtures.h,method);
	}
	,methodNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) {
			errorsHavePriority = true;
		}
		var names = [];
		var h = this.fixtures.h;
		var name_h = h;
		var name_keys = Object.keys(h);
		var name_length = name_keys.length;
		var name_current = 0;
		while(name_current < name_length) {
			var name = name_keys[name_current++];
			names.push(name);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var as = me.get(a).stats;
				var bs = me.get(b).stats;
				if(as.hasErrors) {
					if(!bs.hasErrors) {
						return -1;
					} else if(as.errors == bs.errors) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.errors,bs.errors);
					}
				} else if(bs.hasErrors) {
					return 1;
				} else if(as.hasFailures) {
					if(!bs.hasFailures) {
						return -1;
					} else if(as.failures == bs.failures) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.failures,bs.failures);
					}
				} else if(bs.hasFailures) {
					return 1;
				} else if(as.hasWarnings) {
					if(!bs.hasWarnings) {
						return -1;
					} else if(as.warnings == bs.warnings) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.warnings,bs.warnings);
					}
				} else if(bs.hasWarnings) {
					return 1;
				} else {
					return Reflect.compare(a,b);
				}
			});
		} else {
			names.sort(function(a,b) {
				return Reflect.compare(a,b);
			});
		}
		return names;
	}
	,__class__: utest_ui_common_ClassResult
};
var utest_ui_common_FixtureResult = function(methodName) {
	this.methodName = methodName;
	this.list = new haxe_ds_List();
	this.hasTestError = false;
	this.hasSetupError = false;
	this.hasTeardownError = false;
	this.hasTimeoutError = false;
	this.hasAsyncError = false;
	this.stats = new utest_ui_common_ResultStats();
};
$hxClasses["utest.ui.common.FixtureResult"] = utest_ui_common_FixtureResult;
utest_ui_common_FixtureResult.__name__ = "utest.ui.common.FixtureResult";
utest_ui_common_FixtureResult.prototype = {
	methodName: null
	,hasTestError: null
	,hasSetupError: null
	,hasTeardownError: null
	,hasTimeoutError: null
	,hasAsyncError: null
	,stats: null
	,list: null
	,iterator: function() {
		return new haxe_ds__$List_ListIterator(this.list.h);
	}
	,add: function(assertation) {
		this.list.add(assertation);
		switch(assertation._hx_index) {
		case 0:
			var _g = assertation.pos;
			this.stats.addSuccesses(1);
			break;
		case 1:
			var _g = assertation.msg;
			var _g = assertation.pos;
			this.stats.addFailures(1);
			break;
		case 2:
			var _g = assertation.e;
			var _g = assertation.stack;
			this.stats.addErrors(1);
			break;
		case 3:
			var _g = assertation.e;
			var _g = assertation.stack;
			this.stats.addErrors(1);
			this.hasSetupError = true;
			break;
		case 4:
			var _g = assertation.e;
			var _g = assertation.stack;
			this.stats.addErrors(1);
			this.hasTeardownError = true;
			break;
		case 5:
			var _g = assertation.missedAsyncs;
			var _g = assertation.stack;
			this.stats.addErrors(1);
			this.hasTimeoutError = true;
			break;
		case 6:
			var _g = assertation.e;
			var _g = assertation.stack;
			this.stats.addErrors(1);
			this.hasAsyncError = true;
			break;
		case 7:
			var _g = assertation.msg;
			this.stats.addWarnings(1);
			break;
		case 8:
			var _g = assertation.reason;
			this.stats.addIgnores(1);
			break;
		}
	}
	,__class__: utest_ui_common_FixtureResult
};
var utest_ui_common_HeaderDisplayMode = $hxEnums["utest.ui.common.HeaderDisplayMode"] = { __ename__:"utest.ui.common.HeaderDisplayMode",__constructs__:null
	,AlwaysShowHeader: {_hx_name:"AlwaysShowHeader",_hx_index:0,__enum__:"utest.ui.common.HeaderDisplayMode",toString:$estr}
	,NeverShowHeader: {_hx_name:"NeverShowHeader",_hx_index:1,__enum__:"utest.ui.common.HeaderDisplayMode",toString:$estr}
	,ShowHeaderWithResults: {_hx_name:"ShowHeaderWithResults",_hx_index:2,__enum__:"utest.ui.common.HeaderDisplayMode",toString:$estr}
};
utest_ui_common_HeaderDisplayMode.__constructs__ = [utest_ui_common_HeaderDisplayMode.AlwaysShowHeader,utest_ui_common_HeaderDisplayMode.NeverShowHeader,utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults];
var utest_ui_common_SuccessResultsDisplayMode = $hxEnums["utest.ui.common.SuccessResultsDisplayMode"] = { __ename__:"utest.ui.common.SuccessResultsDisplayMode",__constructs__:null
	,AlwaysShowSuccessResults: {_hx_name:"AlwaysShowSuccessResults",_hx_index:0,__enum__:"utest.ui.common.SuccessResultsDisplayMode",toString:$estr}
	,NeverShowSuccessResults: {_hx_name:"NeverShowSuccessResults",_hx_index:1,__enum__:"utest.ui.common.SuccessResultsDisplayMode",toString:$estr}
	,ShowSuccessResultsWithNoErrors: {_hx_name:"ShowSuccessResultsWithNoErrors",_hx_index:2,__enum__:"utest.ui.common.SuccessResultsDisplayMode",toString:$estr}
};
utest_ui_common_SuccessResultsDisplayMode.__constructs__ = [utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults,utest_ui_common_SuccessResultsDisplayMode.NeverShowSuccessResults,utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors];
var utest_ui_common_PackageResult = function(packageName) {
	this.isEmpty = true;
	this.packageName = packageName;
	this.classes = new haxe_ds_StringMap();
	this.packages = new haxe_ds_StringMap();
	this.stats = new utest_ui_common_ResultStats();
};
$hxClasses["utest.ui.common.PackageResult"] = utest_ui_common_PackageResult;
utest_ui_common_PackageResult.__name__ = "utest.ui.common.PackageResult";
utest_ui_common_PackageResult.prototype = {
	packageName: null
	,isEmpty: null
	,classes: null
	,packages: null
	,stats: null
	,addResult: function(result,flattenPackage) {
		this.isEmpty = false;
		var pack = this.getOrCreatePackage(result.pack,flattenPackage,this);
		var cls = this.getOrCreateClass(pack,result.cls,result.setup,result.teardown);
		var fix = this.createFixture(result.method,result.assertations);
		cls.add(fix);
	}
	,addClass: function(result) {
		this.isEmpty = false;
		this.classes.h[result.className] = result;
		this.stats.wire(result.stats);
	}
	,addPackage: function(result) {
		this.isEmpty = false;
		this.packages.h[result.packageName] = result;
		this.stats.wire(result.stats);
	}
	,existsPackage: function(name) {
		return Object.prototype.hasOwnProperty.call(this.packages.h,name);
	}
	,existsClass: function(name) {
		return Object.prototype.hasOwnProperty.call(this.classes.h,name);
	}
	,getPackage: function(name) {
		if(this.packageName == null && name == "") {
			return this;
		}
		return this.packages.h[name];
	}
	,getClass: function(name) {
		return this.classes.h[name];
	}
	,classNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) {
			errorsHavePriority = true;
		}
		var names = [];
		var h = this.classes.h;
		var name_h = h;
		var name_keys = Object.keys(h);
		var name_length = name_keys.length;
		var name_current = 0;
		while(name_current < name_length) {
			var name = name_keys[name_current++];
			names.push(name);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var as = me.getClass(a).stats;
				var bs = me.getClass(b).stats;
				if(as.hasErrors) {
					if(!bs.hasErrors) {
						return -1;
					} else if(as.errors == bs.errors) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.errors,bs.errors);
					}
				} else if(bs.hasErrors) {
					return 1;
				} else if(as.hasFailures) {
					if(!bs.hasFailures) {
						return -1;
					} else if(as.failures == bs.failures) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.failures,bs.failures);
					}
				} else if(bs.hasFailures) {
					return 1;
				} else if(as.hasWarnings) {
					if(!bs.hasWarnings) {
						return -1;
					} else if(as.warnings == bs.warnings) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.warnings,bs.warnings);
					}
				} else if(bs.hasWarnings) {
					return 1;
				} else {
					return Reflect.compare(a,b);
				}
			});
		} else {
			names.sort(function(a,b) {
				return Reflect.compare(a,b);
			});
		}
		return names;
	}
	,packageNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) {
			errorsHavePriority = true;
		}
		var names = [];
		if(this.packageName == null) {
			names.push("");
		}
		var h = this.packages.h;
		var name_h = h;
		var name_keys = Object.keys(h);
		var name_length = name_keys.length;
		var name_current = 0;
		while(name_current < name_length) {
			var name = name_keys[name_current++];
			names.push(name);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var as = me.getPackage(a).stats;
				var bs = me.getPackage(b).stats;
				if(as.hasErrors) {
					if(!bs.hasErrors) {
						return -1;
					} else if(as.errors == bs.errors) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.errors,bs.errors);
					}
				} else if(bs.hasErrors) {
					return 1;
				} else if(as.hasFailures) {
					if(!bs.hasFailures) {
						return -1;
					} else if(as.failures == bs.failures) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.failures,bs.failures);
					}
				} else if(bs.hasFailures) {
					return 1;
				} else if(as.hasWarnings) {
					if(!bs.hasWarnings) {
						return -1;
					} else if(as.warnings == bs.warnings) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare(as.warnings,bs.warnings);
					}
				} else if(bs.hasWarnings) {
					return 1;
				} else {
					return Reflect.compare(a,b);
				}
			});
		} else {
			names.sort(function(a,b) {
				return Reflect.compare(a,b);
			});
		}
		return names;
	}
	,createFixture: function(method,assertations) {
		var f = new utest_ui_common_FixtureResult(method);
		var assertation = $getIterator(assertations);
		while(assertation.hasNext()) {
			var assertation1 = assertation.next();
			f.add(assertation1);
		}
		return f;
	}
	,getOrCreateClass: function(pack,cls,setup,teardown) {
		if(pack.existsClass(cls)) {
			return pack.getClass(cls);
		}
		var c = new utest_ui_common_ClassResult(cls,setup,teardown);
		pack.addClass(c);
		return c;
	}
	,getOrCreatePackage: function(pack,flat,ref) {
		if(pack == null || pack == "") {
			return ref;
		}
		if(flat) {
			if(ref.existsPackage(pack)) {
				return ref.getPackage(pack);
			}
			var p = new utest_ui_common_PackageResult(pack);
			ref.addPackage(p);
			return p;
		} else {
			var parts = pack.split(".");
			var _g = 0;
			while(_g < parts.length) {
				var part = parts[_g];
				++_g;
				ref = this.getOrCreatePackage(part,true,ref);
			}
			return ref;
		}
	}
	,__class__: utest_ui_common_PackageResult
};
var utest_ui_common_ReportTools = function() { };
$hxClasses["utest.ui.common.ReportTools"] = utest_ui_common_ReportTools;
utest_ui_common_ReportTools.__name__ = "utest.ui.common.ReportTools";
utest_ui_common_ReportTools.hasHeader = function(report,stats) {
	switch(report.displayHeader._hx_index) {
	case 0:
		return true;
	case 1:
		return false;
	case 2:
		if(!stats.isOk) {
			return true;
		}
		switch(report.displaySuccessResults._hx_index) {
		case 0:case 2:
			return true;
		case 1:
			return false;
		}
		break;
	}
};
utest_ui_common_ReportTools.skipResult = function(report,stats,isOk) {
	if(!stats.isOk) {
		return false;
	}
	switch(report.displaySuccessResults._hx_index) {
	case 0:
		return false;
	case 1:
		return true;
	case 2:
		return !isOk;
	}
};
utest_ui_common_ReportTools.hasOutput = function(report,stats) {
	if(!stats.isOk) {
		return true;
	}
	return utest_ui_common_ReportTools.hasHeader(report,stats);
};
var utest_ui_common_ResultAggregator = function(runner,flattenPackage) {
	if(flattenPackage == null) {
		flattenPackage = false;
	}
	if(runner == null) {
		throw haxe_Exception.thrown("runner argument is null");
	}
	this.flattenPackage = flattenPackage;
	this.runner = runner;
	runner.onStart.add($bind(this,this.start));
	runner.onProgress.add($bind(this,this.progress));
	runner.onComplete.add($bind(this,this.complete));
	this.onStart = new utest_Notifier();
	this.onComplete = new utest_Dispatcher();
	this.onProgress = new utest_Dispatcher();
};
$hxClasses["utest.ui.common.ResultAggregator"] = utest_ui_common_ResultAggregator;
utest_ui_common_ResultAggregator.__name__ = "utest.ui.common.ResultAggregator";
utest_ui_common_ResultAggregator.prototype = {
	runner: null
	,flattenPackage: null
	,root: null
	,onStart: null
	,onComplete: null
	,onProgress: null
	,start: function(runner) {
		this.checkNonITest();
		this.root = new utest_ui_common_PackageResult(null);
		this.onStart.dispatch();
	}
	,checkNonITest: function() {
		var first = null;
		var total = 0;
		var _g = 0;
		var _g1 = this.runner.length;
		while(_g < _g1) {
			var i = _g++;
			var fixture = this.runner.getFixture(i);
			if(!fixture.isITest) {
				++total;
				if(first == null) {
					var c = js_Boot.getClass(fixture.target);
					first = c.__name__;
				}
			}
		}
		if(total > 0) {
			var baseMsg = "implement utest.ITest. Non-ITest tests are deprecated. Implement utest.ITest or extend utest.Test.";
			var msg;
			switch(total) {
			case 1:
				msg = "" + first + " doesn't " + baseMsg;
				break;
			case 2:
				msg = "" + first + " and 1 other don't " + baseMsg;
				break;
			default:
				msg = "" + first + " and " + total + " others don't " + baseMsg;
			}
			haxe_Log.trace(msg,{ fileName : "utest/ui/common/ResultAggregator.hx", lineNumber : 54, className : "utest.ui.common.ResultAggregator", methodName : "checkNonITest"});
		}
	}
	,getOrCreatePackage: function(pack,flat,ref) {
		if(ref == null) {
			ref = this.root;
		}
		if(pack == null || pack == "") {
			return ref;
		}
		if(flat) {
			if(ref.existsPackage(pack)) {
				return ref.getPackage(pack);
			}
			var p = new utest_ui_common_PackageResult(pack);
			ref.addPackage(p);
			return p;
		} else {
			var parts = pack.split(".");
			var _g = 0;
			while(_g < parts.length) {
				var part = parts[_g];
				++_g;
				ref = this.getOrCreatePackage(part,true,ref);
			}
			return ref;
		}
	}
	,getOrCreateClass: function(pack,cls,setup,teardown) {
		if(pack.existsClass(cls)) {
			return pack.getClass(cls);
		}
		var c = new utest_ui_common_ClassResult(cls,setup,teardown);
		pack.addClass(c);
		return c;
	}
	,createFixture: function(result) {
		var f = new utest_ui_common_FixtureResult(result.method);
		var _g_head = result.assertations.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var assertation = val;
			f.add(assertation);
		}
		return f;
	}
	,progress: function(e) {
		this.root.addResult(e.result,this.flattenPackage);
		this.onProgress.dispatch(e);
	}
	,complete: function(runner) {
		if(this.root.isEmpty) {
			this.root.addResult(this.createNoTestsResult(),false);
		}
		this.onComplete.dispatch(this.root);
	}
	,createNoTestsResult: function() {
		var result = new utest_TestResult();
		result.pack = "";
		result.cls = "";
		result.method = "";
		result.assertations = new haxe_ds_List();
		var pos = { fileName : "", lineNumber : 1, className : "utest.Runner", methodName : "run"};
		result.assertations.add(utest_Assertation.Failure("No tests executed.",pos));
		return result;
	}
	,__class__: utest_ui_common_ResultAggregator
};
var utest_ui_common_ResultStats = function() {
	this.assertations = 0;
	this.successes = 0;
	this.failures = 0;
	this.errors = 0;
	this.warnings = 0;
	this.ignores = 0;
	this.isOk = true;
	this.hasFailures = false;
	this.hasErrors = false;
	this.hasWarnings = false;
	this.hasIgnores = false;
	this.onAddSuccesses = new utest_Dispatcher();
	this.onAddFailures = new utest_Dispatcher();
	this.onAddErrors = new utest_Dispatcher();
	this.onAddWarnings = new utest_Dispatcher();
	this.onAddIgnores = new utest_Dispatcher();
};
$hxClasses["utest.ui.common.ResultStats"] = utest_ui_common_ResultStats;
utest_ui_common_ResultStats.__name__ = "utest.ui.common.ResultStats";
utest_ui_common_ResultStats.prototype = {
	assertations: null
	,successes: null
	,failures: null
	,errors: null
	,warnings: null
	,ignores: null
	,onAddSuccesses: null
	,onAddFailures: null
	,onAddErrors: null
	,onAddWarnings: null
	,onAddIgnores: null
	,isOk: null
	,hasFailures: null
	,hasErrors: null
	,hasWarnings: null
	,hasIgnores: null
	,addSuccesses: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.successes += v;
		this.onAddSuccesses.dispatch(v);
	}
	,addFailures: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.failures += v;
		this.hasFailures = this.failures > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddFailures.dispatch(v);
	}
	,addErrors: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.errors += v;
		this.hasErrors = this.errors > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddErrors.dispatch(v);
	}
	,addIgnores: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.ignores += v;
		this.hasIgnores = this.ignores > 0;
		this.onAddIgnores.dispatch(v);
	}
	,addWarnings: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.warnings += v;
		this.hasWarnings = this.warnings > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddWarnings.dispatch(v);
	}
	,sum: function(other) {
		this.addSuccesses(other.successes);
		this.addFailures(other.failures);
		this.addErrors(other.errors);
		this.addWarnings(other.warnings);
		this.addIgnores(other.ignores);
	}
	,subtract: function(other) {
		this.addSuccesses(-other.successes);
		this.addFailures(-other.failures);
		this.addErrors(-other.errors);
		this.addWarnings(-other.warnings);
		this.addIgnores(-other.ignores);
	}
	,wire: function(dependant) {
		dependant.onAddSuccesses.add($bind(this,this.addSuccesses));
		dependant.onAddFailures.add($bind(this,this.addFailures));
		dependant.onAddErrors.add($bind(this,this.addErrors));
		dependant.onAddWarnings.add($bind(this,this.addWarnings));
		dependant.onAddIgnores.add($bind(this,this.addIgnores));
		this.sum(dependant);
	}
	,unwire: function(dependant) {
		dependant.onAddSuccesses.remove($bind(this,this.addSuccesses));
		dependant.onAddFailures.remove($bind(this,this.addFailures));
		dependant.onAddErrors.remove($bind(this,this.addErrors));
		dependant.onAddWarnings.remove($bind(this,this.addWarnings));
		dependant.onAddIgnores.remove($bind(this,this.addIgnores));
		this.subtract(dependant);
	}
	,__class__: utest_ui_common_ResultStats
};
var utest_ui_text_PlainTextReport = function(runner,outputHandler) {
	this.aggregator = new utest_ui_common_ResultAggregator(runner,true);
	runner.onStart.add($bind(this,this.start));
	this.aggregator.onComplete.add($bind(this,this.complete));
	if(null != outputHandler) {
		this.setHandler(outputHandler);
	}
	this.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults;
	this.displayHeader = utest_ui_common_HeaderDisplayMode.AlwaysShowHeader;
};
$hxClasses["utest.ui.text.PlainTextReport"] = utest_ui_text_PlainTextReport;
utest_ui_text_PlainTextReport.__name__ = "utest.ui.text.PlainTextReport";
utest_ui_text_PlainTextReport.__interfaces__ = [utest_ui_common_IReport];
utest_ui_text_PlainTextReport.prototype = {
	displaySuccessResults: null
	,displayHeader: null
	,handler: null
	,aggregator: null
	,newline: null
	,indent: null
	,setHandler: function(handler) {
		this.handler = handler;
	}
	,startTime: null
	,start: function(e) {
		this.startTime = this.getTime();
	}
	,getTime: function() {
		var hrtime = process.hrtime();
		return hrtime[0] + hrtime[1] / 1e9;
	}
	,indents: function(c) {
		var s = "";
		while(--c >= 0) s += this.indent;
		return s;
	}
	,dumpStack: function(stack) {
		if(stack.length == 0) {
			return "";
		}
		var parts = haxe_CallStack.toString(stack).split("\n");
		var r = [];
		var _g = 0;
		while(_g < parts.length) {
			var part = parts[_g];
			++_g;
			if(part.indexOf(" utest.") >= 0) {
				continue;
			}
			r.push(part);
		}
		return r.join(this.newline);
	}
	,addHeader: function(buf,result) {
		if(!utest_ui_common_ReportTools.hasHeader(this,result.stats)) {
			return;
		}
		var end = this.getTime();
		var time = ((end - this.startTime) * 1000 | 0) / 1000;
		buf.b += Std.string("\nassertations: " + result.stats.assertations + this.newline);
		buf.b += Std.string("successes: " + result.stats.successes + this.newline);
		buf.b += Std.string("errors: " + result.stats.errors + this.newline);
		buf.b += Std.string("failures: " + result.stats.failures + this.newline);
		buf.b += Std.string("warnings: " + result.stats.warnings + this.newline);
		buf.b += Std.string("execution time: " + time + this.newline);
		buf.b += Std.string(this.newline);
		buf.b += Std.string("results: " + (result.stats.isOk ? "ALL TESTS OK (success: true)" : "SOME TESTS FAILURES (success: false)"));
		buf.b += Std.string(this.newline);
	}
	,result: null
	,getResults: function() {
		var buf = new StringBuf();
		this.addHeader(buf,this.result);
		var _g = 0;
		var _g1 = this.result.packageNames();
		while(_g < _g1.length) {
			var pname = _g1[_g];
			++_g;
			var pack = this.result.getPackage(pname);
			if(utest_ui_common_ReportTools.skipResult(this,pack.stats,this.result.stats.isOk)) {
				continue;
			}
			var _g2 = 0;
			var _g3 = pack.classNames();
			while(_g2 < _g3.length) {
				var cname = _g3[_g2];
				++_g2;
				var cls = pack.getClass(cname);
				if(utest_ui_common_ReportTools.skipResult(this,cls.stats,this.result.stats.isOk)) {
					continue;
				}
				buf.b += Std.string((pname == "" ? "" : pname + ".") + cname + this.newline);
				var _g4 = 0;
				var _g5 = cls.methodNames();
				while(_g4 < _g5.length) {
					var mname = _g5[_g4];
					++_g4;
					var fix = cls.get(mname);
					if(utest_ui_common_ReportTools.skipResult(this,fix.stats,this.result.stats.isOk)) {
						continue;
					}
					var x = this.indents(1) + mname + ": ";
					buf.b += Std.string(x);
					if(fix.stats.isOk) {
						buf.b += "OK ";
					} else if(fix.stats.hasErrors) {
						buf.b += "ERROR ";
					} else if(fix.stats.hasFailures) {
						buf.b += "FAILURE ";
					} else if(fix.stats.hasWarnings) {
						buf.b += "WARNING ";
					}
					var messages = "";
					var _g6 = fix.iterator();
					while(_g6.head != null) {
						var val = _g6.head.item;
						_g6.head = _g6.head.next;
						var assertation = val;
						switch(assertation._hx_index) {
						case 0:
							var _g7 = assertation.pos;
							buf.b += ".";
							break;
						case 1:
							var msg = assertation.msg;
							var pos = assertation.pos;
							buf.b += "F";
							messages += this.indents(2) + "line: " + pos.lineNumber + ", " + msg + this.newline;
							break;
						case 2:
							var e = assertation.e;
							var s = assertation.stack;
							buf.b += "E";
							messages += this.indents(2) + Std.string(e) + this.dumpStack(s) + this.newline;
							break;
						case 3:
							var e1 = assertation.e;
							var s1 = assertation.stack;
							buf.b += "S";
							messages += this.indents(2) + Std.string(e1) + this.dumpStack(s1) + this.newline;
							break;
						case 4:
							var e2 = assertation.e;
							var s2 = assertation.stack;
							buf.b += "T";
							messages += this.indents(2) + Std.string(e2) + this.dumpStack(s2) + this.newline;
							break;
						case 5:
							var missedAsyncs = assertation.missedAsyncs;
							var s3 = assertation.stack;
							buf.b += "O";
							messages += this.indents(2) + "missed async calls: " + missedAsyncs + this.dumpStack(s3) + this.newline;
							break;
						case 6:
							var e3 = assertation.e;
							var s4 = assertation.stack;
							buf.b += "A";
							messages += this.indents(2) + Std.string(e3) + this.dumpStack(s4) + this.newline;
							break;
						case 7:
							var msg1 = assertation.msg;
							buf.b += "W";
							messages += this.indents(2) + msg1 + this.newline;
							break;
						case 8:
							var reason = assertation.reason;
							buf.b += "I";
							if(reason != null && reason != "") {
								messages += this.indents(2) + ("With reason: " + reason) + this.newline;
							}
							break;
						}
					}
					buf.b += Std.string(this.newline);
					buf.b += messages == null ? "null" : "" + messages;
				}
			}
		}
		return buf.b;
	}
	,complete: function(result) {
		this.result = result;
		if(this.handler != null) {
			this.handler(this);
		}
		if(typeof phantom != "undefined") {
			var tmp = result.stats.isOk ? 0 : 1;
			phantom.exit(tmp);
		}
		if(typeof process != "undefined") {
			var tmp = result.stats.isOk ? 0 : 1;
			process.exit(tmp);
		}
	}
	,__class__: utest_ui_text_PlainTextReport
};
var utest_ui_text_PrintReport = function(runner) {
	utest_ui_text_PlainTextReport.call(this,runner,$bind(this,this._handler));
	this.newline = "\n";
	this.indent = "  ";
};
$hxClasses["utest.ui.text.PrintReport"] = utest_ui_text_PrintReport;
utest_ui_text_PrintReport.__name__ = "utest.ui.text.PrintReport";
utest_ui_text_PrintReport.__super__ = utest_ui_text_PlainTextReport;
utest_ui_text_PrintReport.prototype = $extend(utest_ui_text_PlainTextReport.prototype,{
	_handler: function(report) {
		this._trace(report.getResults());
	}
	,_trace: function(s) {
		s = StringTools.replace(s,"  ",this.indent);
		s = StringTools.replace(s,"\n",this.newline);
		haxe_Log.trace(s,{ fileName : "utest/ui/text/PrintReport.hx", lineNumber : 52, className : "utest.ui.text.PrintReport", methodName : "_trace"});
	}
	,__class__: utest_ui_text_PrintReport
});
var utest_utils_AccessoriesUtils = function() { };
$hxClasses["utest.utils.AccessoriesUtils"] = utest_utils_AccessoriesUtils;
utest_utils_AccessoriesUtils.__name__ = "utest.utils.AccessoriesUtils";
utest_utils_AccessoriesUtils.getSetupClass = function(accessories) {
	if(accessories.setupClass == null) {
		return utest_Async.getResolved;
	} else {
		return accessories.setupClass;
	}
};
utest_utils_AccessoriesUtils.getSetup = function(accessories) {
	if(accessories.setup == null) {
		return utest_Async.getResolved;
	} else {
		return accessories.setup;
	}
};
utest_utils_AccessoriesUtils.getTeardown = function(accessories) {
	if(accessories.teardown == null) {
		return utest_Async.getResolved;
	} else {
		return accessories.teardown;
	}
};
utest_utils_AccessoriesUtils.getTeardownClass = function(accessories) {
	if(accessories.teardownClass == null) {
		return utest_Async.getResolved;
	} else {
		return accessories.teardownClass;
	}
};
var utest_utils_AsyncUtils = function() { };
$hxClasses["utest.utils.AsyncUtils"] = utest_utils_AsyncUtils;
utest_utils_AsyncUtils.__name__ = "utest.utils.AsyncUtils";
utest_utils_AsyncUtils.orResolved = function(_async) {
	if(_async == null) {
		return utest_Async.getResolved();
	} else {
		return _async;
	}
};
var utest_utils_Misc = function() { };
$hxClasses["utest.utils.Misc"] = utest_utils_Misc;
utest_utils_Misc.__name__ = "utest.utils.Misc";
utest_utils_Misc.isOfType = function(v,t) {
	return js_Boot.__instanceof(v,t);
};
var utest_utils_Print = function() { };
$hxClasses["utest.utils.Print"] = utest_utils_Print;
utest_utils_Print.__name__ = "utest.utils.Print";
utest_utils_Print.immediately = function(msg) {
	console.log(msg);
};
utest_utils_Print.startCase = function(caseName) {
};
utest_utils_Print.startTest = function(name) {
};
var utils_InjectedService = function() {
};
$hxClasses["utils.InjectedService"] = utils_InjectedService;
utils_InjectedService.__name__ = "utils.InjectedService";
utils_InjectedService.__interfaces__ = [hx_injection_Service];
utils_InjectedService.prototype = {
	getConstructorArgs: function() {
		return [];
	}
	,__class__: utils_InjectedService
};
var utils_TestSuperService = function(service) {
	this._value = 5;
	this._service = service;
};
$hxClasses["utils.TestSuperService"] = utils_TestSuperService;
utils_TestSuperService.__name__ = "utils.TestSuperService";
utils_TestSuperService.__interfaces__ = [hx_injection_Service];
utils_TestSuperService.prototype = {
	_value: null
	,injected: function() {
		return this._service;
	}
	,value: function() {
		return this._value;
	}
	,_service: null
	,getConstructorArgs: function() {
		return ["utils.InjectedService"];
	}
	,__class__: utils_TestSuperService
};
var utils_TestService = function(service) {
	utils_TestSuperService.call(this,service);
};
$hxClasses["utils.TestService"] = utils_TestService;
utils_TestService.__name__ = "utils.TestService";
utils_TestService.__super__ = utils_TestSuperService;
utils_TestService.prototype = $extend(utils_TestSuperService.prototype,{
	getConstructorArgs: function() {
		return ["utils.InjectedService"];
	}
	,__class__: utils_TestService
});
var utils_UtilsTest = function() {
	utest_Test.call(this);
};
$hxClasses["utils.UtilsTest"] = utils_UtilsTest;
utils_UtilsTest.__name__ = "utils.UtilsTest";
utils_UtilsTest.__super__ = utest_Test;
utils_UtilsTest.prototype = $extend(utest_Test.prototype,{
	testUtils: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,utils_TestSuperService.__name__,utils_TestService);
		var implementation = utils_InjectedService;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = utils_TestSuperService;
		var test = provider.handleGetService(service.__name__,service,null);
		var service = utils_InjectedService;
		var injected = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(injected,test.injected(),null,{ fileName : "src/utils/UtilsTest.hx", lineNumber : 19, className : "utils.UtilsTest", methodName : "testUtils"});
	}
	,testValue: function() {
		var collection = new hx_injection_ServiceCollection();
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,utils_TestSuperService.__name__,utils_TestService);
		var implementation = utils_InjectedService;
		collection.handleServiceAdd(hx_injection_ServiceType.Singleton,implementation.__name__,implementation);
		var provider = collection.createProvider();
		var service = utils_TestSuperService;
		var test = provider.handleGetService(service.__name__,service,null);
		utest_Assert.equals(5,test.value(),null,{ fileName : "src/utils/UtilsTest.hx", lineNumber : 29, className : "utils.UtilsTest", methodName : "testValue"});
	}
	,__initializeUtest__: function() {
		var _gthis = this;
		var init = utest_Test.prototype.__initializeUtest__.call(this);
		init.tests.push({ name : "testValue", dependencies : [], execute : function() {
			_gthis.testValue();
			return utest_Async.getResolved();
		}});
		init.tests.push({ name : "testUtils", dependencies : [], execute : function() {
			_gthis.testUtils();
			return utest_Async.getResolved();
		}});
		return init;
	}
	,__class__: utils_UtilsTest
});
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
$hxClasses["Math"] = Math;
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.prototype.__class__ = $hxClasses["String"] = String;
String.__name__ = "String";
$hxClasses["Array"] = Array;
Array.__name__ = "Array";
Date.prototype.__class__ = $hxClasses["Date"] = Date;
Date.__name__ = "Date";
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
_$testadapter_data_Data.FOLDER = ".unittest";
hx_injection_ServiceProvider.DefaultType = "";
utest_TestHandler.POLLING_TIME = 10;
utest_AccessoryName.SETUP_NAME = "setup";
utest_AccessoryName.SETUP_CLASS_NAME = "setupClass";
utest_AccessoryName.TEARDOWN_NAME = "teardown";
utest_AccessoryName.TEARDOWN_CLASS_NAME = "teardownClass";
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
