var Validator = require('../validator');
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

exports.customMessageTests = {
    setUp: function (done) {
        this.validator = new Validator(testData);
        this.validateExtended = function (extraData) {
            return this.validator.test(union({username: 'pass' }, extraData || {}));
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
            { username: ['username required', '3 minimum'] }
        );
        test.done();
    },

    testFailRequiredKeyNotPresent: function (test) {
        test.deepEqual(
            this.validator.test({}),
            { username: ['username required', '3 minimum', '10 maximum'] }
        );
        test.done();
    },

    testUsernameMinimumLengthFail: function (test) {
        test.deepEqual(
            this.validator.test({ username: 'ab' }),
            { username: ['3 minimum'] }
        );
        test.done();
    },

    testUsernameMaximumLengthFail: function (test) {
        test.deepEqual(
            this.validator.test({ username: '12345678901' }),
            { username: ['10 maximum'] }
        );
        test.done();
    },

    testUsernameMaximumLengthPass: function (test) {
        test.deepEqual(
            this.validator.test({ username: '1234567890' }), {}
        );
        test.done();
    },

    testSometimesIsUndefined: function (test) {
        test.deepEqual(this.validateExtended(), {});
        test.done();
    },

    testSometimesIsEmptyString: function (test) {
        test.deepEqual(
            this.validateExtended({ sometimes: "" }),
            {}
        );
        test.done()
    },

    testSometimesIsZero: function (test) {
        test.deepEqual(
            this.validateExtended({ sometimes: 0 }),
            { sometimes: ['3 minimum'] }
        );
        test.done();
    },

    testSometimesIsNumberOne: function (test) {
        test.deepEqual(
            this.validateExtended({ sometimes: 1 }).sometimes,
            ['3 minimum']
        );
        test.done();
    },

    testSometimesIsZeroString: function (test) {
        test.deepEqual(
            this.validateExtended({ sometimes: 0 }).sometimes,
            ['3 minimum']
        );
        test.done();
    },

    testSometimesKeyIsTooShort: function (test) {
        test.deepEqual(
            this.validateExtended({ sometimes: "ab" }).sometimes,
            ["3 minimum"]
        );
        test.done();
    },

    testIllegalField: function (test) {
        test.deepEqual(
            this.validateExtended({ illegalField: "" }).illegalField,
            ["illegal field"]
        );
        test.done();
    },

    testRegexFail: function (test) {
        test.deepEqual(
            this.validator.test({ username: 'f@il' }),
            { username: ['alphanumeric only'] }
        );
        test.done();
    },

    testRegexContainsForwardSlash: function (test) {
        var validator = new Validator({
            foo: [
                { "regex:/^beggining\/end$/": "fail" }
            ]
        });

        test.deepEqual(
            validator.test({ foo: 'beggining/end' }), {},
            'pass ok'
        );

        test.deepEqual(
            validator.test({ foo: 'wrong' }), { foo: ['fail'] },
            'fail ok'
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
            { lessThan: ['must be less than zero'] }
        );
        test.done();
    },

    testLessThanOrEqualToPass: function (test) {
        test.deepEqual(this.validateExtended({ lessThanOrEqualTo: 0 }), {});
        test.done();
    },

    testDoesNotModifyTheInput: function (test) {
        var input = { lessThanOrEqualTo: 0 };
        this.validateExtended({ lessThanOrEqualTo: 0 });
        test.deepEqual(input, { lessThanOrEqualTo: 0 });
        test.done();
    },

    testLessThanOrEqualToFail: function (test) {
        test.deepEqual(
            this.validateExtended({ lessThanOrEqualTo: 1 }),
            { lessThanOrEqualTo: ['must be less than or equal to zero'] }
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
            { greaterThan: ['must be greater than zero'] }
        );
        test.done();
    },

    testGreaterThanOrEqualToPass: function (test) {
        test.deepEqual(this.validateExtended({ greaterThanOrEqualTo: '0' }), {});
        test.done();
    },

    testGreaterThanOrEqualToFail: function (test) {
        test.deepEqual(
            this.validateExtended({ greaterThanOrEqualTo: -1 }),
            { greaterThanOrEqualTo: ['must be greater than or equal to zero'] }
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
            { equalTo: ['must be equal to zero'] }
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
            { email: ['bad email format'] }
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
            { match: ['values must match'] }
        );
        test.done();
    },

    testEnumerated: function (test) {
        test.deepEqual(this.validateExtended({ enumerated: 'a' }), {});
        test.deepEqual(this.validateExtended({ enumerated: 'b' }), {});
        test.deepEqual(
            this.validateExtended({ enumerated: 'c' }),
            { enumerated: ["value not in enumerated set"] }
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
        test.ok(this.validateExtended({ alphanumeric: 'a 1b' }).alphanumeric);
        test.done();
    },

    testAutoGeneratedMessages: function (test) {
        var validator = new Validator({
            "foo": ['required', 'minimumLength:3']
        });
        test.deepEqual(
            validator.test({ foo: '' }),
            { foo: ['foo is required', 'foo must be at least 3 characters long'] }
        );
        test.done();
    },

    testAutoGeneratedMessagesSingleString: function (test) {
        var validator = new Validator({
            "foo": 'required'
        });
        test.deepEqual(
            validator.test({}),
            { foo: ['foo is required'] }
        );
        test.done();
    }
};
