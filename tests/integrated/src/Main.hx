import config.ConfigTest;

final class Main {
    public static function main() {
        var configtest = new ConfigTest();
        configtest.runJson();
        configtest.runEnv();
        configtest.runEnvAndJson();
    }
}