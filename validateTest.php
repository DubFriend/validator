<?php
require_once 'validate.php';

class JSONvalidateTest extends PHPUnit_Framework_TestCase {
	private $validator;
	function setUp() {
		$this->validator = new JSONvalidate('signup.example.json');
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
}
?>