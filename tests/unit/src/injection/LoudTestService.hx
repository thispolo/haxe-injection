package injection;

final class LoudTestService implements TestService {

    public function new() { }

    public function transform(word : String) : String {
        return word.toUpperCase();
    }
    
}