/* global describe, it, beforeEach */
'use strict'

var assert = require('chai').assert
var sinon = require('sinon')
var MentionCompleter = require('../')
var TextInput = require('./fake/text_input')

describe('MentionCompleter', function () {
  var mention, textInput, onCheck, noMatchSpy, matchSpy, checkSpy, counter

  beforeEach(function () {
    counter = 0

    textInput = new TextInput()

    mention = new MentionCompleter({
      patterns: {
        handle: /(@[\w]+)\b/,
        hashtag: /(#[\w]+)\b/
      },
      getSelectionRange: textInput.getSelectionRange.bind(textInput),
      setSelectionRange: textInput.setSelectionRange.bind(textInput),
      getValue: textInput.getValue.bind(textInput)
    })

    onCheck = sinon.spy(mention.checkForMatch.bind(mention))
    textInput.on('change', onCheck)

    matchSpy = sinon.spy()
    noMatchSpy = sinon.spy()
    checkSpy = sinon.spy()

    mention
      .on('match', matchSpy)
      .on('nomatch', noMatchSpy)
      .on('check', checkSpy)
  })

  it('triggers a suggestion', function (done) {
    mention.on('match', function (match) {
      assert.deepEqual(match, {
        string: 'hello, @handle',
        value: '@handle',
        type: 'handle',
        range: {
          start: 7,
          end: 14
        }
      })
      done()
    })
    textInput.enter('hello, @handle')
  })

  it('suggestion is detected for "hello, @handle|"', function (done) {
    mention.on('match', function (match) {
      assert.deepEqual(match, {
        string: 'hello, @handle',
        value: '@handle',
        type: 'handle',
        range: {
          start: 7,
          end: 14
        }
      })
      done()
    })

    textInput.enter('hello, @handle')
  })

  it('emits close event when menu closed', function (done) {
    mention.on('check', function () {
      if (++counter === 3) {
        // Delay because this nees to happen after all
        // asynchronous actions resulting from enter
        // have completed:
        setTimeout(function () {
          assert.equal(checkSpy.callCount, 3)
          assert.equal(matchSpy.callCount, 1)
          assert.equal(noMatchSpy.callCount, 2)
          done()
        })
      }
    })

    textInput.enter('hello, @handle')
    textInput.enter(' more text')
    textInput.enter('.')
  })

  it('suggestion not detected for "hello, @handle |"', function (done) {
    mention.on('check', function () {
      if (++counter === 2) {
        setTimeout(function () {
          assert(matchSpy.notCalled)
          assert.equal(noMatchSpy.callCount, 2)
          assert.equal(checkSpy.callCount, 2)
          done()
        })
      }
    })

    textInput.enter('hello, @handle ')
    textInput.enter('and more text.')
  })

  it('inserts a replacement', function (done) {
    mention.on('match', function (match) {
      // This would be the result of a user interaction, so we'll
      // trigger it manually:
      setTimeout(function () {
        mention.replaceMatch(match, '@suggestedname')
      }, 10)
    })

    mention.on('replace', function (replacement) {
      var expected = 'hello, @suggestedname '
      assert.deepEqual(replacement, {
        text: expected,
        selectionRange: {
          start: expected.length,
          end: expected.length
        }
      })
      done()
    })

    textInput.enter('hello, @handle')
  })
})
