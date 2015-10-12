'use strict'

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var detectMatch = require('./lib/detect-match')
var computeReplacement = require('./lib/compute-replacement')

function MentionCompleter (options) {
  EventEmitter.call(this)

  this.patterns = options.patterns
  this.getSelectionRange = options.getSelectionRange
  this.setSelectionRange = options.setSelectionRange
  this.getValue = options.getValue
  this.setValue = options.setValue
  this.mostRecentMatch = null

  this.on('replace', function (replacement) {
    this._setValueAsync(replacement.text)
    this._setSelectionRangeAsync(replacement.selectionRange)
  })

  this.on('check', function (state) {
    this.mostRecentMatch = detectMatch(state.value, state.range.start, state.range.end, this.patterns)

    if (this.mostRecentMatch) {
      this.emit('match', match)
    } else {
      this.emit('nomatch')
    }
  }.bind(this))
}

inherits(MentionCompleter, EventEmitter)

MentionCompleter.prototype._error = function (msg) {
  this.emit('error', msg)
}

MentionCompleter.prototype._getSelectionRangeAsync = function (cb) {
  if (this.getSelectionRange) {
    this.getSelectionRange(cb)
  } else {
    this._error('Error: MentionCompleter: getSelectionRange( function(err,range) ) must be provided')
  }
}

MentionCompleter.prototype._setSelectionRangeAsync = function (range, cb) {
  if (this.setSelectionRange) {
    this.setSelectionRange(range, cb)
  }
}

MentionCompleter.prototype._getValueAsync = function (cb) {
  if (this.getValue) {
    this.getValue(cb)
  } else {
    this._error('Error: MentionCompleter: getValue( function(err,value) ) must be provided')
  }
}

MentionCompleter.prototype._setValueAsync = function (value) {
  if (this.setValue) {
    this.setValue(value)
  }
}

MentionCompleter.prototype.checkForMatch = function () {
  this._getSelectionRangeAsync(function (err, range) {
    if (err) {
      this._error('Error: MentionCompleter: failed to query selection range')
    } else {
      this._getValueAsync(function (err, value) {
        if (err) {
          this._error('Error: MentionCompleter: failed to query input value')
        } else {
          this.emit('check', {value: value, range: range})
        }
      }.bind(this))
    }
  }.bind(this))

  return this
}

MentionCompleter.prototype.replaceMatch = function (match, text) {
  if (match) {
    var replacement = computeReplacement(match.string, match.range.start, match.range.end, text)
    this.emit('replace', replacement)
  } else {
    this._error('Match is invalid:', match)
  }

  return this
}

module.exports = MentionCompleter
