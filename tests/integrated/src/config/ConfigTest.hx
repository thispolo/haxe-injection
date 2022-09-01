package config;

import hx.injection.config.ConfigurationBuilder;

final class ConfigTest {
    public function new() { }

    public function run() {
        var builder = ConfigurationBuilder.create('configs');
        builder.addJson('test.json');
        var config = builder.build();

        trace(config.getString('outer.inner.value') == 'A test string.');
    }
}