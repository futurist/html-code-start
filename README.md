# html-code-start
Find js code start point, skip any whitespace and comments.

[![Build Status](https://travis-ci.org/futurist/html-code-start.svg?branch=master)](https://travis-ci.org/futurist/html-code-start)
[![npm](https://img.shields.io/npm/v/html-code-start.svg "Version")](https://www.npmjs.com/package/html-code-start)


When you want to place some code at beginning of HTML file, you don't want to messup `<!doctype>` and html structure, so this module help find the first real code beginning in `head`, thus skip any whitespace, comments, and `!doctype, html, head` tag.

## Usage

```js
const findStart = require('html-code-start')
var code = `<!--oiasdjf-->
<!doctype html>
<html title="as>df">
</head>
<head>
<script>var a=1;</script>
`
console.log(findStart(code))
```

The result is

```
{ start: 68,
  quirks: false,
  ast:
   [ { type: 1, start: 0, end: 0 },
     { type: 3, start: 1, end: 14 },
     { type: 1, start: 15, end: 15 },
     { type: '!doctype', start: 16, end: 30, isTag: false, isClose: false },
     { type: 1, start: 31, end: 31 },
     { type: 'html', start: 32, end: 51, isTag: true, isClose: false },
     { type: 1, start: 52, end: 52 },
     { type: 'head', start: 53, end: 59, isTag: true, isClose: true },
     { type: 1, start: 60, end: 60 },
     { type: 'head', start: 61, end: 66, isTag: true, isClose: false },
     { type: 1, start: 67, end: 67 } ] }
```

And the js code start point is `68`, which is just before `<script>var a=1;</script>` tag.

