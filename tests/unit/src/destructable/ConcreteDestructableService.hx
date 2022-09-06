package destructable;

import hx.injection.Destructable;

final class ConcreteDestructableService implements DestructableService implements Destructable {

    private var _meme : Meme;

    public function new() {
        _meme = new Meme();
    }

	public function getMeme() : Meme {
        return _meme;
    }

	public function destroy() {
        _meme = null;
    }

}