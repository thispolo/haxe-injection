package example.segregation;

import hx.injection.Service;

final class RecieverService implements Service {

    private var _number : NumberService;
    private var _text : TextService;

    public function new(number : NumberService, text : TextService) {
        _number = number;
        _text = text;
    }

    public function print() {
        trace(_number.id(), _text.id());
    }
}