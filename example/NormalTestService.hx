package example;

class NormalTestService implements TestService {

    private var _config : TestConfig;
    private var _logging : LoggingService;

    public function new(config : TestConfig, logging : LoggingService) {
        _config = config;
        _logging = logging;
    }

    public function sayWord() : Void {
        _logging.log(_config.word);
    }

}