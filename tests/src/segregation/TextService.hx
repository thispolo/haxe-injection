package example.segregation;

import hx.injection.Service;

interface TextService extends Service {
    public function getText() : String;
    public function id() : Int;
}