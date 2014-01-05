#The Validator!

##Capable of leaping across language barriers, validating data in a flash, and rescuing small kittens.

By using a JSON interface, Validator can be implemented in any programming language.  Validator prevents duplication of validation logic on the client and server.

##Create a schema

```json
{
    "fieldName": [
        test1, test2, ...
    ],
    "anotherField": [...]
}
```

tests are of the form
```json
{ "testType:testValue": "message if test fails" }
```

##testType

###required
required must be the first test of a given fieldName.  Passes if the given field name evaluates to a truthy value. If a required test is not present, then subsequent tests will only be run if the tested data contains a key for the associated fieldname.
```json
{
    "username": [
        { "required": "you must supply a username" }
    ]
}
```

###minimumLength
string must be of the specified minum length
```json
{
    "password": [
        { "required": "password required" },
        { "minimumLength:6", "password must be at least six characters long" }
    ]
}
```

###maximumLength
analogous logic to minimumLength

###regex
must match the supplied regex
```json
{"regex:/^[a-zA-Z0-9*$/": "alphanumeric characters only" }
```

###type
can test for types number, string, boolean, object, and null.
```json
{ "type:boolean": "must be true or false" }
```

###comparison operators
perform the <, >, <=, >=, and == operators.
```json
{ ">=:100": "you must be 100cm tall to ride the Ferris wheel" }
```

###email
test if matches a proper email format
```json
{ "email": "bad email format" }
```

###match
tests both values of a passed array of two values match
```json
{
    "password": [
        { "match": "passwords must match" }
    ]
}
```

###enumerated
tests that value is a member of a set of values
```json
{
    "letter": [
        { "enumerated:a,b,c": "value is not 'a', 'b' or 'c'" }
    ]
}
```

###numeric
Numeric strings. accepts values such as "123", "1.2", ".5", "05", "1."
```json
{ "numeric": "numeric string" }
```

###integer
Integer strings. Only characters 0-9

###alphabetical
Strings of only letters (upper or lower case)

###alphanumeric
Strings of only letters and digits



Currently Implentations are Javascript and PHP.

##PHP

```php
$validator = new Validator(json_decode(file_get_contents('validation_schema.json'), true));

$errors = $validator->test(array(
    'username' => 'bob',
    'password' => 'cornflakes'
));
```

##JavaScript

```javascript
var validator = new Validator(schema);

var errors = validator.test({
    username: 'bob',
    password: 'cornflakes'
});
```
