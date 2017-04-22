Json-Spread
===========
![npm](https://img.shields.io/npm/v/json-spread.svg) ![license](https://img.shields.io/npm/l/json-spread.svg) ![github-issues](https://img.shields.io/github/issues/gone369/json-spread.svg) ![npm-downloads](https://img.shields.io/npm/dt/json-spread.svg)


## Description

A simple javascript library that flattens a json structured object and then creates duplicate objects off of each nested array elements.

Great for converting nested, multi-leveled json to single level json that can be used to create csv,tsv,excel or other row column structured data.

## Installation

#### Node
```bash
npm install json-spread
```
#### Browser
include the `jsonSpread.min.js` file from the dist folder

## Usage

```javascript
var jsonSpread = require('json-spread');
var output = jsonSpread({
  "a": [
    {
      "index": 1
    },
    {
      "index": 2
    },
    {
      "index": 3
    }
  ]
})
/*
output = [
  {
    "a.index": 1
  },
  {
    "a.index": 2
  },
  {
    "a.index": 3
  }
]
*/
```

## Examples

nested array
```javascript
//input
{
  "a": [
    1,
    2,
    3
  ],
  "b": {
    "a": [
      1,
      2,
      3
    ]
  }
}
//output
[
  {
    "a":1
  },
  {
    "a":2
  },
  {
    "a":3
  },
  {
    "b.a":1
  },
  {
    "b.a":2
  },
  {
    "b.a":3
  }
]
```

nested arrays within nested objects
```javascript
//input
{
  "a": {
    "b": {
      "c": {
        "d": {
          "e" : {
            "array": [
              1,
              2,
              3
            ]
          }
        }
      }
    }
  }
}
//output
[
  {
    "a.b.c.d.e.array": 1
  },
  {
    "a.b.c.d.e.array": 2
  },
  {
    "a.b.c.d.e.array": 3
  }
]
```

real life example
```javascript
//input
[
  {
    "user_id" : 1,
    "email": "1@domain.com",
    "hobbies": [
      {
        "type": "sport",
        "name": "soccer",
        "dates": [
          "May 3rd",
          "May 4th",
          "May 5th"
        ]
      },
      {
        "type": "sport",
        "name": "basketball",
        "dates": [
          "June 3rd",
          "July 4th"
        ]
      }
    ]
  },
  {
    "user_id" : 2,
    "email": "2@domain.com"
  },
  {
    "user_id" : 3,
    "email": "3@domain.com",
    "hobbies": []
  }
]
//output
[{
	"user_id": 1,
	"email": "1@domain.com",
	"hobbies.type": "sport",
	"hobbies.name": "soccer",
	"hobbies.dates": "May 3rd"
}, {
	"user_id": 1,
	"email": "1@domain.com",
	"hobbies.type": "sport",
	"hobbies.name": "soccer",
	"hobbies.dates": "May 4th"
}, {
	"user_id": 1,
	"email": "1@domain.com",
	"hobbies.type": "sport",
	"hobbies.name": "soccer",
	"hobbies.dates": "May 5th"
}, {
	"user_id": 1,
	"email": "1@domain.com",
	"hobbies.type": "sport",
	"hobbies.name": "basketball",
	"hobbies.dates": "June 3rd"
}, {
	"user_id": 1,
	"email": "1@domain.com",
	"hobbies.type": "sport",
	"hobbies.name": "basketball",
	"hobbies.dates": "July 4th"
}, {
	"user_id": 2,
	"email": "2@domain.com"
}, {
	"user_id": 3,
	"email": "3@domain.com",
	"hobbies": null
}]
```

## Options

### Fields

##### delimiter
specify the delimiting value for nested objects.

```javascript
var data = { "a": { "b" : "foo"} };
var options = {
  delimiter : "*" //default is '.'
}
var output = jsonSpread(data,options);
//output
{
  "a*b" : "foo"
}
```

##### removeEmptyArray
removes empty arrays

```javascript
var data = { "a": "value_a" , "b": []};
var options = {
  removeEmptyArray: true //default is false
}
var output = jsonSpread(data,options);
//output
{
  "a" : "value_a"
}
```
##### emptyValue
you can define the value for empty arrays in options.  
this is ignored if removeEmptyArray is ``true``

```javascript
var data = { "a": [] };
var options = {
  emptyValue: "EMPTY" //default is null
}
var output = jsonSpread(data,options);
//output
{
  "a" : "EMPTY"
}
```

## Contributing

###### installation
Fork it, then do an ``npm install``. everything should be in there  

###### building
after writing in src folder, do:
```bash
npm run dist
```
to see if it builds

###### tests
I use mocha and chai to test. 
```bash
npm test
```
write tests in ``/test`` folder. 

## Dependencies
This library currently depends on [flat](https://www.npmjs.com/package/flat)

## License
MIT License
