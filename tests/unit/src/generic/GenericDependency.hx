package generic;

import hx.injection.Service;

interface GenericDependency<T> extends Service {
    public function getObject() : T;
}