package example;

import hx.injection.Service;

final class LoggingService extends SuperClass implements Service {
    
    public function new() {
        super();
    }
    
    public function log(msg : String) : Void {
        trace(msg);
    }
}