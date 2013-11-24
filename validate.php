<?php
class ValidatorException extends Exception {}

class ValidatorTestWrapper {
    //tests are of the format
    //    array('name:value' => 'message');
    //(value is optional in some cases)
    private $test;
    function __construct($test) {
        $this->test = $test;
    }

    function message() {
        return array_values($this->test)[0];
    }

    //'name:value'
    function description() {
        return array_keys($this->test)[0];
    }

    function name() {
        return explode(':', $this->description())[0];
    }

    function value() {
        $pieces = explode(':', $this->description());
        return count($pieces) > 1 ? $pieces[1] : null;
    }
}

class Validator {
    private $schema;
    function __construct($schema) {
        if(is_array($schema)) {
            $this->schema = $this->wrapSchema($schema);
        }
        else {
            $this->schema = $this->wrapSchema(json_decode(file_get_contents($schema), true));
        }
    }

    private function wrapSchema($schema) {
        $wrapped = array();
        foreach($schema as $fieldName => $tests) {
            $wrapped[$fieldName] = array();
            foreach($tests as $test) {
                $wrapped[$fieldName][] = new ValidatorTestWrapper($test);
            }
        }
        return $wrapped;
    }

    private function fetch($key, array $array) {
        return array_key_exists($key, $array) ? $array[$key] : null;
    }

    private function isTestPass($valueToTest, $testObject) {
        return $this->{$testObject->name()}($valueToTest, $testObject->value());
    }

    // TEST FUNCTIONS START
    private function required($valueToTest, $testValue) {
        return $valueToTest ? true : false;
    }

    private function minimumLength($valueToTest, $testValue) {
        return strlen($valueToTest) >= $testValue;
    }

    private function maximumLength($valueToTest, $testValue) {
        return strlen($valueToTest) <= $testValue;
    }

    private function regex($valueToTest, $testValue) {
        //preg_match() returns 1 if the pattern matches given subject,
        //0 if it does not, or FALSE if an error occurred.
        $result = preg_match($testValue, $valueToTest);
        if($result === false) {
            throw new ValidatorException('regular expression error');
        }
        else {
            return $result === 1;
        }
    }
    // TEST FUNCTIONS END

    function test(array $dataToTest) {
        $errors = array();
        foreach($this->schema as $name => $tests) {
            $valueToTest = $this->fetch($name, $dataToTest);
            if($tests[0]->name() === 'required' || $valueToTest) {
                foreach($tests as $testObject) {
                    if(!$this->isTestPass($valueToTest, $testObject)) {
                        $errors[$name] = $testObject->message();
                        break;
                    }
                }
            }
        }
        return $errors;
    }
}
?>
