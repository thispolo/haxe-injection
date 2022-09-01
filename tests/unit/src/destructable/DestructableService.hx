package destructable;

import hx.injection.Service;

interface DestructableService extends Service {
    public function getMeme() : Meme;
}