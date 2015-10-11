'use strict'

function replaceMatch (string, replaceStart, replaceLength, replaceWith) {
  var start = string.substr(0, replaceStart)
  var end = string.substr(replaceStart + replaceLength)
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
