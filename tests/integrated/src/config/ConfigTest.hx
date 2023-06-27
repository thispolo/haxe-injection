package config;

import hx.injection.config.ConfigurationBuilder;

final class ConfigTest {
	public function new() {}

	public function runJson() {
		var builder = ConfigurationBuilder.create('configs');
		var config:MyConfig = builder.resolveJson('test.json');
		trace(config.outer.inner.value == 'My first string.');
	}

	public function runEnv() {
		var builder = ConfigurationBuilder.create('configs');
		var env = builder.resolveEnvVar('haxepath');
	}

	public function runEnvAndJson() {
		// var builder = ConfigurationBuilder.create('configs');
		// builder.addJson('test.json');
		// builder.addEnvVar('haxepath');
		// try {
		// 	var config = builder.build();
		// 	trace(config.getString('haxepath'));
		// } catch (e:haxe.Exception) {
		// 	trace('Failed!');
		// }
	}
}
