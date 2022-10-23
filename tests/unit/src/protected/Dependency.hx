package protected;

import hx.injection.Service;

interface Dependency extends Service {
    public function id() : Int;
}