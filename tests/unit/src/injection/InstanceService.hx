package injection;

final class InstanceService extends BaseWordService {

    private var _word : String;

    public function new(word : String) {
        super();
        _word = word;
    }

    public function say(word : String) : String {
        return '$_word$word';
    }
}