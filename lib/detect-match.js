'use strict'

function detectMatch (string, selectionStart, selectionEnd, patterns) {
  var part, match

  // Return if text is selected:
  if (selectionStart !== selectionEnd) return null

  // Take one extra character so that we can check for
  // word boundaries but still anchor to the end of the string:
  part = string.substr(0, selectionEnd + 1)
  if (part.length <= selectionEnd) {
    part += ' '
  }

  for (var patternName in patterns) {
    if (patterns.hasOwnProperty(patternName)) {
      var pattern = patterns[patternName]
      var re = new RegExp(pattern.source + '.$')
      if ((match = part.match(re))) {
        return {
          string: string,
          value: match[1],
          type: patternName,
          range: {
            start: match.index,
            end: match.index + match[1].length
          }
        }
      }
    }
  }

  return null
}

module.exports = detectMatch
