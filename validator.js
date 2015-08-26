// The Validator
// https://github.com/DubFriend/validator
(function () {
    'use strict';

    var isString = function (value) {
        return Object.prototype.toString.call(value) === '[object String]';
    };

    var isArray = function (value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    var isObject = function (value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    };

    var isArrayOrString = function (value) {
        return isString(value) || isArray(value);
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

    var last = function (array) {
        return array[array.length - 1];
    };

    var testTypes = {
        any: {
            test: function () {
                return true;
            },
            message: function () {
                return 'Any value is allowed so this is wierd...';
            }
        },

        type: {
            test: function (valueToTest, testValue) {
                switch(testValue) {
                    case 'boolean':
                        return typeof valueToTest === 'boolean';
                    case 'number':
                        return typeof valueToTest === 'number';
                    case 'string':
                        return isString(valueToTest);
                    case 'object':
                        return isObject(valueToTest);
                    case 'array':
                        return isArray(valueToTest);
                    default:
                        throw new Error('Invalid validation type');
                }
            },
            message: function (name, testValue) {
                return name + ' must be of type ' + testValue;
            }
        },

        required: {
            test: function (valueToTest) {
                return valueToTest ? true : false;
            },
            message: function (name, testValue) {
                return name + ' is required';
            }
        },

        illegalField: {
            test: function (valueToTest) {
                return valueToTest === undefined;
            },
            message: function (name, testValue) {
                return name + ' is an illegal field';
            }
        },

        minimumLength: {
            test: function (valueToTest, testValue) {
                return isArrayOrString(valueToTest) &&
                    valueToTest.length >= testValue;
            },
            message: function (name, testValue) {
                return name + ' must be at least ' + testValue + ' characters long';
            }
        },

        maximumLength: {
            test: function (valueToTest, testValue) {
                return isArrayOrString(valueToTest) &&
                    valueToTest.length <= testValue;
            },
            message: function (name, testValue) {
                return name + ' cannot exceed a length of ' + testValue + ' characters';
            }
        },

        regex: {
            test: function (valueToTest, testValue) {
                var pieces = testValue.split('/'),
                    modifiers = last(pieces),
                    pattern;

                if(pieces.length) {
                    pieces.pop();
                }

                if(pieces.length) {
                    pieces.shift();
                }

                pattern = pieces.join('/');

                return new RegExp(pattern, modifiers).test(valueToTest);
            },
            message: function (name, testValue) {
                return name + ' is not properly formatted';
            }
        },

        '<': {
            test: function (valueToTest, testValue) {
                return Number(valueToTest) < Number(testValue);
            },
            message: function (name, testValue) {
                return name + ' must be less than ' + testValue;
            }
        },

        '<=': {
            test: function (valueToTest, testValue) {
                return Number(valueToTest) <= Number(testValue);
            },
            message: function (name, testValue) {
                return name + ' must be less than or equal to ' + testValue;
            }
        },

        '>': {
            test: function (valueToTest, testValue) {
                return Number(valueToTest) > Number(testValue);
            },
            message: function (name, testValue) {
                return name + ' must be greater than ' + testValue;
            }
        },

        '>=': {
            test: function (valueToTest, testValue) {
                return Number(valueToTest) >= Number(testValue);
            },
            message: function (name, testValue) {
                return name + ' must be greater than or equal to ' + testValue;
            }
        },

        '==': {
            test: function (valueToTest, testValue) {
                return valueToTest == testValue;
            },
            message: function (name, testValue) {
                return name + ' must be equal to ' + testValue;
            }
        },

        email: {
            test: function (valueToTest) {
                return (
                    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                ).test(valueToTest);
            },
            message: function (name, testValue) {
                return name + ' must be an email address';
            }
        },

        match: {
            test: function (valueToTest, testValue, allValues) {
                return valueToTest == allValues[testValue];
            },
            message: function (name, testValue) {
                return name + ' must have matching values';
            }
        },

        enumerated: {
            test: function (valueToTest, testValue) {
                return testValue.split(',').indexOf(valueToTest) !== -1;
            },
            message: function (name, testValue) {
                return 'invalid value for ' + name;
            }
        },

        numeric: {
            test: function (valueToTest) {
                return (/^-?[0-9]*\.?[0-9]*$/).test(valueToTest);
            },
            message: function (name, testValue) {
                return name + ' must be a number';
            }
        },

        integer: {
            test: function (valueToTest) {
                return (/^[0-9]*$/).test(valueToTest);
            },
            message: function (name, testValue) {
                return name + ' must be an integer';
            }
        },

        alphabetical: {
            test: function (valueToTest) {
                return (/^[a-zA-Z]*$/).test(valueToTest);
            },
            message: function (name, testValue) {
                return name + ' must contain alphabetic letters only';
            }
        },

        alphanumeric: {
            test: function (valueToTest) {
                return (/^[a-zA-Z0-9]*$/).test(valueToTest);
            },
            message: function (name, testValue) {
                return name + ' must contain only letters and numbers';
            }
        }
    };

    var deepStringify = function (data) {
        if(isArray(data) || isObject(data)) {
            return map(data, deepStringify);
        }
        else if(data === undefined || data === null) {
            return '';
        }
        else {
            return String(data);
        }
    };

    var Validator = function (rawSchema, options) {
        options = options || {};

        var parseFieldName = function (rawFieldName) {
            return rawFieldName
                .replace(/-/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/(?:^|\s)\S/g, function (a) {
                    return a.toUpperCase();
                });
        };

        var containsTestWithName = function (tests, name) {
            var containsTest = false;
            foreach(tests, function (test) {
                if(test.name() === name) {
                    containsTest = true;
                }
            });
            return containsTest;
        };

        var removeTestWithName = function (tests, name) {
            var filtered = [];
            foreach(tests, function (test) {
                if(test.name() !== name) {
                    filtered.push(test);
                }
            });
            return filtered;
        };

        var schema = map(rawSchema, function  (tests, rawFieldName) {
            return map(isArray(tests) ? tests : [tests], function (test) {
                return {
                    message: function () {
                        if(isObject(test)) {
                            return values(test)[0];
                        }
                        else {
                            return testTypes[this.name()].message(
                                parseFieldName(rawFieldName),
                                this.value()
                            );
                        }
                    },

                    description: function () {
                        if(isObject(test)) {
                            return keys(test)[0];
                        }
                        else {
                            return test;
                        }
                    },

                    name: function () {
                        return this.description().split(':')[0];
                    },

                    value: function () {
                        var pieces = this.description().split(':');
                        if(pieces.length > 1) {
                            pieces.shift();
                            return pieces.join(':');
                        }
                    },

                    isPass: function (value, allValues) {
                        return testTypes[this.name()].test(
                            value,
                            this.value(),
                            allValues
                        );
                    }
                };
            });
        });

        return {
            test: function (rawDataToTest) {
                var dataToTest = rawDataToTest;
                var errors = {};

                foreach(schema, function runTestsOnGroup (tests, name) {
                    var valueToTest = dataToTest[name];
                    var firstTest = tests[0];

                    if(
                        containsTestWithName(tests, 'required') ||
                        containsTestWithName(tests, 'illegalField') ||
                        valueToTest !== undefined
                    ) {
                        if(!(
                            containsTestWithName(tests, 'allowNull') &&
                            valueToTest === null
                        )) {
                            foreach(removeTestWithName(tests, 'allowNull'), function (test) {
                                if(!test.isPass(valueToTest, dataToTest)) {
                                    if(!errors[name]) {
                                        errors[name] = [];
                                    }
                                    errors[name].push(test.message());
                                }
                            });
                        }
                    }
                });

                if(options.strict) {
                    foreach(rawDataToTest, function (value, key) {
                        if(!schema[key]) {
                            errors[key] = [parseFieldName(key) + ' is an illegal field'];
                        }
                    });
                }

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
