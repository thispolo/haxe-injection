package example;

class LouderTestService extends LoudTestService {

    private var _another : AnotherService;

    public function new(config : TestConfig, logging : LoggingService, test : AnotherService) {
        super(config, logging);
        _another = test;
    }

    override public function sayWord() : Void {
        _logging.log(_another.getString().toUpperCase() + '!!!');
    }
    
}