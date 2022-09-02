package injection;

import hx.injection.Service;

final class WordService extends BaseWordService implements Service {
    
    private var _test : TestService;

    public function new(test : TestService) {
        super();
        _test = test;
    }
    
    public function say(msg : String) : String {
        return _test.transform(msg);
    }
}