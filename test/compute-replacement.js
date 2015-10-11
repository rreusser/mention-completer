/* global describe, it */
'use strict'

var assert = require('chai').assert
var computeReplacement = require('../lib/compute-replacement')

describe('computeReplacement', function () {
  it('replaces a match', function () {
    var replaced = computeReplacement('test @firstname more text', 6, 6 + 'firstname'.length, 'newname')
    assert.deepEqual(replaced, {
      text: 'test @newname  more text',
      selectionRange: {
        start: 14,
        end: 14
      }
    })
  })
})
