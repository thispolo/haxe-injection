package example.destructable;

import hx.injection.Service;

interface DestructableService extends Service {
    public function createMeme() : Void;
}