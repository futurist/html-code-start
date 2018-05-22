var white = '\t\n\r '.split('')
var endTagChar = white.concat('>')
var TYPE_WHITESPACE = 1
var TYPE_TEXT = 2
var TYPE_COMMENT = 3
var TYPE_NODE_DOCTYPE = 4
var TYPE_NODE_HTML = 5
var TYPE_NODE_HEAD = 6
var TYPE_NODE_CLOSE = 100

function parse(str) {
  str = str.toLowerCase()
  var i=0, c, quirks=true, inString
  var length = str.length
  var ast = [], node={}
  main_loop:
  for(;i<length;){
    c = str[i]
    switch (node.type){
      case TYPE_WHITESPACE:{
        if(white.indexOf(c) < 0) {
             node.end = i-1
             ast.push(node)
             node={}
         } else {
           i++
         }
         break
      }
      case TYPE_COMMENT:{
        console.log(c)
        if(c==='-' && str.indexOf('-->',i)===i) {
          node.end = i+2
          ast.push(node)
          node={}
          i+=3
        } else {
          i++
        }
        break
      }
      case TYPE_NODE_DOCTYPE:
      case TYPE_NODE_HTML:
      case TYPE_NODE_HEAD:
      case TYPE_NODE_CLOSE:
      {
        if(c==="'"||c==='"'){
          inString = !inString
          i++
          break
        }
        if(!inString && c==='>'){
          node.end = i
          ast.push(node)
          node={}
        }
        i++
        break
      }
      default:{
        if(white.indexOf(c) > -1) {
          node = {type: TYPE_WHITESPACE, start: i, end: i}
          i++
        } else if(c==='<'){
          console.log(c, i, str.indexOf('<!doctype',i), getTagName(i))
          if(str.indexOf('<!--',i)===i) {
            node = {type: TYPE_COMMENT, start: i, end: i}
            i+=4
          } else if(str.indexOf('<!doctype',i)===i && endTagChar.indexOf(str[i+9])>-1) {
            node = {type: TYPE_NODE_DOCTYPE, start: i, end: i}
            i+=9
            quirks = false
          } else if(str.indexOf('<html',i)===i && endTagChar.indexOf(str[i+5])>-1){
            node = {type: TYPE_NODE_HTML, start: i, end: i}
            i+=5
          } else if(str.indexOf('<head',i)===i && endTagChar.indexOf(str[i+5])>-1){
            node = {type: TYPE_NODE_HEAD, start: i, end: i}
            i+=5
          } else if(str.indexOf('</',i)===i){
            node = {type: TYPE_NODE_CLOSE, start: i, end: i}
            i+=2
          }
          else break main_loop
        } else break main_loop
      }
    }
  }
  return {
    start: i,
    quirks: quirks,
    ast: ast
  }

  function getTagName(start) {
    var char, code, end = start, tag=[], isTag=true
    for(;;) {
      char = str[++end]
      if(char==null || endTagChar.indexOf(char)>-1) break
      code = char.charCodeAt(0)
      if(isTag && (code<97||code>122)) { //a=97, z=122
        isTag=false
      }
      tag.push(char)
    }
    return [end-1, tag.join(''), isTag]
  }
}

module.exports = parse

var code=`
<!-- oiasdjf-->
<!doctype>
<html title="as>df">
<head>
<script>window.abc=1234; void function(){var s=document.getElementsByTagName('script')[0]; s.parentNode.removeChild(s)}();</script>
<script src=a.js></script>
`
var r = parse(code)
console.log(r, code.slice(r.start))

