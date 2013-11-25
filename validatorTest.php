<?php
require_once 'validator.php';

class ValidateTest extends PHPUnit_Framework_TestCase {
	private $validator;
	function setUp() {
		$this->validator = new Validator('signup.example.json');
	}

	function testUsernamePass() {
		$this->assertEquals(
			array(), $this->validator->test(array('username' => 'user'))
		);
	}

	function testFailRequired() {
		$this->assertEquals(
			array('username' => 'username required'),
			$this->validator->test(array('username' => ''))
		);
		$this->assertEquals(
			array('username' => 'username required'),
			$this->validator->test(array())
		);
	}

	function testInstantiateWithArray() {
		$validator = new Validator(array(
			'field' => array(array('required' => 'fail'))
		));
		$this->assertEquals(array('field' => 'fail'), $validator->test(array()));
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
}
?>