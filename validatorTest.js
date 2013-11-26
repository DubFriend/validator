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

    testTypNullFail: function (test) {
        test.deepEqual(
            this.validateExtended({ 'null': '' }),
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
    }

};