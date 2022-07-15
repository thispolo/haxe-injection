package example.destructable;

import hx.injection.Destructable;

final class ADestructableService implements DestructableService implements Destructable {

    public function new() {
        
    }

	public function createMeme() {
        trace('F');
    }

	public function destroy() {
        trace('I was destroyed.');
    }

}