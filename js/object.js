// Generated by CoffeeScript 1.9.3

/*
PDFObject - converts JavaScript types into their corrisponding PDF types.
By Devon Govett
 */

(function() {
  var PDFObject, PDFReference;

  PDFObject = (function() {
    var escapable, escapableRe, pad, swapBytes;

    function PDFObject() {}

    pad = function(str, length) {
      return (Array(length + 1).join('0') + str).slice(-length);
    };

    escapableRe = /[\n\r\t\b\f\(\)\\]/g;

    escapable = {
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
      '\b': '\\b',
      '\f': '\\f',
      '\\': '\\\\',
      '(': '\\(',
      ')': '\\)'
    };

    swapBytes = function(buff) {
      var a, i, j, l, ref;
      l = buff.length;
      if (l & 0x01) {
        throw new Error("Buffer length must be even");
      } else {
        for (i = j = 0, ref = l - 1; j < ref; i = j += 2) {
          a = buff[i];
          buff[i] = buff[i + 1];
          buff[i + 1] = a;
        }
      }
      return buff;
    };

    PDFObject.convert = function(object) {
      var e, i, isUnicode, items, j, key, out, ref, string, val;
      if (typeof object === 'string') {
        return '/' + object;
      } else if (object instanceof String) {
        string = object.replace(escapableRe, function(c) {
          return escapable[c];
        });
        isUnicode = false;
        for (i = j = 0, ref = string.length; j < ref; i = j += 1) {
          if (string.charCodeAt(i) > 0x7f) {
            isUnicode = true;
            break;
          }
        }
        if (isUnicode) {
          string = swapBytes(new Buffer('\ufeff' + string, 'utf16le')).toString('binary');
        }
        return '(' + string + ')';
      } else if (Buffer.isBuffer(object)) {
        return '<' + object.toString('hex') + '>';
      } else if (object instanceof PDFReference) {
        return object.toString();
      } else if (object instanceof Date) {
        return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
      } else if (Array.isArray(object)) {
        items = ((function() {
          var k, len, results;
          results = [];
          for (k = 0, len = object.length; k < len; k++) {
            e = object[k];
            results.push(PDFObject.convert(e));
          }
          return results;
        })()).join(' ');
        return '[' + items + ']';
      } else if ({}.toString.call(object) === '[object Object]') {
        out = ['<<'];
        for (key in object) {
          val = object[key];
          out.push('/' + key + ' ' + PDFObject.convert(val));
        }
        out.push('>>');
        return out.join('\n');
      } else {
        return '' + object;
      }
    };

    return PDFObject;

  })();

  module.exports = PDFObject;

  PDFReference = require('./reference');

}).call(this);