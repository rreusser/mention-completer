'use strict'

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var CALLBACK_DELAY = 5

function TextInput (value) {
  EventEmitter.call(this)

  this.value = String(value || '')
  this.selectionStart = this.value.length
  this.selectionEnd = this.value.length
}

inherits(TextInput, EventEmitter)

TextInput.prototype.enter = function (text) {
  var start = this.value.substr(0, this.selectionStart)
  var end = this.value.substr(this.selectionEnd)
  this.value = start + text + end
  var l = start.length + text.length
  this.selectionStart = l
  this.selectionEnd = l
  this.emit('change', this.value)
}

TextInput.prototype.getSelectionRange = function (cb) {
  var range = {
    start: this.selectionStart,
    end: this.selectionEnd
  }
  if (cb) {
    setTimeout(function () {
      cb(null, range)
    }, CALLBACK_DELAY)
  } else {
    return range
  }
}

TextInput.prototype.setSelectionRange = function (range, cb) {
  var l = this.value.length
  this.selectionStart = Math.min(l, range.start)
  this.selectionEnd = Math.min(l, range.end)
  return this.getSelectionRange(function (range) {
    return range
  })
}

TextInput.prototype.getValue = function (cb) {
  if (cb) {
    setTimeout(function () {
      cb(null, this.value)
    }.bind(this), CALLBACK_DELAY)
  } else {
    return this.value
  }
}

module.exports = TextInput
