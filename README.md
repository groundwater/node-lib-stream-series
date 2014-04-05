# stream series

> turn a sequential series of streams into a single stream

## install

```
npm install --save lib-stream-series
```

## usage

```javascript
var liquify = require('lib-stream-liquify');
var series = require('lib-stream-series')();

var obj = {
  name: 'bob',
  age: 32,
  hair: 'brown'
}

// add a readable stream ever second
setInterval(function () {
  series.addReadable(liquify(obj))
}, 1000);

// pipe a single stream out
series.pipe(process.stdout)
```

### ending a stream

The stream stays open until you call `series.done()`.
The stream will otherwise wait until a new readable is added.

## see also

- [lib-stream-liquify](https://npmjs.org/lib-stream-liquify)
- [lib-stream-solidify](https://npmjs.org/lib-stream-solidify)
