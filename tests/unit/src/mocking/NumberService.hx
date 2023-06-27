package mocking;

import hx.injection.Service;

interface NumberService extends Service {
    public function id(arg : Int) : Int;
    public function other() : Float;
}