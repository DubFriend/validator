<?php
require_once 'validator.php';

class ValidateTest extends PHPUnit_Framework_TestCase {
	private $validator;
	function setUp() {
		$this->validator = new Validator(
			json_decode(file_get_contents('signup.example.json'), true)
		);
	}

	private function validateExtended(array $data = array()) {
		return $this->validator->test(
			array_merge(array('username' => 'pass'), $data)
		);
	}

	function testUsernamePass() {
		$this->assertEquals(
			array(), $this->validator->test(array('username' => 'user'))
		);
	}

	function testFailRequiredFalsyValue() {
		$this->assertEquals(
			array('username' => 'username required'),
			$this->validator->test(array('username' => ''))
		);
	}

	function testFailRequiredKeyNotPresent() {
		$this->assertEquals(
			array('username' => 'username required'),
			$this->validator->test(array())
		);
	}

	function testUsernameMinimumLengthFail() {
		$this->assertEquals(
			array('username' => "3 minimum"),
			$this->validator->test(array('username' => 'ab'))
		);
	}

	function testUsernameMinimumLengthPass() {
		$this->assertEquals(
			array(), $this->validator->test(array('username' => 'abc'))
		);
	}

	function testUsernameMaximumLengthFail() {
		$this->assertEquals(
			array('username' => '10 maximum'),
			$this->validator->test(array('username' => '12345678901'))
		);
	}

	function testUsernameMaximumLengthPass() {
		$this->assertEquals(
			array(), $this->validator->test(array('username' => '1234567890'))
		);
	}

	function testRegexFail() {
		$this->assertEquals(
			array('username' => 'alphanumeric only'),
			$this->validator->test(array('username' => 'f@il'))
		);
	}

	function testTypeNumberPass() {
		$this->assertEquals(
			array(),
			$this->validateExtended(array('number' => 5))
		);
	}

	function testTypeNumberFail() {
		$this->assertEquals(
			array('number' => 'must be of type number'),
			$this->validateExtended(array('number' => '5'))
		);
	}

	function testTypeStringPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('string' => 'foo'))
		);
	}

	function testTypeStringFail() {
		$this->assertEquals(
			array('string' => 'must be of type string'),
			$this->validateExtended(array('string' => true))
		);
	}

	function testTypeBooleanPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('boolean' => false))
		);
	}

	function testTypeBooleanFailZero() {
		$this->assertEquals(
			array('boolean' => 'must be of type boolean'),
			$this->validateExtended(array('boolean' => 0))
		);
	}

	function testTypeBooleanFailNull() {
		$this->assertEquals(
			array('boolean' => 'must be of type boolean'),
			$this->validateExtended(array('boolean' => null))
		);
	}

	function testTypeObjectPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('object' => array()))
		);
	}

	function testTypeObjectFail() {
		$this->assertEquals(
			array('object' => 'must be of type object'),
			$this->validateExtended(array('object' => null))
		);
	}

	function testTypeNullPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('null' => null))
		);
	}

	function testTypeNullFail() {
		$this->assertEquals(
			array('null' => 'must be of type null'),
			$this->validateExtended(array('null' => ''))
		);
	}

	function testLessThanPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('lessThan' => -1))
		);
	}

	function testLessThanFail() {
		$this->assertEquals(
			array('lessThan' => 'must be less than zero'),
			$this->validateExtended(array('lessThan' => 0))
		);
	}

	function testLessThanOrEqualToPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('lessThanOrEqualTo' => 0))
		);
	}

	function testLessThanOrEqualToFail() {
		$this->assertEquals(
			array('lessThanOrEqualTo' => 'must be less than or equal to zero'),
			$this->validateExtended(array('lessThanOrEqualTo' => 0.1))
		);
	}

	function testGreaterThanPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('greaterThan' => 1))
		);
	}

	function testGreaterThanFail() {
		$this->assertEquals(
			array('greaterThan' => 'must be greater than zero'),
			$this->validateExtended(array('greaterThan' => 0))
		);
	}

	function testGreaterThanOrEqualToPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('greaterThanOrEqualTo' => 0))
		);
	}

	function testGreaterThanOrEqualToFail() {
		$this->assertEquals(
			array('greaterThanOrEqualTo' => 'must be greater than or equal to zero'),
			$this->validateExtended(array('greaterThanOrEqualTo' => -0.1))
		);
	}

	function testEqualToPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('equalTo' => '0'))
		);
	}

	function testEqualToFail() {
		$this->assertEquals(
			array('equalTo' => 'must be equal to zero'),
			$this->validateExtended(array('equalTo' => 1))
		);
	}

	function testEmailPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('email' => 'mail@mail.com'))
		);
	}

	function testEmailFail() {
		$this->assertEquals(
			array('email' => 'bad email format'),
			$this->validateExtended(array('email' => 'wrong'))
		);
	}

	function testMatchPass() {
		$this->assertEquals(
			array(), $this->validateExtended(array('match' => array('10', 10)))
		);
	}

	function testMatchFail() {
		$this->assertEquals(
			array('match' => 'values must match'),
			$this->validateExtended(array('match' => array(1, 2)))
		);
	}

	/**
     * @expectedException ValidatorException
     */
	function testMatchInproperFormat() {
		$this->validateExtended(array('match' => array(1)));
	}

	function testEnumerated() {
		$this->assertEquals(
			array(), $this->validateExtended(array('enumerated' => 'a'))
		);
		$this->assertEquals(
			array(), $this->validateExtended(array('enumerated' => 'b'))
		);
		$this->assertEquals(
			array('enumerated' => 'value not in enumerated set'),
			$this->validateExtended(array('enumerated' => 'c'))
		);
	}

	function testUseColonInValue() {
		$this->assertEquals(
			array(), $this->validateExtended(array('colonOnly' => ':'))
		);
    }

    function testNumericPass() {
    	$this->assertEquals(
    		array(), $this->validateExtended(array('numeric' => '123'))
    	);
    	$this->assertEquals(
    		array(), $this->validateExtended(array('numeric' => '123.456'))
    	);
    	$this->assertEquals(
    		array(), $this->validateExtended(array('numeric' => '.45'))
    	);
    	$this->assertEquals(
    		array(), $this->validateExtended(array('numeric' => '1.'))
    	);
    	$this->assertEquals(
    		array(), $this->validateExtended(array('numeric' => '01'))
    	);
    }

    function testNumericFail() {
    	$this->assertEquals(
    		array('numeric' => 'must be numeric'),
    		$this->validateExtended(array('numeric' => '1a2'))
    	);
    	$this->assertEquals(
    		array('numeric' => 'must be numeric'),
    		$this->validateExtended(array('numeric' => '123 '))
    	);
    }
}
?>
