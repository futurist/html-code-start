var o = require('ospec')
var parse = require('../')

function pick(obj, keys){
  return (typeof keys==='string'?keys.split(','):keys).map(k=>obj[k])
}

o('should not throw', function(){
  var parse2 = code=>pick(parse(code), 'start,line,col,quirks')
  o(parse2(`  asdf`)).deepEquals([2,1,2,true])
  o(parse2(`  <!--asdf-->asdf`)).deepEquals([13,1,13,true])
  o(parse2(`  <!--asdf--><html><head><body>asdf`)).deepEquals([25,1,25,true])
  o(parse2(`  <!--asdf--><head><body>asdf`)).deepEquals([19,1,19,true])
  o(parse2(`  <!doctype><head><!--asdf--><body>asdf`)).deepEquals([29,1,29,false])
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
  line: 7,
  col: 0,
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
