var o = require('ospec')
var parse = require('../')

o('should not throw', function(){
  o(parse(`  asdf`).start).equals(2)
  o(parse(`  <!--asdf-->asdf`).start).equals(13)
  o(parse(`  <!--asdf--><html><head><body>asdf`).start).equals(25)
  o(parse(`  <!--asdf--><head><body>asdf`).start).equals(19)
  o(parse(`  <!doctype><head><!--asdf--><body>asdf`).start).equals(29)
})
o('should work', function(){
  var code = `
<!--oiasdjf-->
<!doctype html>
<html title="as>df">
</head>
<head>
<script>var a=1;</script>
`
o(parse(code)).deepEquals({ start: 68,
  lines: 6,
  quirks: false,
  ast:
   [ { type: 1, start: 0, end: 0 },
     { type: 3, start: 1, end: 14 },
     { type: 1, start: 15, end: 15 },
     { type: '!doctype',
       start: 16,
       end: 30,
       isTag: false,
       isClose: false },
     { type: 1, start: 31, end: 31 },
     { type: 'html', start: 32, end: 51, isTag: true, isClose: false },
     { type: 1, start: 52, end: 52 },
     { type: 'head', start: 53, end: 59, isTag: true, isClose: true },
     { type: 1, start: 60, end: 60 },
     { type: 'head', start: 61, end: 66, isTag: true, isClose: false },
     { type: 1, start: 67, end: 67 } ] })
})
