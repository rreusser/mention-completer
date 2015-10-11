# mention-completer

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

> A platform-independent library for managing mention-like completion

## Introduction

This library implements an `EventEmitter` object which uses provided regexes to detect and replace @username- or #hashtag-like patterns in a (platform-independent) input field. The entity it interacts with must only have a value, a selection range, and presumably its own UI with which the user may select a completion.

It exists because I found myself working with React Native, implementing the gory details of mention detection and replacement. There's no shortage of HTML-based UI widgets that implement mention detection and completion, but all I needed was a platform-independent utility that would handle the dirty work, leaving me free to hook up the rest trivially.

## Installation

```
$ npm install mention-completer
```

## Example

For a live HTML-based example, see [here](http://rreusser.github.io/mention-completer/example)

![HTML Screenshot](example/screenshot.png')

```javascript
var MentionCompleter = require('mention-completer')

var completer = new MentionCompleter({
  patterns: { handle: /(@[\w]+)\b/, hashtag: /(\#[\w]+\b/ },
  getSelectionRange: ...,
  setSelectionRange: ...,
  getValue: ...,
  setValue: ...
})
  
completer
  .on('match', function(match) {
    // Trigger a remote API lookup and expose a UI element here, perhaps.
    // Returns, e.g.:
    //     match = { value:'@usern', type:'handle', range:{start: 7, end: 13} }
  })
  .on('nomatch', function() {
    // Hook into this event to close the menu
  })

// Trigger a check when an input is modified:
$('#my-input-field').on('keyup', completer.checkForMatch.bind(completer) )

// 1) User types "hello, @usern"
//
// 2) Your code exposes a UI completion selector and calls 'replaceMatch'
//    based on user input, e.g.:
//
//        completer.replaceMatch( match, '@username' )
//
// 3) If setValue and setSelectionRange are provided, they are triggered
//    automatically with the inserted match. Otherwise you may use the
//    'replace' event to trigger them manually.
```

## API

### Constructor

#### `MentionCompleter(options)`

Constructor for a new mention completer. Note that all get/set callbacks function in receive a callback with which they must return their result using the format `callback(err, result)`. Option parameters are:
 - `patterns`: An associative array of pattern names and regexes. Recommended patterns are:
    
```javascript
patterns: {
  handle: /(@[\w]+)\b/,
  hashtag: /(#[\w]+)\b/,
}
```

 - **`getValue`**: `function( callback(err,value) )`: A callback that queries the current text field value. It may execute the callback either synchronously or asynchronously with its resulting value.

 - **`setValue`**: `function( value )` (optional): A callback that inserts the result after replacement. If provided, is triggered automatically on each `replace` event.

 - **`getSelectionRange`**: `function( callback(err, {start, end}) )`: A callback that queries the selection range and returns a range with format `{start, end}`.

 - **`setSelectionRange`**: `function( {start, end} )` (optional): A callback that sets the selection range. If provided, is automatically called on each `replace` event.

### Methods

#### `.checkForMatch()`
Check for a completable match. Uses `getSelectionRange` and `getValue` to query the range and value. Emits a `match` event if a match is present and `nomatch` otherwise. You must hook this up automatically. A simple case is:

```javascript
$('#input').on('change', completer.checkForMatch.bind(completer) )
```

#### `.replaceMatch( {string, range: {start,end}}, text )`
Replaces a match with `text`. The format of the first argument matches the value provided with the `match` event. Note that for consistency, if `replaceMatch` is triggered before a check resulting from new input completes, the value of the text field at the time of the check will be used. In reality, the delay to get the value and selection range is expected to be extremely short (synchronous or very nearly so) compared to the time between input events (100ms?).  A simple use-case would be:

```javascript
var currentMatch

mention.on('match', function(match) {
  currentMatch = match
})

// Result of user action:
mention.replaceMatch(currentMatch, '@suggestedname')
```

#### `.on(eventName, callback(data))`
Along with all other `EventEmitter` methods, `on` may be used to hook into any event. Note that these events are used internally so that `.off` may break functionality unless only a specific callback is detached.

### Events
- **`error`**: Triggered when something goes wrong. `data` contains a string message.

- **`match`**: Triggered when a completable match is detected. `data` contains `{string, value, type, range:{start,end}}` where `string` is the matched string, `value` is the match captured by the regex, type is the key of the pattern that was matched, and `range` contains the integer range of `value` within `string`.

- **`check`**: Triggered when a match is found. `data` contains `{value, range:{start,end}}` where `value` is the queried value of the input and `range` is the queried selection range.

- **`replace`**: Triggered when `replaceWith` is explicitly called. `data` contains the computed replacement, `{text, selectionRange:{start,end}}` where `text` contains the text with replacement, and `selectionRange` contains the post-replacement selection range. If provided, `setSelectionRange` and `setValue` will update the input value.

## Testing

This module uses Standard JS style. To test, run

```bash
$ npm run test
```

## Building

To bundle a browserified (output in `dist/bundle.js`), run

```bash
$ npm install -g browserify
$ npm run bundle
```

## License

ISC License, (c) 2015 Ricky Reusser
