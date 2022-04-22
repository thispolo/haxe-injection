package example;

import hx.injection.Service;

final class LoggingService implements Service {
    public function new() { }
    public function log(msg : String) : Void {
        trace(msg);
    }
}