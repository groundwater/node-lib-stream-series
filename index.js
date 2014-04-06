"use strict";

var stream = require('stream');
var util = require('util');

function ReadableSeries(opts) {
  stream.Readable.call(this, opts);
  this._queue  = [];
  this._active = null;
}
util.inherits(ReadableSeries, stream.Readable);

function tryRead(series, readable, size) {
  var blob = readable.read(size);

  if (blob)
    series.push(blob);
}

function makeActive(series, readable) {
  if (readable === null) {
    return series.push(null);
  } else if (readable === undefined) {
    return;
  }
  series._active = readable;

  readable.on('readable', tryRead.bind(null, series, readable));
  readable.on('end', function () {
    delete series._active;
    makeActive(series, series._queue.shift());
  });

  tryRead(series, readable);
}

ReadableSeries.prototype.done = function () {
  this.addReadable(null);
};

ReadableSeries.prototype.addReadable = function (readable) {
  if (this._active)
    this._queue.push(readable);
  else
    makeActive(this, readable);
};

ReadableSeries.prototype._read = function (size) {
  if (this._active)
    tryRead(this, this._active, size);
};

module.exports = function (opts) {
  return new ReadableSeries(opts);
};
