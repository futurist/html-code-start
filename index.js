var white = '\t\n\r '.split('')
var endTagChar = white.concat('>')
var TYPE_WHITESPACE = 1
var TYPE_TEXT = 2
var TYPE_COMMENT = 3
var WHITELIST_TAG = [
  '!doctype',
  'html',
  'head'
]

function parse (str) {
  str = str.toLowerCase()
  var i = 0, c, quirks = true, inString
  var length = str.length
  var ast = [], node = {}
  var tagObj, tagName
  var lines = 1
  var cols = 0
  var prev = 0
  main_loop:
  for (;i < length;) {
    c = str[i]
    cols+=(i-prev)
    prev = i
    if(c==='\n') lines++, cols=0, prev++
    if (node.type === TYPE_WHITESPACE) {
      if (white.indexOf(c) < 0) {
        node.end = i - 1
        ast.push(node)
        node = {}
      } else {
        i++
      }
      continue
    } else if (node.type === TYPE_COMMENT) {
      if (c === '-' && str.indexOf('-->', i) === i) {
        node.end = i + 2
        ast.push(node)
        node = {}
        i += 3
      } else {
        i++
      }
      continue
    } else if (node.type != null) {
      if (c === "'" || c === '"') {
        inString = !inString
      }
      if (!inString && c === '>') {
        node.end = i
        ast.push(node)
        node = {}
      }
      i++
      continue
    } else { // node.type==null
      if (white.indexOf(c) > -1) {
        node = {type: TYPE_WHITESPACE, start: i, end: i}
        i++
      } else if (c === '<') {
        if (str.indexOf('<!--', i) === i) {
          node = {type: TYPE_COMMENT, start: i, end: i}
          i += 4
        } else {
          tagObj = getTagName(i)
          tagName = tagObj[1]
          node = {type: tagName, start: i, end: i, isTag: tagObj[2], isClose: tagObj[3]}
          if (tagName === '!doctype') quirks = false
          if (WHITELIST_TAG.indexOf(tagName) < 0 && tagName[0] !== '/') break
          i = tagObj[0]
        }
      } else break
    }
  }
  return {
    start: i,
    line: lines,
    col: cols,
    quirks: quirks,
    ast: ast
  }

  function getTagName (start) {
    var isClose = str[start + 1] === '/'
    if (isClose) start++
    var char, code, end = start, tag = [], isTag = true
    for (;;) {
      char = str[++end]
      if (char == null || endTagChar.indexOf(char) > -1) break
      code = char.charCodeAt(0)
      if (isTag && (code < 97 || code > 122)) { // a=97, z=122
        isTag = false
      }
      tag.push(char)
    }
    return [end, tag.join(''), isTag, isClose]
  }
}

module.exports = parse
