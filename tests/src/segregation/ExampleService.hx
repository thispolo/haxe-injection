package example.segregation;

final class ExampleService implements NumberService implements TextService {

    private var _id : Int;

    public function new() {
        _id = Math.floor(Math.random()*65745);
    }

	public function getNumber():Int {
		return 0;
	}

	public function getText():String {
		return 'Hello world!';
	}

	public function id():Int {
		return _id;
	}
}