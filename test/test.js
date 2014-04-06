var test = require('tap').test;

var Series = require('../index.js');
var liquify = require('lib-stream-liquify')
var solidify = require('lib-stream-solidify')

test(function (t) {
  var series = new Series();
  series.addReadable(liquify("Hello World"));
  series.done()
  solidify(series).text(function (e, txt) {
    t.equal(txt.toString(), '"Hello World"')
    t.end()
  })
})

test(function (t) {
  var series = new Series();
  series.addReadable(liquify("Hello World"));
  series.addReadable(liquify("Goodbye World"));
  series.done()
  solidify(series).text(function (e, txt) {
    t.equal(txt.toString(), '"Hello World""Goodbye World"')
    t.end()
  })
})

test(function (t) {
  var series = new Series();
  solidify(series).text(function (e, txt) {
    t.equal(txt.toString(), '"Goodbye World"')
    t.end()
  })
  series.addReadable(liquify("Goodbye World"));
  series.done()
})

test(function (t) {
  var series = new Series();
  solidify(series).text(function (e, txt) {
    t.equal(txt.toString(), '"Hello World""Goodbye World"')
    t.end()
  })
  series.addReadable(liquify("Hello World"));
  series.addReadable(liquify("Goodbye World"));
  series.done()
})
