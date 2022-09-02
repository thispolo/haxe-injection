package config;

import hx.injection.config.ConfigurationBuilder;

final class ConfigTest {
    public function new() { }

    public function runJson() {
        var builder = ConfigurationBuilder.create('configs');
        builder.addJson('test.json');
        var config = builder.build();

        trace(config.getString('outer.inner.value') == 'My first string.');
    }

    public function runEnv() {
        var builder = ConfigurationBuilder.create('configs');
        builder.addEnvVar('haxepath');
        var config = builder.build();

        trace(config.getString('haxepath'));
    }

    public function runEnvAndJson() {
        var builder = ConfigurationBuilder.create('configs');
        builder.addJson('test.json');
        builder.addEnvVar('haxepath');
        var config = builder.build();
    }
}