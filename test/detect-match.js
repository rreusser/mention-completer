/* global describe, it */

'use strict'

var assert = require('chai').assert
var detect = require('../lib/detect-match')

describe('detectMatch', function () {
  var patterns = {
    handle: /(@[\w]+)\b/,
    hashtag: /(#[\w]+)\b/
  }

  it('matches a handle', function () {
    var match = detect('@name', 5, 5, patterns)
    assert.deepEqual(match, {
      string: '@name',
      value: '@name',
      type: 'handle',
      range: {
        start: 0,
        end: 5
      }
    })
  })

  it('matches a hashtag', function () {
    var match = detect('#tag', 4, 4, patterns)
    assert.deepEqual(match, {
      string: '#tag',
      value: '#tag',
      type: 'hashtag',
      range: {
        start: 0,
        end: 4
      }
    })
  })

  it('trailing space prevents match', function () {
    var match = detect('@name ', 6, 6, patterns)
    assert.equal(match, null)
  })

  it('detects the last match', function () {
    var str = '@firstname @secondname'
    var match = detect(str, str.length, str.length, patterns)
    assert.deepEqual(match, {
      string: '@firstname @secondname',
      value: '@secondname',
      type: 'handle',
      range: {
        start: 11,
        end: 11 + '@secondname'.length
      }
    })
  })

  it('detects match at the cursor position', function () {
    var str = '@firstname @secondname'
    var match = detect(str, str.length, str.length, patterns)
    assert.deepEqual(match, {
      string: '@firstname @secondname',
      value: '@secondname',
      type: 'handle',
      range: {
        start: 11,
        end: 11 + '@secondname'.length
      }
    })
  })

  it("doesn't detect a match in the middle of a word", function () {
    var str = '@firstname @secondname'
    var match = detect(str, 4, 4, patterns)
    assert.equal(match, null)
  })

  it('detects a match at the end of a word', function () {
    var str = '@firstname @secondname'
    var match = detect(str, 10, 10, patterns)
    assert.deepEqual(match, {
      string: '@firstname @secondname',
      value: '@firstname',
      type: 'handle',
      range: {
        start: 0,
        end: '@firstname'.length
      }
    })
  })

  it("doesn't detect a match if cursor is after whitespace", function () {
    var str = '@firstname test test'
    var match = detect(str, 11, 11, patterns)
    assert.equal(match, null)
  })

  it('requires more than one character to match', function () {
    var str = '@ moretext'
    var match = detect(str, 1, 1, patterns)
    assert.equal(match, null)
  })
})
