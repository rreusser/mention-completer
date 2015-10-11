'use strict'

function replaceMatch (string, replaceStart, replaceEnd, replaceWith) {
  var start = string.substr(0, replaceStart)
  var end = string.substr(replaceEnd)
  var cursorPosition = start.length + replaceWith.length + 1
  return {
    text: start + replaceWith + ' ' + end,
    selectionRange: {
      start: cursorPosition,
      end: cursorPosition
    }
  }
}

module.exports = replaceMatch
