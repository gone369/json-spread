Json-Spread
===========
[![npm](https://img.shields.io/npm/v/json-spread.svg)](https://www.npmjs.com/package/json-spread) ![license](https://img.shields.io/npm/l/json-spread.svg) ![github-issues](https://img.shields.io/github/issues/gone369/json-spread.svg) ![npm-downloads](https://img.shields.io/npm/dt/json-spread.svg)


## Description

A simple javascript library that flattens a json structured object and then creates duplicate objects off of each nested array elements.

Great for converting nested, multi-leveled json to single level json that can be used to create csv,tsv,excel or other row column structured data.


## Version 1.0.0
- Added TS Support
- ESM Support
- CJS Backwards Compatibility 
- UMD Support

you can still use vanilla JS version of this package. Just lock the version at `v0.3.2`

## Installation

#### Node
```bash
npm install json-spread
```
#### Browser
include the `jsonSpread.js` file from the dist folder

## [NEW!] TypeScript Support (v1.0.0)

This library includes TypeScript type definitions. You can import and use it in your TypeScript projects:

```typescript
import jsonSpread from 'json-spread';

// Use generics to specify the return type
interface MyData {
  name: string;
  value: number;
}

const result = jsonSpread<MyData>(myData, { delimiter: '-' });
```

## Usage

```javascript
const jsonSpread = require('json-spread');
const output = jsonSpread({
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
const data = { "a": { "b" : "foo"} };
const options = {
  delimiter : "*" //default is '.'
}
const output = jsonSpread(data,options);
//output
{
  "a*b" : "foo"
}
```

##### removeEmptyArray
removes empty arrays

```javascript
const data = { "a": "value_a" , "b": []};
const options = {
  removeEmptyArray: true //default is false
}
const output = jsonSpread(data,options);
//output
{
  "a" : "value_a"
}
```
##### emptyValue
you can define the value for empty arrays in options.  
this is ignored if removeEmptyArray is ``true``

```javascript
const data = { "a": [] };
const options = {
  emptyValue: "EMPTY" //default is null
}
const output = jsonSpread(data,options);
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
npm run build
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
