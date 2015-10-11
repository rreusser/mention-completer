/* global describe, it */
'use strict'

var assert = require('chai').assert
var replace = require('../lib/replace-match')

describe('replaceMatch', function () {
  it('replaces a match', function () {
    var replaced = replace('test @firstname more text', 6, 'firstname'.length, 'newname')
    assert.deepEqual(replaced, {
      text: 'test @newname  more text',
      selectionRange: {
        start: 14,
        end: 14
      }
    })
  })
})
