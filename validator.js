(function () {
    'use strict';

    var isArray = function (value) {
        return value instanceof Array;
    };

    var foreach = function (collection, callback) {
        for(var i in collection) {
            if(collection.hasOwnProperty(i)) {
                callback(collection[i], i, collection);
            }
        }
    };

    var mapToArray = function (collection, callback) {
        var mapped = [];
        foreach(collection, function (value, key, coll) {
            mapped.push(callback(value, key, coll));
        });
        return mapped;
    };

    var mapToObject = function (collection, callback, keyCallback) {
        var mapped = {};
        foreach(collection, function (value, key, coll) {
            key = keyCallback ? keyCallback(key, value) : key;
            mapped[key] = callback(value, key, coll);
        });
        return mapped;
    };

    var map = function (collection, callback, keyCallback) {
        return isArray(collection) ?
            mapToArray(collection, callback) :
            mapToObject(collection, callback, keyCallback);
    };

    var keys = function (collection) {
        return mapToArray(collection, function (val, key) {
            return key;
        });
    };

    var values = function (collection) {
        return mapToArray(collection, function (val) {
            return val;
        });
    };

    var createValidatorTestWrapper = function (test) {
        return {
            message: function () {
                return values(test)[0];
            },
            description: function () {
                return keys(test)[0];
            },
            name: function () {
                return this.description().split(':')[0];
            },
            value: function () {
                var pieces = this.description().split(':');
                return pieces.length > 1 ? pieces[1] : undefined;
            }
        };
    };

    var isTestPass = function (valueToTest, testObject) {
        return testMethods[testObject.name()](valueToTest, testObject.value());
    };

    var testMethods = {
        required: function (valueToTest) {
            return valueToTest ? true : false;
        },
        minimumLength: function (valueToTest, testValue) {
            return valueToTest.length >= testValue;
        },
        maximumLength: function (valueToTest, testValue) {
            return valueToTest.length <= testValue;
        },
        regex: function (valueToTest, testValue) {
            var pieces = testValue.split('/');
            var pattern = pieces[1];
            var modifiers = pieces[2] || undefined;
            return new RegExp(pattern, modifiers).test(valueToTest);
        },
        type: function (valueToTest, testValue) {
            var typeOf = typeof valueToTest;
            switch(testValue) {
                case 'number':
                    return typeOf === 'number';
                case 'string':
                    return typeOf === 'string';
                case 'boolean':
                    return typeOf === 'boolean';
                case 'object':
                    return valueToTest !== null && typeOf === 'object';
                case 'null':
                    return valueToTest === null;
                default:
                    throw 'invalid type ' + testValue;
            }
        },
        '<': function (valueToTest, testValue) {
            return valueToTest < testValue;
        },
        '<=': function (valueToTest, testValue) {
            return valueToTest <= testValue;
        },
        '>': function (valueToTest, testValue) {
            return valueToTest > testValue;
        },
        '>=': function (valueToTest, testValue) {
            return valueToTest >= testValue;
        },
        '==': function (valueToTest, testValue) {
            return valueToTest == testValue;
        },
        email: function (valueToTest) {
            return (
                /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
            ).test(valueToTest);
        },
        match: function (valueToTest) {
            if(valueToTest.length === 2) {
                return valueToTest[0] == valueToTest[1];
            }
            else {
                throw 'match must recieve an array with two values';
            }
        }
    };

    var Validator = function (rawSchema) {
        var schema = map(rawSchema, function (tests, fieldName) {
            return map(tests, createValidatorTestWrapper);
        });

        return {
            test: function (dataToTest) {
                var errors = {};
                foreach(schema, function (tests, name) {
                    if(dataToTest[name] !== undefined) {
                        var testObject;
                        for(var i = 0; i < tests.length; i += 1) {
                            testObject = tests[i];
                            if(!isTestPass(dataToTest[name], testObject)) {
                                errors[name] = testObject.message();
                                break;
                            }
                        }
                    }
                    else if(tests[0].name() === 'required') {
                        errors[name] = tests[0].message();
                    }
                });
                return errors;
            }
        };
    };

    //use in both browser and nodejs
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Validator;
        }
        exports.Validator = Validator;
    }
    else {
        this.Validator = Validator;
    }

}).call(this);