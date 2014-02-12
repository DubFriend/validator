var Validator = require('./validator');
var testData = require('./signup.example.json');

var foreach = function (collection, callback) {
    for(var i in collection) {
        if(collection.hasOwnProperty(i)) {
            callback(collection[i], i, collection);
        }
    }
};

var union = function () {
    var united = {};
    foreach(arguments, function (object) {
        foreach(object, function (value, key) {
            united[key] = value;
        });
    });
    return united;
};

module.exports = {
    setUp: function (done) {
        this.validator = new Validator(testData);
        this.validateExtended = function (extraData) {
            return this.validator.test(union({username: 'pass' }, extraData));
        };
        done();
    },
    testUserNamePass: function (test) {
        test.deepEqual(this.validator.test({ username: 'user' }), {});
        test.done();
    },

    testSkipTestIfEmptyStringAndNotRequired: function (test) {
        test.deepEqual(this.validateExtended({ email: '' }), {});
        test.done();
    },

    testFailRequiredFalsyValue: function (test) {
        test.deepEqual(
            this.validator.test({ username: '' }),
            { username: 'username required' }
        );
        test.done();
    },

    testFailRequiredKeyNotPresent: function (test) {
        test.deepEqual(
            this.validator.test({}),
            { username: 'username required' }
        );
        test.done();
    },

    testUsernameMinimumLengthFail: function (test) {
        test.deepEqual(
            this.validator.test({ username: 'ab' }),
            { username: '3 minimum' }
        );
        test.done();
    },

    testUsernameMaximumLengthFail: function (test) {
        test.deepEqual(
            this.validator.test({ username: '12345678901' }),
            { username: '10 maximum' }
        );
        test.done();
    },

    testUsernameMaximumLengthPass: function (test) {
        test.deepEqual(
            this.validator.test({ username: '1234567890' }), {}
        );
        test.done();
    },

    testRegexFail: function (test) {
        test.deepEqual(
            this.validator.test({ username: 'f@il' }),
            { username: 'alphanumeric only' }
        );
        test.done();
    },

    testTypeNumberPass: function (test) {
        test.deepEqual(this.validateExtended({ number: 5 }), {});
        test.done();
    },

    testTypeNumberFail: function (test) {
        test.deepEqual(
            this.validateExtended({ number: '5' }),
            { number: 'must be of type number' }
        );
        test.done();
    },

    testTypeStringPass: function (test) {
        test.deepEqual(this.validateExtended({ string: 'foo' }), {});
        test.done();
    },

    testTypeStringFail: function (test) {
        test.deepEqual(
            this.validateExtended({ string: true }),
            { string: 'must be of type string' }
        );
        test.done();
    },

    testTypeBooleanPass: function (test) {
        test.deepEqual(this.validateExtended({ boolean: false }), {});
        test.done();
    },

    testTypeBooleanFail: function (test) {
        test.deepEqual(
            this.validateExtended({ boolean: 0 }),
            { boolean: 'must be of type boolean' }
        );
        test.done();
    },

    testTypeObjectPass: function (test) {
        test.deepEqual(this.validateExtended({ object: []}), {});
        test.deepEqual(this.validateExtended({ object: {}}), {});
        test.done();
    },

    testTypeObjectFail: function (test) {
        test.deepEqual(
            this.validateExtended({ object: null }),
            { 'object': 'must be of type object' }
        );
        test.done();
    },

    testTypeNullPass: function (test) {
        test.deepEqual(this.validateExtended({ 'null': null }), {});
        test.done();
    },

    testTypeNullFail: function (test) {
        test.deepEqual(
            this.validateExtended({ 'null': 0 }),
            { 'null': 'must be of type null' }
        );
        test.done();
    },

    testLessThanPass: function (test) {
        test.deepEqual(this.validateExtended({ lessThan: -1 }), {});
        test.done();
    },

    testLessThanFail: function (test) {
        test.deepEqual(
            this.validateExtended({ lessThan: 0 }),
            { lessThan: 'must be less than zero' }
        );
        test.done();
    },

    testLessThanOrEqualToPass: function (test) {
        test.deepEqual(this.validateExtended({ lessThanOrEqualTo: 0 }), {});
        test.done();
    },

    testLessThanOrEqualToFail: function (test) {
        test.deepEqual(
            this.validateExtended({ lessThanOrEqualTo: 1 }),
            { lessThanOrEqualTo: 'must be less than or equal to zero' }
        );
        test.done();
    },



    testGreaterThanPass: function (test) {
        test.deepEqual(this.validateExtended({ greaterThan: 1 }), {});
        test.done();
    },

    testGreaterThanFail: function (test) {
        test.deepEqual(
            this.validateExtended({ greaterThan: 0 }),
            { greaterThan: 'must be greater than zero' }
        );
        test.done();
    },

    testGreaterThanOrEqualToPass: function (test) {
        test.deepEqual(this.validateExtended({ greaterThanOrEqualTo: 0 }), {});
        test.done();
    },

    testGreaterThanOrEqualToFail: function (test) {
        test.deepEqual(
            this.validateExtended({ greaterThanOrEqualTo: -1 }),
            { greaterThanOrEqualTo: 'must be greater than or equal to zero' }
        );
        test.done();
    },

    testEqualToPass: function (test) {
        test.deepEqual(this.validateExtended({ equalTo: '0' }), {});
        test.done();
    },

    testEqualToFail: function (test) {
        test.deepEqual(
            this.validateExtended({ equalTo: 1 }),
            { equalTo: 'must be equal to zero' }
        );
        test.done();
    },

    testEmailPass: function (test) {
        test.deepEqual(this.validateExtended({ email: 'email@email.com' }), {});
        test.done();
    },

    testEmailFail: function (test) {
        test.deepEqual(
            this.validateExtended({ email: 'wrong' }),
            { email: 'bad email format' }
        );
        test.done();
    },

    testMatchPass: function (test) {
        test.deepEqual(this.validateExtended({ match: ['10', 10] }), {});
        test.done();
    },

    testMatchFail: function (test) {
        test.deepEqual(
            this.validateExtended({ match: [1, 2] }),
            { match: 'values must match' }
        );
        test.done();
    },

    testMatchInproperFormat: function (test) {
        test.throws(
            function () {
                this.validateExtended({ match: [1] });
            },
            'match must recieve an array with two values'
        );
        test.done();
    },

    testEnumerated: function (test) {
        test.deepEqual(this.validateExtended({ enumerated: 'a' }), {});
        test.deepEqual(this.validateExtended({ enumerated: 'b' }), {});
        test.deepEqual(
            this.validateExtended({ enumerated: 'c' }),
            { enumerated: "value not in enumerated set" }
        );
        test.done();
    },

    testUseColonInValue: function (test) {
        test.deepEqual(this.validateExtended({ colonOnly: ':'}), {});
        test.done();
    },

    testNumericPass: function (test) {
        test.deepEqual(this.validateExtended({ numeric: '123' }), {});
        test.deepEqual(this.validateExtended({ numeric: '123.456' }), {});
        test.deepEqual(this.validateExtended({ numeric: '.45' }), {});
        test.deepEqual(this.validateExtended({ numeric: '1.' }), {});
        test.deepEqual(this.validateExtended({ numeric: '01' }), {});
        test.done();
    },

    testNumericFail: function (test) {
        test.ok(this.validateExtended({ numeric: '1a2' }).numeric);
        test.ok(this.validateExtended({ numeric: '123 '}).numeric);
        test.ok(this.validateExtended({ numeric: '1.2.3 '}).numeric);
        test.done();
    },

    testIntegerPass: function (test) {
        test.deepEqual(this.validateExtended({ integer: '123' }), {});
        test.deepEqual(this.validateExtended({ integer: '0001' }), {});
        test.done();
    },

    testIntegerFail: function (test) {
        test.ok(this.validateExtended({ integer: '1.2' }).integer);
        test.ok(this.validateExtended({ integer: '1a2' }).integer);
        test.done();
    },

    testAlphabeticalPass: function (test) {
        test.deepEqual(this.validateExtended({ alphabetical: 'aBc' }), {});
        test.done();
    },

    testAlphabeticalFail: function (test) {
        test.ok(this.validateExtended({ alphabetical: 'a1c' }).alphabetical);
        test.ok(this.validateExtended({ alphabetical: ' ac' }).alphabetical);
        test.done();
    },

    testAlphanumericPass: function (test) {
        test.deepEqual(this.validateExtended({ alphanumeric: 'a1B' }), {});
        test.done();
    },

    testAlphanumericFail: function (test) {
        test.ok(this.validateExtended({ alphanumeric: 'a 1b' }), {});
        test.done();
    }
};
