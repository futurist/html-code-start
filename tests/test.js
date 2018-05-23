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
<!doctype>
<html title="as>df">
</head>
<head>
<script>var a=1;</script>
`
o(parse(code)).deepEquals({ start: 63,
  quirks: false,
  ast: 
   [ { type: 1, start: 0, end: 0 },
     { type: 3, start: 1, end: 14 },
     { type: 1, start: 15, end: 15 },
     { type: '!doctype',
       start: 16,
       end: 25,
       isTag: false,
       isClose: false },
     { type: 1, start: 26, end: 26 },
     { type: 'html', start: 27, end: 46, isTag: true, isClose: false },
     { type: 1, start: 47, end: 47 },
     { type: 'head', start: 48, end: 54, isTag: true, isClose: true },
     { type: 1, start: 55, end: 55 },
     { type: 'head', start: 56, end: 61, isTag: true, isClose: false },
     { type: 1, start: 62, end: 62 } ] })
})
