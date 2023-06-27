import haxe.format.JsonParser;
import generics.GenericTest;
import config.ConfigTest;

final class Main {
	public static function main() {
		var configtest = new ConfigTest();
		configtest.runJson();
		configtest.runEnv();
		configtest.runEnvAndJson();

		var generics = new GenericTest();
		generics.run();
	}
}
