package hx.injection;

@:keepSub
@:autoBuild(hx.injection.macros.ServiceMacro.build())
interface Service {
	@:allow(hx.injection.ServiceProvider)
	private function getConstructorArgs():Array<String>;
}
