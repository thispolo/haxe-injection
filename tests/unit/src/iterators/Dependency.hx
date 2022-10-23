package iterators;

import hx.injection.Service;

interface Dependency extends Service {
    public function getNumber() : Int;
}