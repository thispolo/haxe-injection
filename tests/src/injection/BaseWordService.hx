package injection;

import hx.injection.Service;

abstract class BaseWordService implements Service {
    public function new() { }
    abstract public function say(word : String) : String;
}