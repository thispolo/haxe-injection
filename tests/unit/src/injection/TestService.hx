package injection;

import hx.injection.Service;

interface TestService extends Service {
    public function transform(word : String) : String;
}