"use strict";

var stream = require('stream');
var util = require('util');

function ReadableSeries(opts) {
  stream.Readable.call(this, opts);

  this._read_wait = -1;
  this._readable  = null;

  this._readables = [];
  this._active   = false;
}
util.inherits(ReadableSeries, stream.Readable);

function pushIfData(into, from, size) {
  var blob = from.read(size);

  // Filter null blobs, because pushing a null blob means
  // that the stream is done. This is a weird behavior, but
  // I imagine there is a rationale behind it.
  if (blob === null) {
    from.once('readable', onReadable);
  } else {
    into.push(blob);
  }

  function onReadable() {
    pushIfData(into, from, size);
  }
}

function pipeReadable(series, readable) {
  var self = series;
  var size = series._read_wait;

  // propertly end the connection
  readable.on('end', function () {
    startNext(series);
  });

  // TODO: not sure if this needs a guard or not
  pushIfData(series, readable);

  series._readable = readable;
}

function startNext(series) {
  if (series._readables.length === 0) {
    series._active = false;
    return;
  }

  var next = series._readables.shift();

  if (next === null) series.push(null);
  else pipeReadable(series, next);
}

ReadableSeries.prototype.addReadable = function (readable) {
  this._readables.push(readable);

  if (this._active) return;
  else this._active = true;

  startNext(this);
};

ReadableSeries.prototype.done = function () {
  this._readables.push(null);
};

ReadableSeries.prototype._read = function (size) {
  if (!this._readable) {
    this._read_wait = size;
  } else {
    pushIfData(this, this._readable);
  }
};

module.exports = function (opts) {
  return new ReadableSeries(opts);
};
