package segregation;

import hx.injection.Service;

interface NumberService extends Service {
    public function getNumber() : Int;
    public function id() : Int;
}