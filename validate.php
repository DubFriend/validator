<?php
class JSONvalidateException extends Exception {}

class JSONvalidate {
    private $schema;
    function __construct($filePath) {
        $this->schema = json_decode(file_get_contents($filePath), true);
    }

    private function isTestPass($test, $value) {
        return $this->{explode(':', $test)[0]}($test, $value);
    }

    private function required($test, $value) {
        return $value ? true : false;
    }

    private function getTest($testObject) {
        return array_keys($testObject)[0];
    }

    private function getMessage($testObject) {
        return array_values($testObject)[0];
    }

    private function fetch($key, array $array) {
        return array_key_exists($key, $array) ? $array[$key] : null;
    }

    function test(array $data) {
        $errors = array();
        foreach($this->schema as $name => $tests) {
            $value = $this->fetch($name, $data);
            if($this->getTest($tests[0]) === 'required' || $value) {
                foreach($tests as $testObject) {
                    if(!$this->isTestPass($this->getTest($testObject), $value)) {
                        $errors[$name] = $this->getMessage($testObject);
                        break;
                    }
                }
            }
        }
        return $errors;
    }
}
?>