var test = require('tap').test;

var Series = require('../index.js');
var liquify = require('lib-stream-liquify')
var solidify = require('lib-stream-solidify')

test(function (t) {
  var series = new Series();
  setTimeout(function() {
    series.addReadable(liquify("Hello World"));
    series.done()
  }, 100)
  solidify(series).text(function (e, txt) {
    t.equal(txt.toString(), '"Hello World"')
    t.end()
  })
})

test(function (t) {
  var series = new Series();
  setTimeout(function() {
    series.addReadable(liquify("Hello World"));
  }, 100)
  setTimeout(function() {
    series.addReadable(liquify("Hello World"));
    series.done()
  }, 200)
  solidify(series).text(function (e, txt) {
    t.equal(txt.toString(), '"Hello World""Hello World"')
    t.end()
  })
})

test(function (t) {
  var series = new Series();
  series.addReadable(liquify("Hello World"));
  setTimeout(function() {
    series.addReadable(liquify("Hello World"));
    series.done()
  }, 100)
  solidify(series).text(function (e, txt) {
    t.equal(txt.toString(), '"Hello World""Hello World"')
    t.end()
  })
})

test(function (t) {
  var series = new Series();
  var ok = false;
  series.addReadable(liquify("Hello World"));
  setTimeout(function() {
    ok = true;
    series.done();
  }, 100)
  solidify(series).text(function (e, txt) {
    t.ok(ok);
    t.end()
  })
})
