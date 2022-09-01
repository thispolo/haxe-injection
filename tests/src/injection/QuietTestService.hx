package injection;

final class QuietTestService implements TestService {

    public function new() { }

    public function transform(word : String) : String {
        return (word.toLowerCase());
    }

}