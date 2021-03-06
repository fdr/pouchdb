// BEGIN Math.uuid.js

(function( window, undefined ) {
  
/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * 
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

  Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
  // by minimizing calls to random()
  Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

  // A more compact, but less performant, RFC4122v4 solution:
  Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
  };
})();

// END Math.uuid.js

/**
*
*  MD5 (Message-Digest Algorithm)
*
*  For original source see http://www.webtoolkit.info/
*  Download: 15.02.2009 from http://www.webtoolkit.info/javascript-md5.html
*
*  Licensed under CC-BY 2.0 License
*  (http://creativecommons.org/licenses/by/2.0/uk/)
*
**/

var Crypto = {};
(function() {
  Crypto.MD5 = function(string) {

    function RotateLeft(lValue, iShiftBits) {
      return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
      var lX4,lY4,lX8,lY8,lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
          return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1=lMessageLength + 8;
      var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
      var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
      var lWordArray=Array(lNumberOfWords-1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while ( lByteCount < lMessageLength ) {
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
      lWordArray[lNumberOfWords-2] = lMessageLength<<3;
      lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
      return lWordArray;
    };

    function WordToHex(lValue) {
      var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
      for (lCount = 0;lCount<=3;lCount++) {
        lByte = (lValue>>>(lCount*8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
      }
      return WordToHexValue;
    };

    //**	function Utf8Encode(string) removed. Aready defined in pidcrypt_utils.js

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    //	string = Utf8Encode(string); #function call removed

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
      AA=a; BB=b; CC=c; DD=d;
      a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
      d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
      c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
      b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
      a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
      d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
      c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
      b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
      a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
      d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
      c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
      b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
      a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
      d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
      c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
      b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
      a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
      d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
      c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
      b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
      a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
      d=GG(d,a,b,c,x[k+10],S22,0x2441453);
      c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
      b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
      a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
      d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
      c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
      b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
      a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
      d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
      c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
      b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
      a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
      d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
      c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
      b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
      a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
      d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
      c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
      b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
      a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
      d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
      c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
      b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
      a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
      d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
      c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
      b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
      a=II(a,b,c,d,x[k+0], S41,0xF4292244);
      d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
      c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
      b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
      a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
      d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
      c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
      b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
      a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
      d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
      c=II(c,d,a,b,x[k+6], S43,0xA3014314);
      b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
      a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
      d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
      c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
      b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
      a=AddUnsigned(a,AA);
      b=AddUnsigned(b,BB);
      c=AddUnsigned(c,CC);
      d=AddUnsigned(d,DD);
    }
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
    return temp.toLowerCase();
  }
})();

// END Crypto.md5.js

// Begin request *requires jQuery*

var ajax = function (options, callback) {
  options.success = function (obj) {
    callback(null, obj);
  }
  options.error = function (err) {
    if (err) callback(err);
    else callback(true);
  }
  options.dataType = 'json';
  options.contentType = 'application/json'
  $.ajax(options)
}

// End request

// The spec is still in flux.
// While most of the IDB behaviors match between implementations a lot of the names still differ.
// This section tries to normalize the different objects & methods.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
window.IDBKeyRange = window.IDBKeyRange || window.mozIDBKeyRange || window.webkitIDBKeyRange;
window.IDBTransaction = window.IDBTransaction || window.mozIDBTransaction || window.webkitIDBTransaction;
IDBKeyRange.leftBound = IDBKeyRange.leftBound || IDBKeyRange.lowerBound;
IDBKeyRange.rightBound = IDBKeyRange.rightBound || IDBKeyRange.upperBound;

var getObjectStore = function  (db, name, keypath, callback, errBack) {
  if (db.objectStoreNames.contains(name)) {
    callback(db.transaction(name).objectStore(name));
  } else {
    var version_request = db.setVersion('1');
    version_request.onsuccess = function(event) {

      var request = db.createObjectStore(name, {keyPath: keypath});
      request.onsuccess = function (e) {
        callback(e.target.result)
      }
      request.onerror = function (err) {
        if (errBack) errBack(err);
      }
    };
  }
}

var getNewSequence = function (transaction, couch, callback) {
  if (couch.seq === undefined) couch.seq = 0;
  var range = IDBKeyRange.leftBound(couch.seq);
  request = transaction.objectStore("sequence-index").openCursor(range);
  var seq = couch.seq;
  request.onsuccess = function (e) {
    var cursor = e.target.result;
    if (!cursor) {
      callback(seq + 1);
      return;
    }
    cursor.continue();
    
  }
  request.onerror = function (error) {
    // Sequence index is empty.
    callback(1);
  }
}

var getNewRevision = function (doc, oldRevPos) {
  oldRevPos = (oldRevPos && oldRevPos.split('-')) || [0, ''];
  var oldPos = Number(oldRevPos[0]);
  var oldRev = oldRevPos[1];

  var newPos = oldPos + 1;

  // First clear metadata from the doc, leaving only the "body".
  var metadata = {};
  for (var key in doc) {
    if (key && key[0] == '_') {
      metadata[key] = doc[key];
      delete(doc[key]);
    }
  }

  // TODO: make this match CouchDB using BERTS stuff
  var newRev = Crypto.MD5(JSON.stringify(doc));

  // Restore the doc so no one hates us
  for (var key in metadata) {
    doc[key] = metadata[key];
  }

  return [newPos, newRev].join('-');
}

var viewQuery = function (objectStore, options) {
  var range;
  var request;
  if (options.startKey && options.endKey) {
    range = IDBKeyRange.bound(options.startKey, options.endKey);
  } else if (options.startKey) {
    if (options.descending) { range = IDBKeyRange.rightBound(options.startKey); }
    else { range = IDBKeyRange.leftBound(options.startKey); }
  } else if (options.endKey) {
    if (options.descending) { range = IDBKeyRange.leftBound(options.endKey); }
    else { range = range = IDBKeyRange.rightBound(options.endKey); }
  }
  if (options.descending) {
    request = objectStore.openCursor(range, "left");
  } else {
    request = objectStore.openCursor(range);
  }
  var results = [];
  request.onsuccess = function (cursor) {
    if (!cursor) {
      if (options.success) options.success(results);
    } else {
      if (options.row) options.row(cursor.target.result.value);
      if (options.success) results.push(cursor.target.results.value);
    }
  }
  request.onerror = function (error) {
    if (options.error) options.error(error);
  }
}

var makeCouch = function (db, documentStore, sequenceIndex, opts) {
  // Now we create the actual CouchDB
  var couch = {docToSeq:{}};
  
  couch.get = function (_id, options, transaction) {
    if (!transaction) transaction = db.transaction('document-store');
    var request = transaction.objectStore('document-store').openCursor(IDBKeyRange.only(_id));
    request.onsuccess = function (cursor) {
      if (!cursor.target.result) {if (options.error) options.error({error:'Document does not exist'})}
      else { 
        var doc = cursor.target.result.value;
        if (doc._deleted) {
          options.error({error:"Document has been deleted."})
        } else {
          options.success(doc); 
        }
      }
    }
    request.onerror = function (error) {
      if (options.error) options.error(error);
    }
  }
  
  couch.remove = function (doc, options) {
    doc._deleted = true;
    return couch.post(doc, options);
  }
  
  couch.post = function (doc, options, transaction) {
    if (!doc._id) doc._id = Math.uuid();
    if (typeof options.newEdits === 'undefined') options.newEdits = true;
    if (couch.docToSeq[doc._id]) {
      if (!doc._rev) {
        options.error({code:413, message:"Update conflict, no revision information"});
      }
      if (!transaction) {
        transaction = db.transaction(["document-store", "sequence-index"], IDBTransaction.READ_WRITE);
        var bulk = false;
      } else {var bulk = true}

      var request = transaction.objectStore("document-store")
        .openCursor(IDBKeyRange.only(doc._id));
      request.onsuccess = function (event) {
        var prevDocCursor = event.target.result;
        var prev = event.target.result.value;
        if ((prev._rev !== doc._rev && !prev._deleted) && options.newEdits) {
          options.error({code:413, error:"Conflict error, revision does not match."});
          return;
        }
        getNewSequence(transaction, couch, function (seq) {
          if (!options.newEdits) {
            var rev = getNewRevision(doc, prev._rev);
          } else {
            var rev = doc._rev;
          }
           
          var request = transaction.objectStore("sequence-index")
            .openCursor(IDBKeyRange.only(couch.docToSeq[doc._id]));
          request.onsuccess = function (event) {
            var oldSequence = event.target.result.value;
            if (oldSequence.changes) {
              oldSequence.changes[event.target.result.key] = prev
            } else {
              oldSequence.changes = {};
              oldSequence.changes[event.target.result.key] = prev;
            }
            transaction.objectStore("sequence-index").add({seq:seq, id:doc._id, rev:rev, 
                                                           changes:oldSequence.changes});
            event.target.source.delete(event.target.result.key);
            doc._rev = rev;
            prevDocCursor.update(doc);
            if (!bulk) {
              transaction.oncomplete = function () {
                couch.docToSeq[doc._id] = seq;
                couch.seq = seq;
                if (options.success) options.success({id:doc._id, rev:doc._rev, seq:seq, doc:doc});
                couch.changes.emit({id:doc._id, rev:doc._rev, seq:seq, doc:doc});
              }
            } else {
              options.success({id:doc._id, rev:doc._rev, seq:seq, doc:doc})
            }
            
          }
          request.onerror = function (err) {
            if (options.error) options.error("Could not open sequence index")
          }
        })
      }
      request.onerror = function (err) {
        if (options.error) options.error("Could not find document in object store.")
      }
    } else {
      // no existing document information
      if (!transaction) {
        transaction = db.transaction(["document-store", "sequence-index"], IDBTransaction.READ_WRITE);
        var bulk = false;
      } else {var bulk = true}
      
      getNewSequence(transaction, couch, function (seq) {
        doc._rev = getNewRevision(doc);
        transaction.objectStore("sequence-index").add({seq:seq, id:doc._id, rev:doc._rev});
        transaction.objectStore("document-store").add(doc);
        if (!bulk) {
          transaction.oncomplete = function () {
            couch.docToSeq[doc._id] = seq;
            couch.seq = seq;
            if (options.success) options.success({id:doc._id, rev:doc._rev, seq:seq, doc:doc});
            couch.changes.emit({id:doc._id, rev:doc._rev, seq:seq, doc:doc});
          }
        } else {
          options.success({id:doc._id, rev:doc._rev, seq:seq, doc:doc});
        }
      })
    }
  }
  
  couch.changes = function (options) {
    if (!options.seq) options.seq = 0;
    var transaction = db.transaction(["document-store", "sequence-index"]);
    var request = transaction.objectStore('sequence-index')
      .openCursor(IDBKeyRange.leftBound(options.seq));
    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (!cursor) {
        if (options.continuous) {
          couch.changes.addListener(options.onChange);
        }
        if (options.complete) {
          options.complete();
        }
      } else {
        var change_ = cursor.value;
        transaction.objectStore('document-store')
          .openCursor(IDBKeyRange.only(change_.id))
          .onsuccess = function (event) {
            var c = {id:change_.id, seq:change_.seq, changes:change_.changes, doc:event.value};
            options.onChange(c);
            cursor.continue();
          }
      }
    }
    request.onerror = function (error) {
      // Cursor is out of range
      // NOTE: What should we do with a sequence that is too high?
      if (options.continuous) {
        couch.changes.addListener(options.onChange);
      }
      if (options.complete) {
        options.complete();
      }
    }
  }
  
  couch.bulk = function (docs, options) {
    var transaction = db.transaction(["document-store", "sequence-index"], IDBTransaction.READ_WRITE);
    var oldSeq = couch.seq;
    var infos = []
    var i = 0;
    var doWrite = function () {
      if (i >= docs.length) {                
        transaction.oncomplete = function () {
          infos.forEach(function (info) {
            if (!info.error) couch.docToSeq[info.id] = info.seq
          })
          options.success(infos);
        }
        return;
      }
      couch.post(docs[i], {
        success : function (info) {
          couch.seq += 1;
          i += 1;
          infos.push(info);
          doWrite();
        }
        , error : function (error) {
          if (options.ensureFullCommit) {
            transaction.abort();
            couch.seq = oldSeq;
            options.error(error);
            return;
          }
          infos.push({id:docs[i]._id, error:"conflict", reason:error});
          i += 1;
          doWrite();
        }
      }, transaction);
      
    };
    doWrite();
  }
  
  couch.changes.listeners = [];
  couch.changes.emit = function () {
    var a = arguments;
    couch.changes.listeners.forEach(function (l) {l.apply(l, a)});
  }
  couch.changes.addListener = function (l) { couch.changes.listeners.push(l); }
  
  couch.replicate = {}
  couch.replicate.from = function (options) {
    var c = []; // Change list
    if (options.url[options.url.length - 1] !== '/') options.url += '/';
    ajax({url:options.url+'_changes?style=all_docs&include_docs=true'}, function (e, resp) {
      if (e) {
        if (options.error) options.error(e);
      }
      var transaction = db.transaction(["document-store", "sequence-index"], IDBTransaction.READ_WRITE);
      var pending = resp.results.length;
      resp.results.forEach(function (r) {
        
        var writeDoc = function (r) {
          couch.post(r.doc, 
            { newEdits:false
            , success: function (changeset) {
                pending--;
                c.changeset = changeset;
                c.push(r);
                if (pending === 0) options.success(c);
              } 
            , error: function (e) {
                pending--;
                r.error = e;
                c.push(r);
                if (pending === 0) options.success(c);
              }
            }
          , transaction
          );
        }
        couch.get(r.id, 
          { success: function (doc) {
              // The document exists
              if (doc._rev === r.changes[0].rev) return; // Do nothing if we already have the change
              else {
                var oldseq = parseInt(doc._rev.split('-')[0])
                  , newseq = parseInt(r.changes[0].rev.split('-')[0])
                  ;
                if (oldseq > newseq) {
                  return; // Should we do something nicer here?
                } else {
                  writeDoc(r);
                }
              }
            }
          , error : function (e) {
              // doc does not exist, write it
              writeDoc(r);
            }
          }, transaction);
      })
    })
  }
  couch.replicate.to = function (url) {
    
  }
  
  // This whole sequence cache is going to break on multi-window :(
  var request = sequenceIndex.openCursor();
  var seq;
  request.onsuccess = function (e) {
    // Handle iterating on the sequence index to create the reverse map and validate last-seq
    var cursor = e.target.result;
    if (!cursor) {
      couch.seq = seq;
      opts.success(couch)
      return;
    }
    seq = cursor.key
    couch.docToSeq[cursor.value['id']] = seq;
    cursor.continue();
  }
  request.onerror = function (event) {
    opts.error({error:"Couldn't iterate over the by-sequence index."});
  }
}

window.createCouch = function (options, cb) {
  if (cb) options.success = cb;
  if (!options.name) throw "name attribute is required"
  var request = indexedDB.open(options.name);
  // Failure handler on getting Database
  request.onerror = function(error) {
    if (options.error) options.error("Failed to open database.");
  }

  request.onsuccess = function(event) {
    var db = event.target.result;
    getObjectStore(db, 'document-store', '_id', function (documentStore) {
      getObjectStore(db, 'sequence-index', 'seq', function (sequenceIndex) {
        makeCouch(db, documentStore, sequenceIndex, options);
      }, function () {if (options.error) {options.error('Could not open sequence index.')}})
    }, function () {if (options.error) {options.error('Could not open document store.')}})
  }
}

window.removeCouch = function (options) {
  var request = indexedDB.open(options.name);
  request.onsuccess = function (event) {
    var db = event.target.result;
    var successes = 0;
    var l = db.objectStoreNames.length;
    for (var i=0;i<db.objectStoreNames.length;i+=1) {
      db.objectStoreNames[i]
      var version_request = db.setVersion('1');
      version_request.onsuccess = function(event) {
        var r = db.deleteObjectStore(db.objectStoreNames[i]);
      
        r.onsuccess = function (event) {
          successes += 1; 
          if (successes === l) options.success();
        }
        r.onerror = function () { options.error("Failed to remove "+db.objectStoreNames[i]); }
      }
    }
  } 
  request.onerror = function () {
    options.error("No such database "+options.name);
  }
}

})(window);
