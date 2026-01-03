(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MedosWidgets = {}));
})(this, (function (exports) { 'use strict';

  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }

  // utils is a library of generic helper functions non-specific to axios

  const {toString} = Object.prototype;
  const {getPrototypeOf} = Object;
  const {iterator, toStringTag} = Symbol;

  const kindOf = (cache => thing => {
      const str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(Object.create(null));

  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type
  };

  const typeOfTest = type => thing => typeof thing === type;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   *
   * @returns {boolean} True if value is an Array, otherwise false
   */
  const {isArray} = Array;

  /**
   * Determine if a value is undefined
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  const isUndefined = typeOfTest('undefined');

  /**
   * Determine if a value is a Buffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  const isArrayBuffer = kindOfTest('ArrayBuffer');


  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    let result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a String, otherwise false
   */
  const isString = typeOfTest('string');

  /**
   * Determine if a value is a Function
   *
   * @param {*} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  const isFunction$1 = typeOfTest('function');

  /**
   * Determine if a value is a Number
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Number, otherwise false
   */
  const isNumber = typeOfTest('number');

  /**
   * Determine if a value is an Object
   *
   * @param {*} thing The value to test
   *
   * @returns {boolean} True if value is an Object, otherwise false
   */
  const isObject = (thing) => thing !== null && typeof thing === 'object';

  /**
   * Determine if a value is a Boolean
   *
   * @param {*} thing The value to test
   * @returns {boolean} True if value is a Boolean, otherwise false
   */
  const isBoolean = thing => thing === true || thing === false;

  /**
   * Determine if a value is a plain Object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a plain Object, otherwise false
   */
  const isPlainObject = (val) => {
    if (kindOf(val) !== 'object') {
      return false;
    }

    const prototype = getPrototypeOf(val);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
  };

  /**
   * Determine if a value is an empty object (safely handles Buffers)
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is an empty object, otherwise false
   */
  const isEmptyObject = (val) => {
    // Early return for non-objects or Buffers to prevent RangeError
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }

    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      // Fallback for any other objects that might cause RangeError with Object.keys()
      return false;
    }
  };

  /**
   * Determine if a value is a Date
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Date, otherwise false
   */
  const isDate = kindOfTest('Date');

  /**
   * Determine if a value is a File
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a File, otherwise false
   */
  const isFile = kindOfTest('File');

  /**
   * Determine if a value is a Blob
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  const isBlob = kindOfTest('Blob');

  /**
   * Determine if a value is a FileList
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a File, otherwise false
   */
  const isFileList = kindOfTest('FileList');

  /**
   * Determine if a value is a Stream
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  const isStream = (val) => isObject(val) && isFunction$1(val.pipe);

  /**
   * Determine if a value is a FormData
   *
   * @param {*} thing The value to test
   *
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  const isFormData = (thing) => {
    let kind;
    return thing && (
      (typeof FormData === 'function' && thing instanceof FormData) || (
        isFunction$1(thing.append) && (
          (kind = kindOf(thing)) === 'formdata' ||
          // detect form-data instance
          (kind === 'object' && isFunction$1(thing.toString) && thing.toString() === '[object FormData]')
        )
      )
    )
  };

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  const isURLSearchParams = kindOfTest('URLSearchParams');

  const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   *
   * @returns {String} The String freed of excess whitespace
   */
  const trim = (str) => str.trim ?
    str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   *
   * @param {Boolean} [allOwnKeys = false]
   * @returns {any}
   */
  function forEach(obj, fn, {allOwnKeys = false} = {}) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    let i;
    let l;

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Buffer check
      if (isBuffer(obj)) {
        return;
      }

      // Iterate over object keys
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;

      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }

  function findKey(obj, key) {
    if (isBuffer(obj)){
      return null;
    }

    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }

  const _global = (() => {
    /*eslint no-undef:0*/
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
  })();

  const isContextDefined = (context) => !isUndefined(context) && context !== _global;

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   *
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    const {caseless, skipUndefined} = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result[targetKey] = val;
      }
    };

    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   *
   * @param {Boolean} [allOwnKeys]
   * @returns {Object} The resulting value of object a
   */
  const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction$1(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, {allOwnKeys});
    return a;
  };

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   *
   * @returns {string} content value without BOM
   */
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  };

  /**
   * Inherit the prototype methods from one constructor into another
   * @param {function} constructor
   * @param {function} superConstructor
   * @param {object} [props]
   * @param {object} [descriptors]
   *
   * @returns {void}
   */
  const inherits = (constructor, superConstructor, props, descriptors) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, 'super', {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };

  /**
   * Resolve object with deep prototype chain to a flat object
   * @param {Object} sourceObj source object
   * @param {Object} [destObj]
   * @param {Function|Boolean} [filter]
   * @param {Function} [propFilter]
   *
   * @returns {Object}
   */
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};

    destObj = destObj || {};
    // eslint-disable-next-line no-eq-null,eqeqeq
    if (sourceObj == null) return destObj;

    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

    return destObj;
  };

  /**
   * Determines whether a string ends with the characters of a specified string
   *
   * @param {String} str
   * @param {String} searchString
   * @param {Number} [position= 0]
   *
   * @returns {boolean}
   */
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === undefined || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };


  /**
   * Returns new array from array like object or null if failed
   *
   * @param {*} [thing]
   *
   * @returns {?Array}
   */
  const toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };

  /**
   * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
   * thing passed in is an instance of Uint8Array
   *
   * @param {TypedArray}
   *
   * @returns {Array}
   */
  // eslint-disable-next-line func-names
  const isTypedArray = (TypedArray => {
    // eslint-disable-next-line func-names
    return thing => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

  /**
   * For each entry in the object, call the function with the key and value.
   *
   * @param {Object<any, any>} obj - The object to iterate over.
   * @param {Function} fn - The function to call for each entry.
   *
   * @returns {void}
   */
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[iterator];

    const _iterator = generator.call(obj);

    let result;

    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };

  /**
   * It takes a regular expression and a string, and returns an array of all the matches
   *
   * @param {string} regExp - The regular expression to match against.
   * @param {string} str - The string to search.
   *
   * @returns {Array<boolean>}
   */
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];

    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }

    return arr;
  };

  /* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
  const isHTMLForm = kindOfTest('HTMLFormElement');

  const toCamelCase = str => {
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };

  /* Creating a function that will check if an object has a property. */
  const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

  /**
   * Determine if a value is a RegExp object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a RegExp object, otherwise false
   */
  const isRegExp = kindOfTest('RegExp');

  const reduceDescriptors = (obj, reducer) => {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};

    forEach(descriptors, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });

    Object.defineProperties(obj, reducedDescriptors);
  };

  /**
   * Makes all methods read-only
   * @param {Object} obj
   */

  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      // skip restricted props in strict mode
      if (isFunction$1(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
        return false;
      }

      const value = obj[name];

      if (!isFunction$1(value)) return;

      descriptor.enumerable = false;

      if ('writable' in descriptor) {
        descriptor.writable = false;
        return;
      }

      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error('Can not rewrite read-only method \'' + name + '\'');
        };
      }
    });
  };

  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};

    const define = (arr) => {
      arr.forEach(value => {
        obj[value] = true;
      });
    };

    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

    return obj;
  };

  const noop = () => {};

  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };



  /**
   * If the thing is a FormData object, return true, otherwise return false.
   *
   * @param {unknown} thing - The thing to check.
   *
   * @returns {boolean}
   */
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
  }

  const toJSONObject = (obj) => {
    const stack = new Array(10);

    const visit = (source, i) => {

      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }

        //Buffer check
        if (isBuffer(source)) {
          return source;
        }

        if(!('toJSON' in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};

          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });

          stack[i] = undefined;

          return target;
        }
      }

      return source;
    };

    return visit(obj, 0);
  };

  const isAsyncFn = kindOfTest('AsyncFunction');

  const isThenable = (thing) =>
    thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);

  // original code
  // https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }

    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({source, data}) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);

      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      }
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === 'function',
    isFunction$1(_global.postMessage)
  );

  const asap = typeof queueMicrotask !== 'undefined' ?
    queueMicrotask.bind(_global) : ( _setImmediate);

  // *********************


  const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);


  var utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction: isFunction$1,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [config] The config.
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   *
   * @returns {Error} The created error.
   */
  function AxiosError$1(message, code, config, request, response) {
    Error.call(this);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }

    this.message = message;
    this.name = 'AxiosError';
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }

  utils$1.inherits(AxiosError$1, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });

  const prototype$1 = AxiosError$1.prototype;
  const descriptors = {};

  [
    'ERR_BAD_OPTION_VALUE',
    'ERR_BAD_OPTION',
    'ECONNABORTED',
    'ETIMEDOUT',
    'ERR_NETWORK',
    'ERR_FR_TOO_MANY_REDIRECTS',
    'ERR_DEPRECATED',
    'ERR_BAD_RESPONSE',
    'ERR_BAD_REQUEST',
    'ERR_CANCELED',
    'ERR_NOT_SUPPORT',
    'ERR_INVALID_URL'
  // eslint-disable-next-line func-names
  ].forEach(code => {
    descriptors[code] = {value: code};
  });

  Object.defineProperties(AxiosError$1, descriptors);
  Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

  // eslint-disable-next-line func-names
  AxiosError$1.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);

    utils$1.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, prop => {
      return prop !== 'isAxiosError';
    });

    const msg = error && error.message ? error.message : 'Error';

    // Prefer explicit code; otherwise copy the low-level error's code (e.g. ECONNREFUSED)
    const errCode = code == null && error ? error.code : code;
    AxiosError$1.call(axiosError, msg, errCode, config, request, response);

    // Chain the original error on the standard field; non-enumerable to avoid JSON noise
    if (error && axiosError.cause == null) {
      Object.defineProperty(axiosError, 'cause', { value: error, configurable: true });
    }

    axiosError.name = (error && error.name) || 'Error';

    customProps && Object.assign(axiosError, customProps);

    return axiosError;
  };

  // eslint-disable-next-line strict
  var httpAdapter = null;

  /**
   * Determines if the given thing is a array or js object.
   *
   * @param {string} thing - The object or array to be visited.
   *
   * @returns {boolean}
   */
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }

  /**
   * It removes the brackets from the end of a string
   *
   * @param {string} key - The key of the parameter.
   *
   * @returns {string} the key without the brackets.
   */
  function removeBrackets(key) {
    return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
  }

  /**
   * It takes a path, a key, and a boolean, and returns a string
   *
   * @param {string} path - The path to the current key.
   * @param {string} key - The key of the current object being iterated over.
   * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
   *
   * @returns {string} The path to the current key.
   */
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      // eslint-disable-next-line no-param-reassign
      token = removeBrackets(token);
      return !dots && i ? '[' + token + ']' : token;
    }).join(dots ? '.' : '');
  }

  /**
   * If the array is an array and none of its elements are visitable, then it's a flat array.
   *
   * @param {Array<any>} arr - The array to check
   *
   * @returns {boolean}
   */
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }

  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });

  /**
   * Convert a data object to FormData
   *
   * @param {Object} obj
   * @param {?Object} [formData]
   * @param {?Object} [options]
   * @param {Function} [options.visitor]
   * @param {Boolean} [options.metaTokens = true]
   * @param {Boolean} [options.dots = false]
   * @param {?Boolean} [options.indexes = false]
   *
   * @returns {Object}
   **/

  /**
   * It converts an object into a FormData object
   *
   * @param {Object<any, any>} obj - The object to convert to form data.
   * @param {string} formData - The FormData object to append to.
   * @param {Object<string, any>} options
   *
   * @returns
   */
  function toFormData$1(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError('target must be an object');
    }

    // eslint-disable-next-line no-param-reassign
    formData = formData || new (FormData)();

    // eslint-disable-next-line no-param-reassign
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      return !utils$1.isUndefined(source[option]);
    });

    const metaTokens = options.metaTokens;
    // eslint-disable-next-line no-use-before-define
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

    if (!utils$1.isFunction(visitor)) {
      throw new TypeError('visitor must be a function');
    }

    function convertValue(value) {
      if (value === null) return '';

      if (utils$1.isDate(value)) {
        return value.toISOString();
      }

      if (utils$1.isBoolean(value)) {
        return value.toString();
      }

      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError$1('Blob is not supported. Use a Buffer instead.');
      }

      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
      }

      return value;
    }

    /**
     * Default visitor.
     *
     * @param {*} value
     * @param {String|Number} key
     * @param {Array<String|Number>} path
     * @this {FormData}
     *
     * @returns {boolean} return true to visit the each prop of the value recursively
     */
    function defaultVisitor(value, key, path) {
      let arr = value;

      if (value && !path && typeof value === 'object') {
        if (utils$1.endsWith(key, '{}')) {
          // eslint-disable-next-line no-param-reassign
          key = metaTokens ? key : key.slice(0, -2);
          // eslint-disable-next-line no-param-reassign
          value = JSON.stringify(value);
        } else if (
          (utils$1.isArray(value) && isFlatArray(value)) ||
          ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
          )) {
          // eslint-disable-next-line no-param-reassign
          key = removeBrackets(key);

          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
              convertValue(el)
            );
          });
          return false;
        }
      }

      if (isVisitable(value)) {
        return true;
      }

      formData.append(renderKey(path, key, dots), convertValue(value));

      return false;
    }

    const stack = [];

    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });

    function build(value, path) {
      if (utils$1.isUndefined(value)) return;

      if (stack.indexOf(value) !== -1) {
        throw Error('Circular reference detected in ' + path.join('.'));
      }

      stack.push(value);

      utils$1.forEach(value, function each(el, key) {
        const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
        );

        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });

      stack.pop();
    }

    if (!utils$1.isObject(obj)) {
      throw new TypeError('data must be an object');
    }

    build(obj);

    return formData;
  }

  /**
   * It encodes a string by replacing all characters that are not in the unreserved set with
   * their percent-encoded equivalents
   *
   * @param {string} str - The string to encode.
   *
   * @returns {string} The encoded string.
   */
  function encode$1(str) {
    const charMap = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }

  /**
   * It takes a params object and converts it to a FormData object
   *
   * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
   * @param {Object<string, any>} options - The options object passed to the Axios constructor.
   *
   * @returns {void}
   */
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];

    params && toFormData$1(params, this, options);
  }

  const prototype = AxiosURLSearchParams.prototype;

  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };

  prototype.toString = function toString(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;

    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + '=' + _encode(pair[1]);
    }, '').join('&');
  };

  /**
   * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
   * URI encoded counterparts
   *
   * @param {string} val The value to be encoded.
   *
   * @returns {string} The encoded value.
   */
  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @param {?(object|Function)} options
   *
   * @returns {string} The formatted url
   */
  function buildURL(url, params, options) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }
    
    const _encode = options && options.encode || encode;

    if (utils$1.isFunction(options)) {
      options = {
        serialize: options
      };
    } 

    const serializeFn = options && options.serialize;

    let serializedParams;

    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ?
        params.toString() :
        new AxiosURLSearchParams(params, options).toString(_encode);
    }

    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");

      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  }

  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }

    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }

  var transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };

  var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

  var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

  var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

  var platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
  };

  const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

  const _navigator = typeof navigator === 'object' && navigator || undefined;

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   *
   * @returns {boolean}
   */
  const hasStandardBrowserEnv = hasBrowserEnv &&
    (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

  /**
   * Determine if we're running in a standard browser webWorker environment
   *
   * Although the `isStandardBrowserEnv` method indicates that
   * `allows axios to run in a web worker`, the WebWorker will still be
   * filtered out due to its judgment standard
   * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
   * This leads to a problem when axios post `FormData` in webWorker
   */
  const hasStandardBrowserWebWorkerEnv = (() => {
    return (
      typeof WorkerGlobalScope !== 'undefined' &&
      // eslint-disable-next-line no-undef
      self instanceof WorkerGlobalScope &&
      typeof self.importScripts === 'function'
    );
  })();

  const origin = hasBrowserEnv && window.location.href || 'http://localhost';

  var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hasBrowserEnv: hasBrowserEnv,
    hasStandardBrowserEnv: hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin: origin
  });

  var platform = {
    ...utils,
    ...platform$1
  };

  function toURLEncodedForm(data, options) {
    return toFormData$1(data, new platform.classes.URLSearchParams(), {
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString('base64'));
          return false;
        }

        return helpers.defaultVisitor.apply(this, arguments);
      },
      ...options
    });
  }

  /**
   * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
   *
   * @param {string} name - The name of the property to get.
   *
   * @returns An array of strings.
   */
  function parsePropPath(name) {
    // foo[x][y][z]
    // foo.x.y.z
    // foo-x-y-z
    // foo x y z
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
      return match[0] === '[]' ? '' : match[1] || match[0];
    });
  }

  /**
   * Convert an array to an object.
   *
   * @param {Array<any>} arr - The array to convert to an object.
   *
   * @returns An object with the same keys and values as the array.
   */
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }

  /**
   * It takes a FormData object and returns a JavaScript object
   *
   * @param {string} formData The FormData object to convert to JSON.
   *
   * @returns {Object<string, any> | null} The converted object.
   */
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];

      if (name === '__proto__') return true;

      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;

      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }

        return !isNumericKey;
      }

      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }

      const result = buildPath(path, value, target[name], index);

      if (result && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }

      return !isNumericKey;
    }

    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};

      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });

      return obj;
    }

    return null;
  }

  /**
   * It takes a string, tries to parse it, and if it fails, it returns the stringified version
   * of the input
   *
   * @param {any} rawValue - The value to be stringified.
   * @param {Function} parser - A function that parses a string into a JavaScript object.
   * @param {Function} encoder - A function that takes a value and returns a string.
   *
   * @returns {string} A stringified version of the rawValue.
   */
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== 'SyntaxError') {
          throw e;
        }
      }
    }

    return (encoder || JSON.stringify)(rawValue);
  }

  const defaults = {

    transitional: transitionalDefaults,

    adapter: ['xhr', 'http', 'fetch'],

    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || '';
      const hasJSONContentType = contentType.indexOf('application/json') > -1;
      const isObjectPayload = utils$1.isObject(data);

      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }

      const isFormData = utils$1.isFormData(data);

      if (isFormData) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }

      if (utils$1.isArrayBuffer(data) ||
        utils$1.isBuffer(data) ||
        utils$1.isStream(data) ||
        utils$1.isFile(data) ||
        utils$1.isBlob(data) ||
        utils$1.isReadableStream(data)
      ) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
        return data.toString();
      }

      let isFileList;

      if (isObjectPayload) {
        if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }

        if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
          const _FormData = this.env && this.env.FormData;

          return toFormData$1(
            isFileList ? {'files[]': data} : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }

      if (isObjectPayload || hasJSONContentType ) {
        headers.setContentType('application/json', false);
        return stringifySafely(data);
      }

      return data;
    }],

    transformResponse: [function transformResponse(data) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === 'json';

      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }

      if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;

        try {
          return JSON.parse(data, this.parseReviver);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }

      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },

    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': undefined
      }
    }
  };

  utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
    defaults.headers[method] = {};
  });

  // RawAxiosHeaders whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  const ignoreDuplicateOf = utils$1.toObjectSet([
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ]);

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} rawHeaders Headers needing to be parsed
   *
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = rawHeaders => {
    const parsed = {};
    let key;
    let val;
    let i;

    rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
      i = line.indexOf(':');
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();

      if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
        return;
      }

      if (key === 'set-cookie') {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });

    return parsed;
  };

  const $internals = Symbol('internals');

  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }

  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }

    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }

  function parseTokens(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;

    while ((match = tokensRE.exec(str))) {
      tokens[match[1]] = match[2];
    }

    return tokens;
  }

  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$1.isFunction(filter)) {
      return filter.call(this, value, header);
    }

    if (isHeaderNameFilter) {
      value = header;
    }

    if (!utils$1.isString(value)) return;

    if (utils$1.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }

    if (utils$1.isRegExp(filter)) {
      return filter.test(value);
    }
  }

  function formatHeader(header) {
    return header.trim()
      .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
        return char.toUpperCase() + str;
      });
  }

  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(' ' + header);

    ['get', 'set', 'has'].forEach(methodName => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }

  let AxiosHeaders$1 = class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }

    set(header, valueOrRewrite, rewrite) {
      const self = this;

      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);

        if (!lHeader) {
          throw new Error('header name must be a non-empty string');
        }

        const key = utils$1.findKey(self, lHeader);

        if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
          self[key || _header] = normalizeValue(_value);
        }
      }

      const setHeaders = (headers, _rewrite) =>
        utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils$1.isArray(entry)) {
            throw TypeError('Object iterator must return a key-value pair');
          }

          obj[key = entry[0]] = (dest = obj[key]) ?
            (utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]]) : entry[1];
        }

        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }

      return this;
    }

    get(header, parser) {
      header = normalizeHeader(header);

      if (header) {
        const key = utils$1.findKey(this, header);

        if (key) {
          const value = this[key];

          if (!parser) {
            return value;
          }

          if (parser === true) {
            return parseTokens(value);
          }

          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }

          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }

          throw new TypeError('parser must be boolean|regexp|function');
        }
      }
    }

    has(header, matcher) {
      header = normalizeHeader(header);

      if (header) {
        const key = utils$1.findKey(this, header);

        return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }

      return false;
    }

    delete(header, matcher) {
      const self = this;
      let deleted = false;

      function deleteHeader(_header) {
        _header = normalizeHeader(_header);

        if (_header) {
          const key = utils$1.findKey(self, _header);

          if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
            delete self[key];

            deleted = true;
          }
        }
      }

      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }

      return deleted;
    }

    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;

      while (i--) {
        const key = keys[i];
        if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }

      return deleted;
    }

    normalize(format) {
      const self = this;
      const headers = {};

      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);

        if (key) {
          self[key] = normalizeValue(value);
          delete self[header];
          return;
        }

        const normalized = format ? formatHeader(header) : String(header).trim();

        if (normalized !== header) {
          delete self[header];
        }

        self[normalized] = normalizeValue(value);

        headers[normalized] = true;
      });

      return this;
    }

    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }

    toJSON(asStrings) {
      const obj = Object.create(null);

      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
      });

      return obj;
    }

    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }

    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
    }

    getSetCookie() {
      return this.get("set-cookie") || [];
    }

    get [Symbol.toStringTag]() {
      return 'AxiosHeaders';
    }

    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }

    static concat(first, ...targets) {
      const computed = new this(first);

      targets.forEach((target) => computed.set(target));

      return computed;
    }

    static accessor(header) {
      const internals = this[$internals] = (this[$internals] = {
        accessors: {}
      });

      const accessors = internals.accessors;
      const prototype = this.prototype;

      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);

        if (!accessors[lHeader]) {
          buildAccessors(prototype, _header);
          accessors[lHeader] = true;
        }
      }

      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

      return this;
    }
  };

  AxiosHeaders$1.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

  // reserved names hotfix
  utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({value}, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    }
  });

  utils$1.freezeMethods(AxiosHeaders$1);

  /**
   * Transform the data for a request or a response
   *
   * @param {Array|Function} fns A single function or Array of functions
   * @param {?Object} response The response object
   *
   * @returns {*} The resulting transformed data
   */
  function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = AxiosHeaders$1.from(context.headers);
    let data = context.data;

    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });

    headers.normalize();

    return data;
  }

  function isCancel$1(value) {
    return !!(value && value.__CANCEL__);
  }

  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  function CanceledError$1(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    AxiosError$1.call(this, message == null ? 'canceled' : message, AxiosError$1.ERR_CANCELED, config, request);
    this.name = 'CanceledError';
  }

  utils$1.inherits(CanceledError$1, AxiosError$1, {
    __CANCEL__: true
  });

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   *
   * @returns {object} The response.
   */
  function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError$1(
        'Request failed with status code ' + response.status,
        [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }

  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || '';
  }

  /**
   * Calculate data maxRate
   * @param {Number} [samplesCount= 10]
   * @param {Number} [min= 1000]
   * @returns {Function}
   */
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;

    min = min !== undefined ? min : 1000;

    return function push(chunkLength) {
      const now = Date.now();

      const startedAt = timestamps[tail];

      if (!firstSampleTS) {
        firstSampleTS = now;
      }

      bytes[head] = chunkLength;
      timestamps[head] = now;

      let i = tail;
      let bytesCount = 0;

      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }

      head = (head + 1) % samplesCount;

      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }

      if (now - firstSampleTS < min) {
        return;
      }

      const passed = startedAt && now - startedAt;

      return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
  }

  /**
   * Throttle decorator
   * @param {Function} fn
   * @param {Number} freq
   * @return {Function}
   */
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1000 / freq;
    let lastArgs;
    let timer;

    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn(...args);
    };

    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if ( passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };

    const flush = () => lastArgs && invoke(lastArgs);

    return [throttled, flush];
  }

  const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);

    return throttle(e => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : undefined;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;

      bytesNotified = loaded;

      const data = {
        loaded,
        total,
        progress: total ? (loaded / total) : undefined,
        bytes: progressBytes,
        rate: rate ? rate : undefined,
        estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? 'download' : 'upload']: true
      };

      listener(data);
    }, freq);
  };

  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;

    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };

  const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

  var isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
    url = new URL(url, platform.origin);

    return (
      origin.protocol === url.protocol &&
      origin.host === url.host &&
      (isMSIE || origin.port === url.port)
    );
  })(
    new URL(platform.origin),
    platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
  ) : () => true;

  var cookies = platform.hasStandardBrowserEnv ?

    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + '=' + encodeURIComponent(value)];

        utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

        utils$1.isString(path) && cookie.push('path=' + path);

        utils$1.isString(domain) && cookie.push('domain=' + domain);

        secure === true && cookie.push('secure');

        document.cookie = cookie.join('; ');
      },

      read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    }

    :

    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {},
      read() {
        return null;
      },
      remove() {}
    };

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   *
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   *
   * @returns {string} The combined URL
   */
  function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  }

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   *
   * @returns {string} The combined full path
   */
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   *
   * @returns {Object} New object resulting from merging config2 to config1
   */
  function mergeConfig$1(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    const config = {};

    function getMergedValue(target, source, prop, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({caseless}, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(a, b, prop , caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, prop , caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(undefined, a, prop , caseless);
      }
    }

    // eslint-disable-next-line consistent-return
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(undefined, b);
      }
    }

    // eslint-disable-next-line consistent-return
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(undefined, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(undefined, a);
      }
    }

    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(undefined, a);
      }
    }

    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
    };

    utils$1.forEach(Object.keys({...config1, ...config2}), function computeConfigValue(prop) {
      const merge = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge(config1[prop], config2[prop], prop);
      (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
    });

    return config;
  }

  var resolveConfig = (config) => {
    const newConfig = mergeConfig$1({}, config);

    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;

    newConfig.headers = headers = AxiosHeaders$1.from(headers);

    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

    // HTTP basic authentication
    if (auth) {
      headers.set('Authorization', 'Basic ' +
        btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
      );
    }

    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(undefined); // browser handles it
      } else if (utils$1.isFunction(data.getHeaders)) {
        // Node.js FormData (like form-data package)
        const formHeaders = data.getHeaders();
        // Only set safe headers to avoid overwriting security headers
        const allowedHeaders = ['content-type', 'content-length'];
        Object.entries(formHeaders).forEach(([key, val]) => {
          if (allowedHeaders.includes(key.toLowerCase())) {
            headers.set(key, val);
          }
        });
      }
    }  

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.

    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

      if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
        // Add xsrf header
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }

    return newConfig;
  };

  const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

  var xhrAdapter = isXHRAdapterSupported && function (config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
      let {responseType, onUploadProgress, onDownloadProgress} = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;

      function done() {
        flushUpload && flushUpload(); // flush events
        flushDownload && flushDownload(); // flush events

        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

        _config.signal && _config.signal.removeEventListener('abort', onCanceled);
      }

      let request = new XMLHttpRequest();

      request.open(_config.method.toUpperCase(), _config.url, true);

      // Set the request timeout in MS
      request.timeout = _config.timeout;

      function onloadend() {
        if (!request) {
          return;
        }
        // Prepare the response
        const responseHeaders = AxiosHeaders$1.from(
          'getAllResponseHeaders' in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
          request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };

        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);

        // Clean up request
        request = null;
      }

      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }
          // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'
          setTimeout(onloadend);
        };
      }

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(new AxiosError$1('Request aborted', AxiosError$1.ECONNABORTED, config, request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
    request.onerror = function handleError(event) {
         // Browsers deliver a ProgressEvent in XHR onerror
         // (message may be empty; when present, surface it)
         // See https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/error_event
         const msg = event && event.message ? event.message : 'Network Error';
         const err = new AxiosError$1(msg, AxiosError$1.ERR_NETWORK, config, request);
         // attach the underlying event for consumers who want details
         err.event = event || null;
         reject(err);
         request = null;
      };
      
      // Handle timeout
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
        const transitional = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError$1(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
          config,
          request));

        // Clean up request
        request = null;
      };

      // Remove Content-Type if data is undefined
      requestData === undefined && requestHeaders.setContentType(null);

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }

      // Add withCredentials to request if needed
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }

      // Add responseType to request if needed
      if (responseType && responseType !== 'json') {
        request.responseType = _config.responseType;
      }

      // Handle progress if needed
      if (onDownloadProgress) {
        ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
        request.addEventListener('progress', downloadThrottled);
      }

      // Not all browsers support upload events
      if (onUploadProgress && request.upload) {
        ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

        request.upload.addEventListener('progress', uploadThrottled);

        request.upload.addEventListener('loadend', flushUpload);
      }

      if (_config.cancelToken || _config.signal) {
        // Handle cancellation
        // eslint-disable-next-line func-names
        onCanceled = cancel => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
          request.abort();
          request = null;
        };

        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
        }
      }

      const protocol = parseProtocol(_config.url);

      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError$1('Unsupported protocol ' + protocol + ':', AxiosError$1.ERR_BAD_REQUEST, config));
        return;
      }


      // Send the request
      request.send(requestData || null);
    });
  };

  const composeSignals = (signals, timeout) => {
    const {length} = (signals = signals ? signals.filter(Boolean) : []);

    if (timeout || length) {
      let controller = new AbortController();

      let aborted;

      const onabort = function (reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
        }
      };

      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
      }, timeout);

      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach(signal => {
            signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
          });
          signals = null;
        }
      };

      signals.forEach((signal) => signal.addEventListener('abort', onabort));

      const {signal} = controller;

      signal.unsubscribe = () => utils$1.asap(unsubscribe);

      return signal;
    }
  };

  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;

    if (len < chunkSize) {
      yield chunk;
      return;
    }

    let pos = 0;
    let end;

    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };

  const readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };

  const readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }

    const reader = stream.getReader();
    try {
      for (;;) {
        const {done, value} = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };

  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator = readBytes(stream, chunkSize);

    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };

    return new ReadableStream({
      async pull(controller) {
        try {
          const {done, value} = await iterator.next();

          if (done) {
           _onFinish();
            controller.close();
            return;
          }

          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator.return();
      }
    }, {
      highWaterMark: 2
    })
  };

  const DEFAULT_CHUNK_SIZE = 64 * 1024;

  const {isFunction} = utils$1;

  const globalFetchAPI = (({Request, Response}) => ({
    Request, Response
  }))(utils$1.global);

  const {
    ReadableStream: ReadableStream$1, TextEncoder
  } = utils$1.global;


  const test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false
    }
  };

  const factory = (env) => {
    env = utils$1.merge.call({
      skipUndefined: true
    }, globalFetchAPI, env);

    const {fetch: envFetch, Request, Response} = env;
    const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === 'function';
    const isRequestSupported = isFunction(Request);
    const isResponseSupported = isFunction(Response);

    if (!isFetchSupported) {
      return false;
    }

    const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);

    const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
        ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
        async (str) => new Uint8Array(await new Request(str).arrayBuffer())
    );

    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;

      const hasContentType = new Request(platform.origin, {
        body: new ReadableStream$1(),
        method: 'POST',
        get duplex() {
          duplexAccessed = true;
          return 'half';
        },
      }).headers.has('Content-Type');

      return duplexAccessed && !hasContentType;
    });

    const supportsResponseStream = isResponseSupported && isReadableStreamSupported &&
      test(() => utils$1.isReadableStream(new Response('').body));

    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };

    isFetchSupported && ((() => {
      ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
        !resolvers[type] && (resolvers[type] = (res, config) => {
          let method = res && res[type];

          if (method) {
            return method.call(res);
          }

          throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
        });
      });
    })());

    const getBodyLength = async (body) => {
      if (body == null) {
        return 0;
      }

      if (utils$1.isBlob(body)) {
        return body.size;
      }

      if (utils$1.isSpecCompliantForm(body)) {
        const _request = new Request(platform.origin, {
          method: 'POST',
          body,
        });
        return (await _request.arrayBuffer()).byteLength;
      }

      if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
        return body.byteLength;
      }

      if (utils$1.isURLSearchParams(body)) {
        body = body + '';
      }

      if (utils$1.isString(body)) {
        return (await encodeText(body)).byteLength;
      }
    };

    const resolveBodyLength = async (headers, body) => {
      const length = utils$1.toFiniteNumber(headers.getContentLength());

      return length == null ? getBodyLength(body) : length;
    };

    return async (config) => {
      let {
        url,
        method,
        data,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = 'same-origin',
        fetchOptions
      } = resolveConfig(config);

      let _fetch = envFetch || fetch;

      responseType = responseType ? (responseType + '').toLowerCase() : 'text';

      let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

      let request = null;

      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });

      let requestContentLength;

      try {
        if (
          onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
          (requestContentLength = await resolveBodyLength(headers, data)) !== 0
        ) {
          let _request = new Request(url, {
            method: 'POST',
            body: data,
            duplex: "half"
          });

          let contentTypeHeader;

          if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
            headers.setContentType(contentTypeHeader);
          }

          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );

            data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }

        if (!utils$1.isString(withCredentials)) {
          withCredentials = withCredentials ? 'include' : 'omit';
        }

        // Cloudflare Workers throws when credentials are defined
        // see https://github.com/cloudflare/workerd/issues/902
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;

        const resolvedOptions = {
          ...fetchOptions,
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: headers.normalize().toJSON(),
          body: data,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : undefined
        };

        request = isRequestSupported && new Request(url, resolvedOptions);

        let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));

        const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

        if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
          const options = {};

          ['status', 'statusText', 'headers'].forEach(prop => {
            options[prop] = response[prop];
          });

          const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];

          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }

        responseType = responseType || 'text';

        let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

        !isStreamResponse && unsubscribe && unsubscribe();

        return await new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders$1.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config,
            request
          });
        })
      } catch (err) {
        unsubscribe && unsubscribe();

        if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request),
            {
              cause: err.cause || err
            }
          )
        }

        throw AxiosError$1.from(err, err && err.code, config, request);
      }
    }
  };

  const seedCache = new Map();

  const getFetch = (config) => {
    let env = config ? config.env : {};
    const {fetch, Request, Response} = env;
    const seeds = [
      Request, Response, fetch
    ];

    let len = seeds.length, i = len,
      seed, target, map = seedCache;

    while (i--) {
      seed = seeds[i];
      target = map.get(seed);

      target === undefined && map.set(seed, target = (i ? new Map() : factory(env)));

      map = target;
    }

    return target;
  };

  getFetch();

  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: {
      get: getFetch,
    }
  };

  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, 'name', {value});
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
      Object.defineProperty(fn, 'adapterName', {value});
    }
  });

  const renderReason = (reason) => `- ${reason}`;

  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

  var adapters = {
    getAdapter: (adapters, config) => {
      adapters = utils$1.isArray(adapters) ? adapters : [adapters];

      const {length} = adapters;
      let nameOrAdapter;
      let adapter;

      const rejectedReasons = {};

      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters[i];
        let id;

        adapter = nameOrAdapter;

        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

          if (adapter === undefined) {
            throw new AxiosError$1(`Unknown adapter '${id}'`);
          }
        }

        if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) {
          break;
        }

        rejectedReasons[id || '#' + i] = adapter;
      }

      if (!adapter) {

        const reasons = Object.entries(rejectedReasons)
          .map(([id, state]) => `adapter ${id} ` +
            (state === false ? 'is not supported by the environment' : 'is not available in the build')
          );

        let s = length ?
          (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
          'as no adapter specified';

        throw new AxiosError$1(
          `There is no suitable adapter to dispatch the request ` + s,
          'ERR_NOT_SUPPORT'
        );
      }

      return adapter;
    },
    adapters: knownAdapters
  };

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   *
   * @param {Object} config The config that is to be used for the request
   *
   * @returns {void}
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }

    if (config.signal && config.signal.aborted) {
      throw new CanceledError$1(null, config);
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    config.headers = AxiosHeaders$1.from(config.headers);

    // Transform request data
    config.data = transformData.call(
      config,
      config.transformRequest
    );

    if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
      config.headers.setContentType('application/x-www-form-urlencoded', false);
    }

    const adapter = adapters.getAdapter(config.adapter || defaults.adapter, config);

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );

      response.headers = AxiosHeaders$1.from(response.headers);

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }

      return Promise.reject(reason);
    });
  }

  const VERSION$1 = "1.12.2";

  const validators$1 = {};

  // eslint-disable-next-line func-names
  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
    validators$1[type] = function validator(thing) {
      return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });

  const deprecatedWarnings = {};

  /**
   * Transitional option validator
   *
   * @param {function|boolean?} validator - set to false if the transitional option has been removed
   * @param {string?} version - deprecated version / removed since version
   * @param {string?} message - some message with additional info
   *
   * @returns {function}
   */
  validators$1.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return '[Axios v' + VERSION$1 + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }

    // eslint-disable-next-line func-names
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError$1(
          formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
          AxiosError$1.ERR_DEPRECATED
        );
      }

      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        // eslint-disable-next-line no-console
        console.warn(
          formatMessage(
            opt,
            ' has been deprecated since v' + version + ' and will be removed in the near future'
          )
        );
      }

      return validator ? validator(value, opt, opts) : true;
    };
  };

  validators$1.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      // eslint-disable-next-line no-console
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    }
  };

  /**
   * Assert object's properties type
   *
   * @param {object} options
   * @param {object} schema
   * @param {boolean?} allowUnknown
   *
   * @returns {object}
   */

  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== 'object') {
      throw new AxiosError$1('options must be an object', AxiosError$1.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator = schema[opt];
      if (validator) {
        const value = options[opt];
        const result = value === undefined || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError$1('option ' + opt + ' must be ' + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError$1('Unknown option ' + opt, AxiosError$1.ERR_BAD_OPTION);
      }
    }
  }

  var validator = {
    assertOptions,
    validators: validators$1
  };

  const validators = validator.validators;

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   *
   * @return {Axios} A new instance of Axios
   */
  let Axios$1 = class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};

          Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

          // slice off the Error: ... line
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
          try {
            if (!err.stack) {
              err.stack = stack;
              // match without the 2 top stack lines
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
              err.stack += '\n' + stack;
            }
          } catch (e) {
            // ignore the case where "stack" is an un-writable property
          }
        }

        throw err;
      }
    }

    _request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig$1(this.defaults, config);

      const {transitional, paramsSerializer, headers} = config;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }

      // Set config.allowAbsoluteUrls
      if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }

      validator.assertOptions(config, {
        baseUrl: validators.spelling('baseURL'),
        withXsrfToken: validators.spelling('withXSRFToken')
      }, true);

      // Set config.method
      config.method = (config.method || this.defaults.method || 'get').toLowerCase();

      // Flatten headers
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config.method]
      );

      headers && utils$1.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        (method) => {
          delete headers[method];
        }
      );

      config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

      // filter out skipped interceptors
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      let promise;
      let i = 0;
      let len;

      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), undefined];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;

        promise = Promise.resolve(config);

        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }

        return promise;
      }

      len = requestInterceptorChain.length;

      let newConfig = config;

      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }

      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      i = 0;
      len = responseInterceptorChain.length;

      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }

      return promise;
    }

    getUri(config) {
      config = mergeConfig$1(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };

  // Provide aliases for supported request methods
  utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });

  utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/

    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig$1(config || {}, {
          method,
          headers: isForm ? {
            'Content-Type': 'multipart/form-data'
          } : {},
          url,
          data
        }));
      };
    }

    Axios$1.prototype[method] = generateHTTPMethod();

    Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
  });

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @param {Function} executor The executor function.
   *
   * @returns {CancelToken}
   */
  let CancelToken$1 = class CancelToken {
    constructor(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      let resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      const token = this;

      // eslint-disable-next-line func-names
      this.promise.then(cancel => {
        if (!token._listeners) return;

        let i = token._listeners.length;

        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = onfulfilled => {
        let _resolve;
        // eslint-disable-next-line func-names
        const promise = new Promise(resolve => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message, config, request) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError$1(message, config, request);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }

    /**
     * Subscribe to the cancel signal
     */

    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }

    /**
     * Unsubscribe from the cancel signal
     */

    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }

    toAbortSignal() {
      const controller = new AbortController();

      const abort = (err) => {
        controller.abort(err);
      };

      this.subscribe(abort);

      controller.signal.unsubscribe = () => this.unsubscribe(abort);

      return controller.signal;
    }

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   *
   * @returns {Function}
   */
  function spread$1(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   *
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  function isAxiosError$1(payload) {
    return utils$1.isObject(payload) && (payload.isAxiosError === true);
  }

  const HttpStatusCode$1 = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
  };

  Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
    HttpStatusCode$1[value] = key;
  });

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   *
   * @returns {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    const context = new Axios$1(defaultConfig);
    const instance = bind(Axios$1.prototype.request, context);

    // Copy axios.prototype to instance
    utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

    // Copy context to instance
    utils$1.extend(instance, context, null, {allOwnKeys: true});

    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
    };

    return instance;
  }

  // Create the default instance to be exported
  const axios = createInstance(defaults);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios$1;

  // Expose Cancel & CancelToken
  axios.CanceledError = CanceledError$1;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel$1;
  axios.VERSION = VERSION$1;
  axios.toFormData = toFormData$1;

  // Expose AxiosError class
  axios.AxiosError = AxiosError$1;

  // alias for CanceledError for backward compatibility
  axios.Cancel = axios.CanceledError;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };

  axios.spread = spread$1;

  // Expose isAxiosError
  axios.isAxiosError = isAxiosError$1;

  // Expose mergeConfig
  axios.mergeConfig = mergeConfig$1;

  axios.AxiosHeaders = AxiosHeaders$1;

  axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

  axios.getAdapter = adapters.getAdapter;

  axios.HttpStatusCode = HttpStatusCode$1;

  axios.default = axios;

  // This module is intended to unwrap Axios default export as named.
  // Keep top-level export same with static properties
  // so that it can keep same with es module or cjs
  const {
    Axios,
    AxiosError,
    CanceledError,
    isCancel,
    CancelToken,
    VERSION,
    all,
    Cancel,
    isAxiosError,
    spread,
    toFormData,
    AxiosHeaders,
    HttpStatusCode,
    formToJSON,
    getAdapter,
    mergeConfig
  } = axios;

  const API_BASE_URL = "https://api.medos.one/v1";

  let sessionToken = null;
  const AuthService = {
      async init(apiKey) {
          try {
              const res = await axios.post(`${API_BASE_URL}/auth/session?api_key=${apiKey}`, {});
              const token = res.data?.access_token;
              if (!token || typeof token !== "string") {
                  throw new Error("Invalid session token response");
              }
              sessionToken = token;
              return token;
          }
          catch (e) {
              throw new Error(`Failed to initialize session: ${e.message}`);
          }
      },
      getToken() {
          return sessionToken;
      },
      clear() {
          sessionToken = null;
      },
  };

  const PatientService = {
      async sendPhoneVerificationOtp(payload) {
          const client = await MedosClient.ensureInitialized();
          const res = await client.post("/patients/send-phone-verification-otp", payload);
          return res.data;
      },
      async verifyPhoneVerificationOtp(payload) {
          const client = await MedosClient.ensureInitialized();
          const res = await client.post("/patients/verify-phone-verification-otp", payload);
          return res.data;
      },
  };

  class MedosClient {
      static async init({ apiKey }) {
          if (!apiKey) {
              throw new Error("MedosClient.init() requires 'apiKey'");
          }
          if (this.initPromise) {
              return this.initPromise;
          }
          this.initPromise = (async () => {
              try {
                  const sessionToken = await AuthService.init(apiKey);
                  this.initializeAxiosInstance(sessionToken, API_BASE_URL);
              }
              catch (e) {
                  this.initPromise = null;
                  throw new Error(`MedosClient.init failed: ${e.message}`);
              }
          })();
          return this.initPromise;
      }
      static async initWithSession({ sessionToken }) {
          if (!sessionToken) {
              throw new Error("MedosClient.initWithSession() requires 'sessionToken'");
          }
          if (this.initPromise) {
              return this.initPromise;
          }
          this.initPromise = (async () => {
              try {
                  this.initializeAxiosInstance(sessionToken, API_BASE_URL);
              }
              catch (e) {
                  this.initPromise = null;
                  throw new Error(`MedosClient.initWithSession failed: ${e.message}`);
              }
          })();
          return this.initPromise;
      }
      static initializeAxiosInstance(sessionToken, baseURL) {
          this.token = sessionToken;
          this.instance = axios.create({
              baseURL,
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionToken}`,
              },
          });
          this.instance.interceptors.request.use((config) => {
              if (!config.headers)
                  config.headers = {};
              const headersAny = config.headers;
              const isFormData = config.data instanceof FormData ||
                  (config.data &&
                      typeof config.data === "object" &&
                      config.data.constructor &&
                      config.data.constructor.name === "FormData");
              if (isFormData) {
                  delete headersAny["Content-Type"];
                  if (config.headers.common) {
                      delete config.headers.common["Content-Type"];
                  }
              }
              if (this.token) {
                  headersAny["Authorization"] = `Bearer ${this.token}`;
              }
              return config;
          });
          this.instance.interceptors.response.use((response) => response, async (error) => {
              const originalRequest = error.config;
              if (error.response?.status === 401 &&
                  !originalRequest._retry &&
                  this.refreshHandler) {
                  originalRequest._retry = true;
                  if (this.isRefreshing) {
                      return new Promise((resolve, reject) => {
                          this.pendingRequests.push((token) => {
                              if (token && originalRequest.headers) {
                                  originalRequest.headers["Authorization"] = `Bearer ${token}`;
                              }
                              resolve(this.instance.request(originalRequest));
                          });
                      });
                  }
                  this.isRefreshing = true;
                  try {
                      const newToken = await this.refreshHandler();
                      this.isRefreshing = false;
                      if (newToken) {
                          this.setToken(newToken);
                      }
                      this.pendingRequests.forEach((cb) => cb(newToken));
                      this.pendingRequests = [];
                      if (newToken && originalRequest.headers) {
                          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                      }
                      return this.instance.request(originalRequest);
                  }
                  catch (refreshErr) {
                      this.isRefreshing = false;
                      this.pendingRequests.forEach((cb) => cb(null));
                      this.pendingRequests = [];
                      return Promise.reject(refreshErr);
                  }
              }
              return Promise.reject(error);
          });
      }
      static async fetchAllAddressesAndDoctors() {
          if (!this.instance) {
              throw new Error("MedosClient not initialized. Call MedosClient.init() first.");
          }
          return AppointmentService.getAddresses();
      }
      static async fetchAppointments(workspaceId, addressId, doctorId, appointmentDate) {
          if (!this.instance) {
              throw new Error("MedosClient not initialized. Call MedosClient.init() first.");
          }
          return AppointmentService.fetchSlots(workspaceId, addressId, doctorId, appointmentDate);
      }
      static async sendPhoneVerificationOtp(payload) {
          if (!this.instance) {
              throw new Error("MedosClient not initialized. Call MedosClient.init() first.");
          }
          return PatientService.sendPhoneVerificationOtp(payload);
      }
      static async verifyPhoneVerificationOtp(payload) {
          if (!this.instance) {
              throw new Error("MedosClient not initialized. Call MedosClient.init() first.");
          }
          return PatientService.verifyPhoneVerificationOtp(payload);
      }
      static async fetchTheme() {
          if (!this.instance) {
              throw new Error("MedosClient not initialized. Call MedosClient.init() first.");
          }
          const { WorkspaceService } = await Promise.resolve().then(function () { return WorkspaceService$1; });
          return WorkspaceService.fetchTheme();
      }
      static get client() {
          if (!this.instance && !this.initPromise) {
              throw new Error("MedosClient not initialized. Call MedosClient.init() or MedosClient.initWithSession() first.");
          }
          if (!this.instance && this.initPromise) {
              throw new Error("MedosClient initialization is in progress. Please wait for initialization to complete before accessing the client.");
          }
          return this.instance;
      }
      static async ensureInitialized() {
          if (this.instance) {
              return this.instance;
          }
          if (this.initPromise) {
              await this.initPromise;
              if (this.instance) {
                  return this.instance;
              }
          }
          throw new Error("MedosClient not initialized. Call MedosClient.init() or MedosClient.initWithSession() first.");
      }
      static isInitialized() {
          return this.instance !== null;
      }
      static setToken(token) {
          this.token = token;
          if (this.instance) {
              const defaults = this.instance.defaults;
              if (!defaults.headers)
                  defaults.headers = {};
              if (!defaults.headers.common)
                  defaults.headers.common = {};
              defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }
      }
      static setRefreshHandler(handler) {
          this.refreshHandler = handler;
      }
  }
  MedosClient.instance = null;
  MedosClient.token = null;
  MedosClient.refreshHandler = null;
  MedosClient.isRefreshing = false;
  MedosClient.pendingRequests = [];
  MedosClient.initPromise = null;

  const COUNTRY_CODES = [
      { code: "+91", label: "🇮🇳 +91" },
      { code: "+1", label: "🇺🇸 +1" },
      { code: "+44", label: "🇬🇧 +44" },
      { code: "+86", label: "🇨🇳 +86" },
      { code: "+81", label: "🇯🇵 +81" },
  ];
  const GENDER_OPTIONS = [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
      { value: "OTHER", label: "Other" },
  ];
  const BLOOD_GROUP_OPTIONS = [
      { value: "A+", label: "A+" },
      { value: "A-", label: "A-" },
      { value: "B+", label: "B+" },
      { value: "B-", label: "B-" },
      { value: "AB+", label: "AB+" },
      { value: "AB-", label: "AB-" },
      { value: "O+", label: "O+" },
      { value: "O-", label: "O-" },
  ];
  const mapBloodGroupToApi = (uiBloodGroup) => {
      const bloodGroupMap = {
          "A+": "A_POSITIVE",
          "A-": "A_NEGATIVE",
          "B+": "B_POSITIVE",
          "B-": "B_NEGATIVE",
          "AB+": "AB_POSITIVE",
          "AB-": "AB_NEGATIVE",
          "O+": "O_POSITIVE",
          "O-": "O_NEGATIVE",
      };
      return bloodGroupMap[uiBloodGroup];
  };

  const WorkspaceService = {
      async fetchWorkspace() {
          try {
              const client = await MedosClient.ensureInitialized();
              const res = await client.get("/workspaces");
              if (!res.data || typeof res.data.workspaceId !== "number") {
                  throw new Error("Invalid workspace response");
              }
              return res.data;
          }
          catch (error) {
              throw new Error(`Failed to fetch workspace: ${error.message}`);
          }
      },
      async fetchTheme() {
          try {
              const workspace = await this.fetchWorkspace();
              return workspace.theme;
          }
          catch (error) {
              throw new Error(`Failed to fetch workspace theme: ${error.message}`);
          }
      },
  };

  var WorkspaceService$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    WorkspaceService: WorkspaceService
  });

  const AppointmentService = {
      async arePackagesConfigured() {
          try {
              const workspace = await WorkspaceService.fetchWorkspace();
              return workspace.arePackagesConfigured === true;
          }
          catch (error) {
              console.warn("Failed to check package configuration, defaulting to legacy endpoint:", error);
              return false;
          }
      },
      async getAddresses() {
          const client = await MedosClient.ensureInitialized();
          const res = await client.get("/workspaces");
          const data = res.data ?? res;
          if (data && Array.isArray(data.addressDoctors)) {
              const addresses = data.addressDoctors
                  .filter((ad) => ad.address)
                  .map((ad) => {
                  const addr = ad.address;
                  const doctors = (ad.doctors || []).map((d) => ({
                      id: Number(d.user.id),
                      name: `${d.user.firstName || ""} ${d.user.lastName || ""}`.trim() ||
                          "Doctor",
                      email: d.user.email,
                      gender: d.user.gender,
                      countryCode: d.user.countryCode,
                      phoneNumber: d.user.phoneNumber,
                      dob: d.user.dob,
                      platform: d.user.platform,
                      isKycCompleted: d.user.isKycCompleted,
                  }));
                  return {
                      id: Number(addr.id),
                      completeAddress: addr.completeAddress,
                      addressLine1: addr.addressLine1,
                      addressLine2: addr.addressLine2,
                      city: addr.city,
                      state: addr.state,
                      country: addr.country,
                      zipcode: addr.zipcode,
                      landmark: addr.landmark,
                      phoneNumber: addr.phoneNumber,
                      latitude: addr.latitude,
                      longitude: addr.longitude,
                      doctors,
                  };
              });
              return {
                  totalAddresses: data.totalAddresses,
                  totalDoctors: data.totalDoctors,
                  workspaceId: data.workspaceId,
                  addresses,
              };
          }
          return { addresses: [] };
      },
      async fetchSlots(workspaceId, addressId, doctorId, appointmentDate) {
          const client = await MedosClient.ensureInitialized();
          console.log("fetching slots", workspaceId, addressId, doctorId, appointmentDate);
          const res = await client.get(`/appointments/available-slots`, {
              params: {
                  workspaceId,
                  addressId,
                  doctorId,
                  appointmentDate,
              },
          });
          const data = res.data ?? res;
          if (Array.isArray(data)) {
              return data.map((slot) => {
                  const { appointmentDate: date, fromDateTimeTs: fromTime, toDateTimeTs: toTime, } = slot;
                  const start = `${date}T${fromTime}:00`;
                  const end = `${date}T${toTime}:00`;
                  return {
                      start,
                      end,
                      id: slot.id,
                      ...slot,
                  };
              });
          }
          return [];
      },
      transformToUnifiedPayload(payload) {
          const bookingType = payload.bookingType || "ONE_TIME_APPOINTMENT";
          if (bookingType === "PACKAGE_PURCHASE" ||
              bookingType === "USE_ACTIVE_PACKAGE") {
              if (!payload.packageConfigId) {
                  throw new Error("packageConfigId is required when bookingType is PACKAGE_PURCHASE");
              }
              if (!payload.packageAmount) {
                  throw new Error("packageAmount is required when bookingType is PACKAGE_PURCHASE");
              }
          }
          let consultationCharge;
          if (bookingType === "PACKAGE_PURCHASE" ||
              bookingType === "USE_ACTIVE_PACKAGE") {
              consultationCharge = 0;
          }
          else {
              consultationCharge =
                  typeof payload.consultationCharge === "string"
                      ? Number.parseFloat(payload.consultationCharge) || 0
                      : payload.consultationCharge || 0;
          }
          const completeAddress = [
              payload.patientAddress.addressLine1,
              payload.patientAddress.addressLine2,
              payload.patientAddress.city,
              payload.patientAddress.state,
              payload.patientAddress.country,
              payload.patientAddress.zipcode,
          ]
              .filter(Boolean)
              .join(", ");
          const unifiedPayload = {
              workspaceId: Number(payload.workspaceId || 0),
              workspaceAddressId: Number(payload.workspaceAddressId),
              doctorId: Number(payload.doctorId),
              mode: (payload.mode || "OFFLINE"),
              appointmentDate: payload.appointmentDate,
              fromDateTimeTs: payload.fromDateTimeTs,
              toDateTimeTs: payload.toDateTimeTs,
              bookingType,
              consultationCharge,
              paymentMode: payload.paymentMode || "CASH",
              type: payload.type || "CONSULTATION",
              source: payload.source || "SDK_POWERED_WEBSITE",
              patientPayload: {
                  id: payload.patientPayload.id,
                  firstName: payload.patientPayload.firstName,
                  lastName: payload.patientPayload.lastName,
                  email: payload.patientPayload.email || "",
                  countryCode: payload.patientPayload.countryCode,
                  phoneNumber: payload.patientPayload.phoneNumber,
                  dob: payload.patientPayload.dob || "",
                  age: payload.patientPayload.age || 0,
                  gender: (payload.patientPayload.gender || "OTHER"),
                  bloodGroup: payload.patientPayload.bloodGroup
                      ? mapBloodGroupToApi(payload.patientPayload.bloodGroup)
                      : "UNKNOWN",
              },
              patientAddress: {
                  completeAddress,
                  addressLine1: payload.patientAddress.addressLine1,
                  addressLine2: payload.patientAddress.addressLine2,
                  city: payload.patientAddress.city,
                  state: payload.patientAddress.state,
                  country: payload.patientAddress.country,
                  zipcode: payload.patientAddress.zipcode,
                  landmark: payload.patientAddress.landmark,
                  countryCode: payload.patientAddress.countryCode || "",
                  phoneNumber: payload.patientAddress.phoneNumber || "",
                  patientId: payload.patientAddress.patientId || 0,
              },
          };
          if (bookingType === "PACKAGE_PURCHASE" ||
              bookingType === "USE_ACTIVE_PACKAGE") {
              unifiedPayload.packageConfigId = payload.packageConfigId;
              unifiedPayload.packageAmount = payload.packageAmount;
          }
          if (payload.patientPackageId) {
              unifiedPayload.patientPackageId = payload.patientPackageId;
          }
          return unifiedPayload;
      },
      async createLegacyAppointment(payload) {
          const client = await MedosClient.ensureInitialized();
          const legacyPayload = {
              workspaceAddressId: payload.workspaceAddressId,
              doctorId: payload.doctorId,
              mode: payload.mode || "OFFLINE",
              appointmentDate: payload.appointmentDate,
              fromDateTimeTs: payload.fromDateTimeTs,
              toDateTimeTs: payload.toDateTimeTs,
              consultationCharge: payload.consultationCharge,
              type: payload.type || "CONSULTATION",
              source: payload.source || "SDK_POWERED_WEBSITE",
              patientPayload: payload.patientPayload,
              patientAddress: payload.patientAddress,
          };
          if (payload.attachments && payload.attachments.length > 0) {
              const formData = new FormData();
              const payloadString = JSON.stringify(legacyPayload);
              formData.append("payload", payloadString);
              payload.attachments.forEach((file) => {
                  formData.append("attachments", file);
              });
              const res = await client.post("/appointments/book-appointment", formData);
              return res.data;
          }
          else {
              const res = await client.post("/appointments/book-appointment", legacyPayload, {
                  headers: {
                      "Content-Type": "application/json",
                  },
              });
              return res.data;
          }
      },
      async createAppointment(payload) {
          const packagesConfigured = await this.arePackagesConfigured();
          if (packagesConfigured) {
              return this.createUnifiedAppointment(payload);
          }
          else {
              return this.createLegacyAppointment(payload);
          }
      },
      async createUnifiedAppointment(payload) {
          const client = await MedosClient.ensureInitialized();
          const unifiedPayload = this.transformToUnifiedPayload(payload);
          if (payload.attachments && payload.attachments.length > 0) {
              const formData = new FormData();
              const payloadString = JSON.stringify(unifiedPayload);
              formData.append("payload", payloadString);
              payload.attachments.forEach((file) => {
                  formData.append("attachments", file);
              });
              const res = await client.post("/appointments/book-appointment-unified", formData);
              return res.data;
          }
          else {
              const res = await client.post("/appointments/book-appointment-unified", unifiedPayload, {
                  headers: {
                      "Content-Type": "application/json",
                  },
              });
              return res.data;
          }
      },
  };

  const INITIAL_STATE = {
      step: 0,
      loading: false,
      error: null,
      workspaceId: null,
      addresses: [],
      addressDoctorsMap: {},
      selectedAddress: null,
      selectedDoctor: null,
      selectedDate: new Date(),
      slots: [],
      selectedSlot: null,
      consultationMode: "OFFLINE",
      consultationCharge: "",
      patientName: "",
      patientAge: "",
      patientEmail: "",
      patientGender: "",
      bloodGroup: "",
      patientDob: "",
      patientAddress: "",
      patientCity: "",
      patientState: "",
      patientCountry: "",
      patientZipcode: "",
      patientLandmark: "",
      countryCode: "+91",
      patientPhone: "",
      otpCode: "",
      otpSent: false,
      otpVerified: false,
      otpSending: false,
      otpVerifying: false,
      verifiedPatients: [],
      selectedPatient: null,
      useExistingPatient: false,
      userSessionPacks: [],
      availablePackages: [],
      selectedSessionPack: null,
      selectedNewPackage: null,
      bookingOptionType: null,
      showPackageExplorer: false,
      packagesLoading: false,
      arePackagesConfigured: false,
      bookingType: "ONE_TIME_APPOINTMENT",
      paymentMode: "CASH",
      packageConfigId: undefined,
      patientPackageId: undefined,
      packageAmount: undefined,
  };

  const PHONE_MIN_LENGTH = 7;
  const PHONE_MAX_LENGTH = 15;
  const COUNTRY_CODE_REGEX = /^\+[1-9]\d{0,3}$/;
  const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  const MIN_BIRTH_YEAR = 1900;
  const VALID_BLOOD_GROUPS = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
      "UNKNOWN",
  ];

  const validatePhoneNumber$1 = (phone) => {
      const cleaned = phone.replace(/\D/g, "");
      return (cleaned.length >= PHONE_MIN_LENGTH && cleaned.length <= PHONE_MAX_LENGTH);
  };
  const validateCountryCode$1 = (code) => {
      return COUNTRY_CODE_REGEX.test(code);
  };
  const validateBloodGroup = (bloodGroup) => {
      return VALID_BLOOD_GROUPS.includes(bloodGroup);
  };
  const validateDateOfBirth = (dob) => {
      if (!dob)
          return false;
      if (!DATE_FORMAT_REGEX.test(dob))
          return false;
      const [yearStr, monthStr, dayStr] = dob.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);
      if (month < 1 || month > 12 || day < 1 || day > 31)
          return false;
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() !== year ||
          date.getMonth() !== month - 1 ||
          date.getDate() !== day) {
          return false;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      if (date > today)
          return false;
      if (year < MIN_BIRTH_YEAR)
          return false;
      return true;
  };

  const formatDateToISO = (date) => {
      const year = String(date.getFullYear()).padStart(4, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
  };
  const formatDate = (date) => {
      if (!date)
          return "Not selected";
      try {
          const dateObj = typeof date === "string" ? new Date(date) : date;
          return dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
          });
      }
      catch {
          return String(date);
      }
  };
  const formatTime = (timeStr) => {
      try {
          if (typeof timeStr === "number" || !Number.isNaN(Number(timeStr))) {
              const time = new Date(Number(timeStr));
              return time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
              });
          }
          if (timeStr.includes(":") && timeStr.length <= 5) {
              const time = new Date(`2000-01-01T${timeStr}`);
              return time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
              });
          }
          const time = new Date(timeStr);
          return time.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
          });
      }
      catch {
          return String(timeStr);
      }
  };
  const calculateDuration = (startTime, endTime, defaultDuration = 60) => {
      if (!startTime || !endTime)
          return defaultDuration;
      try {
          const start = new Date(startTime);
          const end = new Date(endTime);
          const diffMs = end.getTime() - start.getTime();
          const diffMinutes = Math.round(diffMs / (1000 * 60));
          return diffMinutes > 0 ? diffMinutes : defaultDuration;
      }
      catch {
          return defaultDuration;
      }
  };

  const parsePatientName = (fullName) => {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "Patient";
      const lastName = nameParts.slice(1).join(" ") || "";
      return {
          firstName,
          lastName,
      };
  };

  const VanillaIcons = {
      chevronLeft: (size = 20, className = "") => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-chevron-left ${className}"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  `,
      chevronRight: (size = 20, className = "") => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-chevron-right ${className}"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  `,
      chevronDown: (size = 16, className = "") => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-chevron-down ${className}"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,
      check: (size = 16, className = "") => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-check ${className}"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,
      consultationType: (size = 18) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${Math.round((size * 20) / 18)}"
      viewBox="0 0 18 20"
      fill="none"
      class="medos-icon medos-icon-consultation"
    >
      <path
        d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6ZM4 12V10H14V12H4ZM4 16V14H11V16H4Z"
        fill="currentColor"
      />
    </svg>
  `,
      dateTime: (size = 18) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${Math.round((size * 20) / 18)}"
      viewBox="0 0 18 20"
      fill="none"
      class="medos-icon medos-icon-datetime"
    >
      <path
        d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6ZM4 12V10H14V12H4ZM4 16V14H11V16H4Z"
        fill="currentColor"
      />
    </svg>
  `,
      mapPin: (size = 14) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${Math.round((size * 20) / 14)}"
      viewBox="0 0 14 20"
      fill="none"
      class="medos-icon medos-icon-map-pin"
    >
      <path
        d="M7 20C5.23333 20 3.79167 19.7208 2.675 19.1625C1.55833 18.6042 1 17.8833 1 17C1 16.6 1.12083 16.2292 1.3625 15.8875C1.60417 15.5458 1.94167 15.25 2.375 15L3.95 16.475C3.8 16.5417 3.6375 16.6167 3.4625 16.7C3.2875 16.7833 3.15 16.8833 3.05 17C3.26667 17.2667 3.76667 17.5 4.55 17.7C5.33333 17.9 6.15 18 7 18C7.85 18 8.67083 17.9 9.4625 17.7C10.2542 17.5 10.7583 17.2667 10.975 17C10.8583 16.8667 10.7083 16.7583 10.525 16.675C10.3417 16.5917 10.1667 16.5167 10 16.45L11.55 14.95C12.0167 15.2167 12.375 15.5208 12.625 15.8625C12.875 16.2042 13 16.5833 13 17C13 17.8833 12.4417 18.6042 11.325 19.1625C10.2083 19.7208 8.76667 20 7 20ZM7.025 14.5C8.675 13.2833 9.91667 12.0625 10.75 10.8375C11.5833 9.6125 12 8.38333 12 7.15C12 5.45 11.4583 4.16667 10.375 3.3C9.29167 2.43333 8.16667 2 7 2C5.83333 2 4.70833 2.43333 3.625 3.3C2.54167 4.16667 2 5.45 2 7.15C2 8.26667 2.40833 9.42917 3.225 10.6375C4.04167 11.8458 5.30833 13.1333 7.025 14.5ZM7 17C4.65 15.2667 2.89583 13.5833 1.7375 11.95C0.579167 10.3167 0 8.71667 0 7.15C0 5.96667 0.2125 4.92917 0.6375 4.0375C1.0625 3.14583 1.60833 2.4 2.275 1.8C2.94167 1.2 3.69167 0.75 4.525 0.45C5.35833 0.15 6.18333 0 7 0C7.81667 0 8.64167 0.15 9.475 0.45C10.3083 0.75 11.0583 1.2 11.725 1.8C12.3917 2.4 12.9375 3.14583 13.3625 4.0375C13.7875 4.92917 14 5.96667 14 7.15C14 8.71667 13.4208 10.3167 12.2625 11.95C11.1042 13.5833 9.35 15.2667 7 17ZM7 9C7.55 9 8.02083 8.80417 8.4125 8.4125C8.80417 8.02083 9 7.55 9 7C9 6.45 8.80417 5.97917 8.4125 5.5875C8.02083 5.19583 7.55 5 7 5C6.45 5 5.97917 5.19583 5.5875 5.5875C5.19583 5.97917 5 6.45 5 7C5 7.55 5.19583 8.02083 5.5875 8.4125C5.97917 8.80417 6.45 9 7 9Z"
        fill="currentColor"
      />
    </svg>
  `,
      user: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 20 20"
      fill="none"
      class="medos-icon medos-icon-user"
    >
      <path
        d="M14 13C13.1667 13 12.4583 12.7083 11.875 12.125C11.2917 11.5417 11 10.8333 11 10C11 9.16667 11.2917 8.45833 11.875 7.875C12.4583 7.29167 13.1667 7 14 7C14.8333 7 15.5417 7.29167 16.125 7.875C16.7083 8.45833 17 9.16667 17 10C17 10.8333 16.7083 11.5417 16.125 12.125C15.5417 12.7083 14.8333 13 14 13ZM14 11C14.2833 11 14.5208 10.9042 14.7125 10.7125C14.9042 10.5208 15 10.2833 15 10C15 9.71667 14.9042 9.47917 14.7125 9.2875C14.5208 9.09583 14.2833 9 14 9C13.7167 9 13.4792 9.09583 13.2875 9.2875C13.0958 9.47917 13 9.71667 13 10C13 10.2833 13.0958 10.5208 13.2875 10.7125C13.4792 10.9042 13.7167 11 14 11ZM8 20V17.1C8 16.75 8.08333 16.4208 8.25 16.1125C8.41667 15.8042 8.65 15.5583 8.95 15.375C9.48333 15.0583 10.0458 14.7958 10.6375 14.5875C11.2292 14.3792 11.8333 14.225 12.45 14.125L14 16L15.55 14.125C16.1667 14.225 16.7667 14.3792 17.35 14.5875C17.9333 14.7958 18.4917 15.0583 19.025 15.375C19.325 15.5583 19.5625 15.8042 19.7375 16.1125C19.9125 16.4208 20 16.75 20 17.1V20H8ZM9.975 18H13.05L11.7 16.35C11.4 16.4333 11.1083 16.5417 10.825 16.675C10.5417 16.8083 10.2583 16.95 9.975 17.1V18ZM14.95 18H18V17.1C17.7333 16.9333 17.4583 16.7875 17.175 16.6625C16.8917 16.5375 16.6 16.4333 16.3 16.35L14.95 18ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V7C17.7333 6.66667 17.4417 6.35 17.125 6.05C16.8083 5.75 16.4333 5.55 16 5.45V2H2V16H6.15C6.1 16.1833 6.0625 16.3667 6.0375 16.55C6.0125 16.7333 6 16.9167 6 17.1V18H2ZM4 6H11C11.4333 5.66667 11.9083 5.41667 12.425 5.25C12.9417 5.08333 13.4667 5 14 5V4H4V6ZM4 10H9C9 9.65 9.0375 9.30833 9.1125 8.975C9.1875 8.64167 9.29167 8.31667 9.425 8H4V10ZM4 14H7.45C7.63333 13.85 7.82917 13.7167 8.0375 13.6C8.24583 13.4833 8.45833 13.375 8.675 13.275V12H4V14ZM2 16V2V5.425V5V16Z"
        fill="currentColor"
      />
    </svg>
  `,
      paymentMethod: (size = 21) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${Math.round((size * 15) / 21)}"
      viewBox="0 0 21 15"
      fill="none"
      class="medos-icon medos-icon-payment"
    >
      <path
        d="M11.9038 8.096C11.2051 8.096 10.6138 7.854 10.1298 7.37C9.64575 6.886 9.40375 6.29467 9.40375 5.596C9.40375 4.89733 9.64575 4.306 10.1298 3.822C10.6138 3.338 11.2051 3.096 11.9038 3.096C12.6024 3.096 13.1938 3.338 13.6778 3.822C14.1618 4.306 14.4038 4.89733 14.4038 5.596C14.4038 6.29467 14.1618 6.886 13.6778 7.37C13.1938 7.854 12.6024 8.096 11.9038 8.096ZM5.3075 11.1923C4.8105 11.1923 4.385 11.0153 4.031 10.6613C3.677 10.3073 3.5 9.88167 3.5 9.3845V1.8075C3.5 1.3105 3.677 0.885 4.031 0.531C4.385 0.177 4.8105 0 5.3075 0H18.4998C18.9969 0 19.4225 0.177 19.7765 0.531C20.1305 0.885 20.3075 1.3105 20.3075 1.8075V9.3845C20.3075 9.88167 20.1305 10.3073 19.7765 10.6613C19.4225 11.0153 18.9969 11.1923 18.4998 11.1923H5.3075ZM6.8075 9.69225H17C17 9.19358 17.177 8.76758 17.531 8.41425C17.885 8.06108 18.3105 7.8845 18.8075 7.8845V3.3075C18.3088 3.3075 17.8829 3.1305 17.5298 2.7765C17.1766 2.4225 17 1.997 17 1.5H6.8075C6.8075 1.99867 6.6305 2.42458 6.2765 2.77775C5.9225 3.13092 5.497 3.3075 5 3.3075V7.8845C5.49867 7.8845 5.92458 8.0615 6.27775 8.4155C6.63092 8.7695 6.8075 9.19508 6.8075 9.69225ZM17.3267 14.6923H1.80775C1.31058 14.6923 0.885 14.5153 0.531 14.1613C0.177 13.8073 0 13.3817 0 12.8845V2.98075H1.5V12.8845C1.5 12.9613 1.532 13.0318 1.596 13.096C1.66017 13.1602 1.73075 13.1923 1.80775 13.1923H17.3267V14.6923ZM5.3075 9.69225H5V1.5H5.3075C5.22417 1.5 5.15208 1.53042 5.09125 1.59125C5.03042 1.65208 5 1.72417 5 1.8075V9.3845C5 9.46783 5.03042 9.53992 5.09125 9.60075C5.15208 9.66175 5.22417 9.69225 5.3075 9.69225Z"
        fill="currentColor"
      />
    </svg>
  `,
      successBadge: (size = 64, shapeColor = "#006E0F", checkColor = "white") => `
    <div style="position: relative; display: inline-block;">
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 41 41" fill="none">
        <path
          d="M31.1309 4.90254C32.388 4.98797 33.0166 5.03069 33.5247 5.25288C34.2598 5.57438 34.8467 6.16126 35.1682 6.8964C35.3904 7.40445 35.4331 8.03302 35.5185 9.29016L35.7135 12.159C35.748 12.6674 35.7653 12.9217 35.8206 13.1645C35.9004 13.5154 36.0391 13.8503 36.2308 14.1549C36.3634 14.3657 36.531 14.5576 36.8661 14.9416L38.7568 17.108C39.5853 18.0574 39.9996 18.532 40.2017 19.0484C40.4942 19.7955 40.4942 20.6255 40.2017 21.3727C39.9996 21.889 39.5853 22.3637 38.7568 23.313L36.8661 25.4795C36.531 25.8634 36.3634 26.0554 36.2308 26.2662C36.0391 26.5708 35.9004 26.9056 35.8206 27.2566C35.7653 27.4994 35.748 27.7536 35.7135 28.2621L35.5185 31.1309C35.4331 32.388 35.3904 33.0166 35.1682 33.5247C34.8467 34.2598 34.2598 34.8467 33.5247 35.1682C33.0166 35.3904 32.388 35.4331 31.1309 35.5185L28.2621 35.7135C27.7536 35.748 27.4994 35.7653 27.2566 35.8206C26.9056 35.9004 26.5708 36.0391 26.2662 36.2308C26.0554 36.3634 25.8634 36.531 25.4795 36.8661L23.313 38.7568C22.3637 39.5853 21.889 39.9996 21.3727 40.2017C20.6255 40.4942 19.7955 40.4942 19.0484 40.2017C18.532 39.9996 18.0574 39.5853 17.108 38.7568L14.9416 36.8661C14.5576 36.531 14.3657 36.3634 14.1549 36.2308C13.8503 36.0391 13.5154 35.9004 13.1645 35.8206C12.9217 35.7653 12.6674 35.748 12.159 35.7135L9.29016 35.5185C8.03302 35.4331 7.40445 35.3904 6.8964 35.1682C6.16126 34.8467 5.57438 34.2598 5.25288 33.5247C5.03069 33.0166 4.98797 32.388 4.90254 31.1309L4.70759 28.2621C4.67304 27.7536 4.65576 27.4994 4.60049 27.2566C4.52063 26.9056 4.38193 26.5708 4.19028 26.2662C4.05764 26.0554 3.89009 25.8634 3.555 25.4795L1.66428 23.313C0.83576 22.3637 0.421499 21.889 0.219363 21.3727C-0.073121 20.6255 -0.0731209 19.7955 0.219363 19.0484C0.421499 18.532 0.83576 18.0574 1.66428 17.108L3.555 14.9416C3.89009 14.5576 4.05764 14.3657 4.19027 14.1549C4.38193 13.8503 4.52063 13.5154 4.60049 13.1645C4.65576 12.9217 4.67304 12.6674 4.70759 12.159L4.90254 9.29016C4.98797 8.03302 5.03069 7.40445 5.25288 6.8964C5.57438 6.16126 6.16126 5.57438 6.8964 5.25288C7.40445 5.03069 8.03302 4.98797 9.29016 4.90254L12.159 4.70759C12.6674 4.67304 12.9217 4.65577 13.1645 4.6005C13.5154 4.52063 13.8503 4.38193 14.1549 4.19028C14.3657 4.05764 14.5576 3.89009 14.9416 3.555L17.108 1.66428C18.0574 0.83576 18.532 0.421499 19.0484 0.219363C19.7955 -0.073121 20.6255 -0.073121 21.3727 0.219363C21.889 0.421499 22.3637 0.83576 23.313 1.66428L25.4795 3.555C25.8634 3.89009 26.0554 4.05764 26.2662 4.19028C26.5708 4.38193 26.9056 4.52063 27.2566 4.6005C27.4994 4.65577 27.7536 4.67304 28.2621 4.70759L31.1309 4.90254Z"
          fill="${shapeColor}"
        />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="${Math.round((size * 16) / 41)}" height="${Math.round((size * 12) / 41)}" viewBox="0 0 16 12" fill="none" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <path
          d="M5.472 11.544L0 6.072L1.368 4.704L5.472 8.808L14.28 0L15.648 1.368L5.472 11.544Z"
          fill="${checkColor}"
        />
      </svg>
    </div>
  `,
      phone: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-phone"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  `,
      mail: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-mail"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,
      clock: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-clock"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,
      calendar: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-calendar"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  `,
      giftBox: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-gift"
    >
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  `,
      arrowLeft: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-arrow-left"
    >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  `,
      users: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-users"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,
      plus: (size = 20) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="medos-icon medos-icon-plus"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,
      medosLogo: (width = 120, height = 114) => `
    <svg
      width="${width}"
      height="${height}"
      viewBox="0 0 250 236"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="medos-icon medos-logo"
    >
      <g filter="url(#filter0_d_4215_30142)">
        <path
          d="M14.2067 123.859L21.2068 123.862L38.2027 67.687L55.7021 152.687L77.707 60.6836L93.7021 123.863L239.202 123.863"
          stroke="#27903F"
          stroke-width="4"
          stroke-linecap="round"
        />
      </g>
      <path
        d="M111.695 118.797C108.857 118.797 106.408 118.171 104.35 116.918C102.305 115.652 100.726 113.888 99.6136 111.625C98.5142 109.35 97.9645 106.703 97.9645 103.686C97.9645 100.669 98.5142 98.0103 99.6136 95.7092C100.726 93.3952 102.273 91.5927 104.254 90.3015C106.249 88.9975 108.575 88.3455 111.234 88.3455C112.768 88.3455 114.283 88.6012 115.779 89.1126C117.275 89.6239 118.636 90.4549 119.864 91.6055C121.091 92.7433 122.069 94.2518 122.798 96.131C123.526 98.0103 123.891 100.324 123.891 103.073V104.99H101.186V101.078H119.288C119.288 99.4165 118.956 97.9336 118.291 96.6296C117.639 95.3256 116.706 94.2965 115.491 93.5423C114.29 92.788 112.871 92.4109 111.234 92.4109C109.432 92.4109 107.872 92.8583 106.555 93.7532C105.251 94.6353 104.248 95.7859 103.545 97.2049C102.842 98.6239 102.49 100.145 102.49 101.769V104.377C102.49 106.601 102.874 108.487 103.641 110.034C104.42 111.568 105.501 112.738 106.881 113.543C108.262 114.336 109.866 114.732 111.695 114.732C112.884 114.732 113.957 114.566 114.916 114.233C115.888 113.888 116.725 113.377 117.428 112.699C118.131 112.009 118.675 111.152 119.058 110.13L123.43 111.357C122.97 112.84 122.197 114.144 121.11 115.269C120.023 116.381 118.681 117.25 117.083 117.877C115.485 118.49 113.689 118.797 111.695 118.797ZM141.897 118.797C139.442 118.797 137.276 118.177 135.396 116.937C133.517 115.684 132.047 113.92 130.986 111.645C129.925 109.356 129.394 106.652 129.394 103.533C129.394 100.439 129.925 97.7546 130.986 95.479C132.047 93.2035 133.523 91.4457 135.415 90.2056C137.308 88.9656 139.494 88.3455 141.974 88.3455C143.891 88.3455 145.406 88.6651 146.518 89.3043C147.643 89.9308 148.5 90.6467 149.088 91.4521C149.689 92.2447 150.156 92.8967 150.488 93.408H150.871V78.9109H155.397V118.184H151.025V113.658H150.488C150.156 114.195 149.683 114.873 149.069 115.691C148.455 116.496 147.58 117.218 146.442 117.858C145.304 118.484 143.789 118.797 141.897 118.797ZM142.511 114.732C144.326 114.732 145.86 114.259 147.113 113.313C148.366 112.354 149.318 111.031 149.97 109.343C150.622 107.643 150.948 105.681 150.948 103.456C150.948 101.257 150.629 99.3335 149.989 97.6843C149.35 96.0224 148.404 94.7312 147.151 93.8107C145.898 92.8775 144.352 92.4109 142.511 92.4109C140.593 92.4109 138.995 92.9031 137.717 93.8874C136.451 94.859 135.499 96.1822 134.859 97.8569C134.233 99.5188 133.92 101.385 133.92 103.456C133.92 105.553 134.239 107.458 134.879 109.171C135.531 110.871 136.489 112.226 137.755 113.236C139.033 114.233 140.619 114.732 142.511 114.732ZM199.138 98.5472C199.138 102.779 198.345 106.403 196.76 109.42C195.188 112.424 193.04 114.725 190.317 116.324C187.607 117.922 184.532 118.721 181.093 118.721C177.654 118.721 174.573 117.922 171.85 116.324C169.14 114.713 166.992 112.405 165.407 109.401C163.835 106.384 163.048 102.766 163.048 98.5472C163.048 94.3157 163.835 90.6978 165.407 87.6935C166.992 84.6765 169.14 82.369 171.85 80.7709C174.573 79.1729 177.654 78.3739 181.093 78.3739C184.532 78.3739 187.607 79.1729 190.317 80.7709C193.04 82.369 195.188 84.6765 196.76 87.6935C198.345 90.6978 199.138 94.3157 199.138 98.5472ZM191.985 98.5472C191.985 95.5685 191.518 93.0565 190.585 91.011C189.665 88.9528 188.386 87.3995 186.75 86.3512C185.114 85.2901 183.228 84.7596 181.093 84.7596C178.958 84.7596 177.072 85.2901 175.436 86.3512C173.8 87.3995 172.515 88.9528 171.582 91.011C170.661 93.0565 170.201 95.5685 170.201 98.5472C170.201 101.526 170.661 104.044 171.582 106.103C172.515 108.148 173.8 109.701 175.436 110.762C177.072 111.811 178.958 112.335 181.093 112.335C183.228 112.335 185.114 111.811 186.75 110.762C188.386 109.701 189.665 108.148 190.585 106.103C191.518 104.044 191.985 101.526 191.985 98.5472ZM227.207 89.707C227.028 88.0323 226.274 86.7283 224.944 85.7951C223.627 84.8619 221.914 84.3952 219.805 84.3952C218.322 84.3952 217.05 84.619 215.989 85.0664C214.928 85.5138 214.116 86.1211 213.553 86.8881C212.991 87.6552 212.703 88.5309 212.691 89.5153C212.691 90.3335 212.876 91.043 213.247 91.6438C213.63 92.2447 214.148 92.756 214.8 93.1779C215.452 93.587 216.174 93.9322 216.967 94.2134C217.759 94.4947 218.558 94.7312 219.364 94.9229L223.046 95.8434C224.529 96.1886 225.954 96.6552 227.322 97.2433C228.703 97.8313 229.936 98.5728 231.023 99.4677C232.122 100.363 232.992 101.443 233.631 102.708C234.27 103.974 234.59 105.457 234.59 107.157C234.59 109.458 234.002 111.485 232.825 113.236C231.649 114.975 229.949 116.336 227.725 117.321C225.513 118.292 222.835 118.778 219.69 118.778C216.634 118.778 213.982 118.305 211.732 117.359C209.494 116.413 207.743 115.032 206.477 113.217C205.225 111.402 204.547 109.19 204.445 106.582H211.444C211.546 107.95 211.968 109.088 212.71 109.995C213.451 110.903 214.416 111.581 215.605 112.028C216.807 112.475 218.149 112.699 219.632 112.699C221.179 112.699 222.534 112.469 223.698 112.009C224.874 111.536 225.794 110.884 226.459 110.053C227.124 109.209 227.463 108.225 227.475 107.1C227.463 106.077 227.162 105.233 226.574 104.569C225.986 103.891 225.161 103.328 224.1 102.881C223.052 102.421 221.825 102.012 220.419 101.654L215.95 100.503C212.716 99.6722 210.159 98.413 208.28 96.7255C206.414 95.0252 205.48 92.7688 205.48 89.9563C205.48 87.6424 206.107 85.6161 207.36 83.8775C208.625 82.1388 210.345 80.7901 212.518 79.8313C214.691 78.8597 217.152 78.3739 219.901 78.3739C222.688 78.3739 225.129 78.8597 227.226 79.8313C229.335 80.7901 230.991 82.1261 232.193 83.8391C233.394 85.5394 234.014 87.4954 234.053 89.707H227.207Z"
        fill="#27903F"
      />
      <defs>
        <filter
          id="filter0_d_4215_30142"
          x="12.2031"
          y="60.1914"
          width="237"
          height="100.961"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="4" dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.152941 0 0 0 0 0.564706 0 0 0 0 0.247059 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4215_30142"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4215_30142"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  `,
  };

  function injectSelectStyles() {
      if (typeof document === "undefined")
          return;
      const styleId = "medos-vanilla-select-styles";
      if (document.getElementById(styleId))
          return;
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.innerHTML = `
    /* Container */
    .medos-select-container {
      position: relative;
      display: inline-block;
      width: 100%;
    }

    /* Trigger Button */
    .medos-select-trigger {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      border-radius: var(--medos-radius-md, 8px);
      border: 1px solid var(--medos-color-border, #e5e7eb);
      background-color: var(--medos-color-surface, #fff);
      padding: var(--medos-spacing-sm, 10px) var(--medos-spacing-md, 12px);
      font-size: var(--medos-typography-font-size-sm, 14px);
      line-height: 1.5;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: var(--medos-transition-normal, 200ms ease-in-out);
      cursor: pointer;
      outline: none;
      font-family: inherit;
      text-align: left;
      box-sizing: border-box;
      color: var(--medos-color-text, #111827);
      min-height: 40px;
    }

    .medos-select-trigger:hover:not(:disabled) {
      border-color: var(--medos-color-border-hover, #d1d5db);
      background-color: #f8fafc;
    }

    .medos-select-trigger:focus:not(:disabled) {
      border-color: var(--medos-color-primary, #27903f);
      box-shadow: 0 0 0 2px rgba(39, 144, 63, 0.15);
    }

    .medos-select-trigger:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      background-color: #f9fafb;
    }

    .medos-select-trigger-error {
      border-color: #ef4444;
    }

    .medos-select-trigger-error:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }

    .medos-select-trigger[aria-expanded="true"] {
      border-color: var(--medos-color-primary, #27903f);
      box-shadow: 0 0 0 2px rgba(39, 144, 63, 0.15);
    }

    /* Select Value */
    .medos-select-value {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
    }

    .medos-select-placeholder {
      color: #94a3b8;
    }

    /* Select Icon */
    .medos-select-icon {
      height: 16px;
      width: 16px;
      opacity: 0.5;
      flex-shrink: 0;
      margin-left: 8px;
      transition: transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .medos-select-trigger[aria-expanded="true"] .medos-select-icon {
      transform: rotate(180deg);
    }

    .medos-select-icon-error {
      color: #ef4444;
    }

    /* Content Dropdown - Portal */
    .medos-select-content {
      position: absolute;
      z-index: 99999;
      overflow: hidden;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background-color: #ffffff;
      color: #1e293b;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      animation: medos-select-show 0.15s ease-out;
      box-sizing: border-box;
      min-width: 180px;
    }

    @keyframes medos-select-show {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Viewport */
    .medos-select-viewport {
      padding: 4px;
      max-height: 256px;
      overflow-y: auto;
    }

    /* Select Item */
    .medos-select-item {
      position: relative;
      display: flex;
      width: 100%;
      cursor: pointer;
      user-select: none;
      align-items: center;
      border-radius: 4px;
      padding: 8px 8px 8px 32px;
      font-size: 14px;
      outline: none;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      color: #1e293b;
      min-height: 36px;
    }

    .medos-select-item:hover:not(.medos-select-item-disabled) {
      background-color: #f1f5f9;
    }

    .medos-select-item:focus {
      background-color: #f1f5f9;
    }

    .medos-select-item-selected {
      background-color: #f3f4f6;
      font-weight: 500;
    }

    .medos-select-item-disabled {
      pointer-events: none;
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Item Indicator */
    .medos-select-item-indicator {
      position: absolute;
      left: 8px;
      display: flex;
      height: 14px;
      width: 14px;
      align-items: center;
      justify-content: center;
      color: var(--medos-color-primary, #27903f);
    }

    /* Item Text */
    .medos-select-item-text {
      flex: 1;
      display: flex;
      align-items: center;
    }

    /* Scrollbar styling */
    .medos-select-viewport::-webkit-scrollbar {
      width: 8px;
    }

    .medos-select-viewport::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .medos-select-viewport::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .medos-select-viewport::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Label styling for forms */
    .medos-form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      color: #374151;
    }

    .medos-form-group {
      margin-bottom: 16px;
    }

    /* Contact method specific styling */
    .medos-contact-method-container {
      margin-top: 8px;
    }
  `;
      document.head.appendChild(styleElement);
  }
  class VanillaSelect {
      constructor(container, options, config = {}) {
          this.selectedValue = "";
          this.selectedLabel = "";
          this.isOpen = false;
          this.triggerElement = null;
          this.contentElement = null;
          this.handleDocumentClick = null;
          this.handleWindowResize = null;
          this.handleWindowScroll = null;
          if (typeof container === "string") {
              const el = document.getElementById(container);
              if (!el) {
                  throw new Error(`Container element with id "${container}" not found`);
              }
              this.container = el;
          }
          else {
              this.container = container;
          }
          this.options = options;
          this.config = {
              placeholder: "Select...",
              disabled: false,
              error: false,
              ...config,
          };
          injectSelectStyles();
          this.renderTrigger();
      }
      renderTrigger() {
          const displayValue = this.selectedLabel || this.config.placeholder;
          const isPlaceholder = !this.selectedLabel;
          this.container.innerHTML = "";
          this.container.classList.add("medos-select-container");
          const button = document.createElement("button");
          button.type = "button";
          button.className = `medos-select-trigger ${this.config.error ? "medos-select-trigger-error" : ""}`;
          button.setAttribute("aria-expanded", this.isOpen.toString());
          button.setAttribute("aria-haspopup", "listbox");
          button.setAttribute("aria-label", "Select option");
          if (this.config.disabled) {
              button.disabled = true;
          }
          button.innerHTML = `
      <span class="medos-select-value ${isPlaceholder ? "medos-select-placeholder" : ""}">
        ${this.escapeHtml(displayValue || "")}
      </span>
      <span class="medos-select-icon ${this.config.error ? "medos-select-icon-error" : ""}">
        ${VanillaIcons.chevronDown(16)}
      </span>
    `;
          this.container.appendChild(button);
          this.triggerElement = button;
          this.attachTriggerEvents();
      }
      attachTriggerEvents() {
          if (!this.triggerElement)
              return;
          this.triggerElement.addEventListener("click", (e) => {
              e.preventDefault();
              if (!this.config.disabled) {
                  this.toggleOpen();
              }
          });
          this.triggerElement.addEventListener("keydown", (e) => {
              if (this.config.disabled)
                  return;
              if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                  e.preventDefault();
                  this.open();
              }
              else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  this.open();
              }
          });
      }
      toggleOpen() {
          if (this.isOpen) {
              this.close();
          }
          else {
              this.open();
          }
      }
      open() {
          if (this.isOpen || this.config.disabled)
              return;
          this.isOpen = true;
          if (this.triggerElement) {
              this.triggerElement.setAttribute("aria-expanded", "true");
          }
          this.createPortal();
          this.attachPortalEvents();
          setTimeout(() => {
              if (this.contentElement) {
                  const selectedItem = this.contentElement.querySelector(".medos-select-item-selected");
                  const firstItem = this.contentElement.querySelector(".medos-select-item:not(.medos-select-item-disabled)");
                  (selectedItem || firstItem)?.focus();
              }
          }, 0);
      }
      close() {
          if (!this.isOpen)
              return;
          this.isOpen = false;
          if (this.triggerElement) {
              this.triggerElement.setAttribute("aria-expanded", "false");
              this.triggerElement.focus();
          }
          this.removePortal();
          this.detachPortalEvents();
      }
      createPortal() {
          if (!this.triggerElement)
              return;
          const rect = this.triggerElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          this.contentElement = document.createElement("div");
          this.contentElement.className = "medos-select-content";
          this.contentElement.setAttribute("role", "listbox");
          this.contentElement.setAttribute("aria-label", "Options");
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const dropdownHeight = Math.min(256, this.options.length * 36 + 8);
          let top = rect.bottom + scrollTop + 4;
          if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
              top = rect.top + scrollTop - dropdownHeight - 4;
          }
          this.contentElement.style.top = `${top}px`;
          this.contentElement.style.left = `${rect.left + scrollLeft}px`;
          this.contentElement.style.width = `${Math.max(rect.width, 180)}px`;
          this.contentElement.innerHTML = `
      <div class="medos-select-viewport">
        ${this.options
            .map((option) => `
          <div
            class="medos-select-item ${this.selectedValue === option.value
            ? "medos-select-item-selected"
            : ""} ${option.disabled ? "medos-select-item-disabled" : ""}"
            role="option"
            aria-selected="${this.selectedValue === option.value}"
            data-value="${this.escapeHtml(option.value)}"
            data-label="${this.escapeHtml(option.label)}"
            ${option.disabled ? 'data-disabled="true"' : ""}
            tabindex="${option.disabled ? "-1" : "0"}"
            aria-label="${this.escapeHtml(option.label)}"
          >
            ${this.selectedValue === option.value
            ? `
              <span class="medos-select-item-indicator">
                ${VanillaIcons.check(14)}
              </span>
            `
            : ""}
            <span class="medos-select-item-text">${this.escapeHtml(option.label)}</span>
          </div>
        `)
            .join("")}
      </div>
    `;
          document.body.appendChild(this.contentElement);
      }
      removePortal() {
          this.contentElement?.remove();
          this.contentElement = null;
      }
      updatePosition() {
          if (!this.isOpen || !this.triggerElement || !this.contentElement)
              return;
          const rect = this.triggerElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const dropdownHeight = Math.min(256, this.options.length * 36 + 8);
          let top = rect.bottom + scrollTop + 4;
          if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
              top = rect.top + scrollTop - dropdownHeight - 4;
          }
          this.contentElement.style.top = `${top}px`;
          this.contentElement.style.left = `${rect.left + scrollLeft}px`;
          this.contentElement.style.width = `${Math.max(rect.width, 180)}px`;
      }
      attachPortalEvents() {
          this.handleDocumentClick = (e) => {
              const target = e.target;
              if (this.isOpen &&
                  this.contentElement &&
                  !this.contentElement.contains(target) &&
                  this.triggerElement &&
                  !this.triggerElement.contains(target)) {
                  this.close();
              }
          };
          document.addEventListener("mousedown", this.handleDocumentClick);
          this.handleWindowResize = () => this.updatePosition();
          this.handleWindowScroll = () => this.updatePosition();
          window.addEventListener("resize", this.handleWindowResize);
          window.addEventListener("scroll", this.handleWindowScroll, true);
          if (this.contentElement) {
              this.contentElement.addEventListener("click", (e) => {
                  const target = e.target;
                  const item = target.closest(".medos-select-item");
                  if (item && !item.dataset.disabled) {
                      const value = item.dataset.value || "";
                      const label = item.dataset.label || "";
                      this.selectValue(value, label);
                  }
              });
              this.contentElement.addEventListener("keydown", (e) => {
                  if (e.key === "Escape") {
                      this.close();
                  }
                  else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      this.focusNextItem(1);
                  }
                  else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      this.focusNextItem(-1);
                  }
                  else if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const focused = document.activeElement;
                      if (focused &&
                          focused.classList.contains("medos-select-item") &&
                          !focused.dataset.disabled) {
                          const value = focused.dataset.value || "";
                          const label = focused.dataset.label || "";
                          this.selectValue(value, label);
                      }
                  }
                  else if (e.key === "Home") {
                      e.preventDefault();
                      this.focusFirstItem();
                  }
                  else if (e.key === "End") {
                      e.preventDefault();
                      this.focusLastItem();
                  }
              });
          }
      }
      detachPortalEvents() {
          if (this.handleDocumentClick) {
              document.removeEventListener("mousedown", this.handleDocumentClick);
              this.handleDocumentClick = null;
          }
          if (this.handleWindowResize) {
              window.removeEventListener("resize", this.handleWindowResize);
              this.handleWindowResize = null;
          }
          if (this.handleWindowScroll) {
              window.removeEventListener("scroll", this.handleWindowScroll, true);
              this.handleWindowScroll = null;
          }
      }
      focusNextItem(direction) {
          if (!this.contentElement)
              return;
          const items = Array.from(this.contentElement.querySelectorAll(".medos-select-item:not(.medos-select-item-disabled)"));
          if (items.length === 0)
              return;
          const currentFocused = document.activeElement;
          let currentIndex = items.indexOf(currentFocused);
          if (currentIndex === -1) {
              const targetIndex = direction > 0 ? 0 : items.length - 1;
              items[targetIndex]?.focus();
              return;
          }
          let nextIndex = currentIndex + direction;
          if (nextIndex < 0)
              nextIndex = items.length - 1;
          if (nextIndex >= items.length)
              nextIndex = 0;
          items[nextIndex]?.focus();
      }
      focusFirstItem() {
          if (!this.contentElement)
              return;
          const firstItem = this.contentElement.querySelector(".medos-select-item:not(.medos-select-item-disabled)");
          firstItem?.focus();
      }
      focusLastItem() {
          if (!this.contentElement)
              return;
          const items = this.contentElement.querySelectorAll(".medos-select-item:not(.medos-select-item-disabled)");
          const lastItem = items[items.length - 1];
          lastItem?.focus();
      }
      selectValue(value, label) {
          this.selectedValue = value;
          this.selectedLabel = label;
          this.close();
          this.renderTrigger();
          this.config.onValueChange?.(value);
      }
      setValue(value) {
          const option = this.options.find((o) => o.value === value);
          if (option) {
              this.selectedValue = option.value;
              this.selectedLabel = option.label;
              this.renderTrigger();
          }
      }
      getValue() {
          return this.selectedValue;
      }
      setOptions(options) {
          this.options = options;
          if (!options.some((o) => o.value === this.selectedValue)) {
              this.selectedValue = "";
              this.selectedLabel = "";
          }
          this.renderTrigger();
      }
      setDisabled(disabled) {
          this.config.disabled = disabled;
          this.renderTrigger();
      }
      setError(error) {
          this.config.error = error;
          this.renderTrigger();
      }
      destroy() {
          this.close();
          this.container.innerHTML = "";
      }
      escapeHtml(text) {
          const div = document.createElement("div");
          div.textContent = text;
          return div.innerHTML;
      }
  }
  function createContactMethodSelect(container, currentValue = "PHONE", onValueChange) {
      const contactOptions = [
          { value: "PHONE", label: "Phone" },
          { value: "EMAIL", label: "Email" },
          { value: "BOTH", label: "Both" },
      ];
      const select = new VanillaSelect(container, contactOptions, {
          placeholder: "Select contact method",
          onValueChange: (value) => {
              onValueChange?.(value);
          },
      });
      select.setValue(currentValue);
      return select;
  }

  function injectCalendarStyles() {
      if (typeof document === "undefined")
          return;
      const styleId = "medos-vanilla-calendar-styles";
      if (document.getElementById(styleId))
          return;
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.innerHTML = `
    .medos-calendar-wrapper {
      overflow-x: auto;
      overflow-y: visible;
      -webkit-overflow-scrolling: touch;
    }

    .medos-calendar {
      width: 340px;
      background-color: var(--medos-color-background, #ffffff);
      border-radius: var(--medos-radius-md, 8px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      padding: 16px;
      font-family: var(--medos-typography-font-family, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial);
      border: 1px solid var(--medos-color-border, #e5e7eb);
      box-sizing: border-box;
    }

    @media (max-width: 767px) {
      .medos-calendar {
        width: 320px;
        min-width: 320px;
      }
    }

    .medos-calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .medos-calendar-month {
      font-size: 14px;
      font-weight: 600;
      color: var(--medos-color-text, #111827);
      margin: 0;
    }

    .medos-calendar-nav {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--medos-color-secondary, #6b7280);
      cursor: pointer;
      border-radius: var(--medos-radius-sm, 4px);
      transition: background-color 0.2s;
      border: none;
      background: transparent;
      padding: 0;
    }

    .medos-calendar-nav:hover {
      background-color: var(--medos-color-background-secondary, #f3f4f6);
    }

    .medos-calendar-days-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--medos-color-text, #111827);
    }

    .medos-calendar-day-name {
      padding: 4px 0;
    }

    .medos-calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      text-align: center;
    }

    .medos-calendar-day {
      width: 38px;
      height: 38px;
      border: 1px solid transparent;
      border-radius: var(--medos-radius-md, 8px);
      color: var(--medos-color-secondary, #6b7280);
      background-color: transparent;
      font-size: 14px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      padding: 0;
      font-family: inherit;
    }

    .medos-calendar-day span {
      line-height: 1;
    }

    .medos-calendar-day:hover:not(.medos-calendar-day-disabled):not(.medos-calendar-day-selected) {
      background-color: var(--medos-color-secondary, #6b7280);
      color: var(--medos-color-text-on-secondary, #ffffff);
    }

    .medos-calendar-day-selected {
      border: 1px solid var(--medos-color-secondary, #6b7280);
      color: var(--medos-color-secondary, #6b7280);
      background-color: transparent;
      font-weight: 600;
    }

    .medos-calendar-day-today {
      background-color: var(--medos-color-primary, #27903f);
      color: white;
    }

    .medos-calendar-day-today:hover:not(.medos-calendar-day-selected) {
      background-color: var(--medos-color-primary-hover, #218838);
    }

    .medos-calendar-day-disabled {
      color: var(--medos-color-text-secondary, #9ca3af);
      opacity: 0.4;
      cursor: not-allowed;
    }

    .medos-calendar-day-disabled:hover {
      background-color: transparent;
      color: var(--medos-color-text-secondary, #9ca3af);
    }

    .medos-calendar-dot {
      font-size: 10px;
      margin-top: -2px;
      line-height: 1;
    }

    .medos-calendar-empty {
      visibility: hidden;
      width: 38px;
      height: 38px;
    }
  `;
      document.head.appendChild(styleElement);
  }
  class VanillaCalendar {
      constructor(container, config = {}) {
          this.selectedDate = null;
          if (typeof container === "string") {
              const el = document.getElementById(container);
              if (!el) {
                  throw new Error(`Container element with id "${container}" not found`);
              }
              this.container = el;
          }
          else {
              this.container = container;
          }
          this.config = {
              pastDisabled: false,
              ...config,
          };
          this.today = new Date();
          this.today.setHours(0, 0, 0, 0);
          if (config.selectedDate) {
              this.selectedDate = new Date(config.selectedDate);
              this.selectedDate.setHours(0, 0, 0, 0);
              this.currentMonth = this.selectedDate.getMonth();
              this.currentYear = this.selectedDate.getFullYear();
          }
          else {
              this.currentMonth = this.today.getMonth();
              this.currentYear = this.today.getFullYear();
          }
          injectCalendarStyles();
          this.render();
          this.attachEventListeners();
      }
      getDaysInMonth(year, month) {
          return new Date(year, month + 1, 0).getDate();
      }
      getFirstDayOfMonth(year, month) {
          return new Date(year, month, 1).getDay();
      }
      isSameDate(d1, d2) {
          return (d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate());
      }
      isBeforeToday(date) {
          const todayStart = new Date(this.today);
          todayStart.setHours(0, 0, 0, 0);
          return date < todayStart;
      }
      render() {
          const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
          const firstDayOfMonth = this.getFirstDayOfMonth(this.currentYear, this.currentMonth);
          const startOffset = (firstDayOfMonth + 6) % 7;
          const emptyCells = Array.from({ length: startOffset })
              .map((_, idx) => `<div class="medos-calendar-empty" key="empty-${idx}"></div>`)
              .join("");
          const dayCells = Array.from({ length: daysInMonth })
              .map((_, i) => {
              const dayNum = i + 1;
              const date = new Date(this.currentYear, this.currentMonth, dayNum);
              const disabled = this.config.pastDisabled && this.isBeforeToday(date);
              const isSelected = this.selectedDate && this.isSameDate(this.selectedDate, date);
              const isToday = this.isSameDate(this.today, date);
              const classes = [
                  "medos-calendar-day",
                  isSelected ? "medos-calendar-day-selected" : "",
                  isToday && !isSelected ? "medos-calendar-day-today" : "",
                  disabled ? "medos-calendar-day-disabled" : "",
              ]
                  .filter(Boolean)
                  .join(" ");
              return `
          <button
            class="${classes}"
            ${disabled ? "disabled" : ""}
            data-day="${dayNum}"
            data-date="${this.currentYear}-${String(this.currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}"
          >
            <span>${dayNum}</span>
            ${isSelected ? '<span class="medos-calendar-dot">•</span>' : ""}
          </button>
        `;
          })
              .join("");
          this.container.innerHTML = `
      <div class="medos-calendar-wrapper">
        <div class="medos-calendar">
          <div class="medos-calendar-header">
            <button class="medos-calendar-nav" data-action="prev" type="button">
              ${VanillaIcons.chevronLeft(20)}
            </button>
            <p class="medos-calendar-month">
              ${VanillaCalendar.MONTHS[this.currentMonth]} ${this.currentYear}
            </p>
            <button class="medos-calendar-nav" data-action="next" type="button">
              ${VanillaIcons.chevronRight(20)}
            </button>
          </div>

          <div class="medos-calendar-days-header">
            ${VanillaCalendar.DAYS_OF_WEEK.map((d) => `<div class="medos-calendar-day-name">${d}</div>`).join("")}
          </div>

          <div class="medos-calendar-grid">
            ${emptyCells}
            ${dayCells}
          </div>
        </div>
      </div>
    `;
      }
      attachEventListeners() {
          this.container.addEventListener("click", (e) => {
              const target = e.target;
              const navButton = target.closest(".medos-calendar-nav");
              if (navButton) {
                  const action = navButton.getAttribute("data-action");
                  if (action === "prev") {
                      this.prevMonth();
                  }
                  else if (action === "next") {
                      this.nextMonth();
                  }
                  return;
              }
              const dayButton = target.closest(".medos-calendar-day");
              if (dayButton && !dayButton.disabled) {
                  const dateStr = dayButton.getAttribute("data-date");
                  if (dateStr) {
                      const [year, month, day] = dateStr.split("-").map(Number);
                      const selectedDate = new Date(year, month - 1, day);
                      this.selectDate(selectedDate);
                  }
              }
          });
      }
      prevMonth() {
          if (this.currentMonth === 0) {
              this.currentMonth = 11;
              this.currentYear -= 1;
          }
          else {
              this.currentMonth -= 1;
          }
          this.render();
          this.attachEventListeners();
      }
      nextMonth() {
          if (this.currentMonth === 11) {
              this.currentMonth = 0;
              this.currentYear += 1;
          }
          else {
              this.currentMonth += 1;
          }
          this.render();
          this.attachEventListeners();
      }
      selectDate(date) {
          this.selectedDate = date;
          this.render();
          this.attachEventListeners();
          this.config.onSelect?.(date);
      }
      setSelectedDate(date) {
          if (date) {
              this.selectedDate = new Date(date);
              this.selectedDate.setHours(0, 0, 0, 0);
              this.currentMonth = this.selectedDate.getMonth();
              this.currentYear = this.selectedDate.getFullYear();
          }
          else {
              this.selectedDate = null;
          }
          this.render();
          this.attachEventListeners();
      }
      getSelectedDate() {
          return this.selectedDate;
      }
      goToDate(date) {
          this.currentMonth = date.getMonth();
          this.currentYear = date.getFullYear();
          this.render();
          this.attachEventListeners();
      }
      goToToday() {
          this.currentMonth = this.today.getMonth();
          this.currentYear = this.today.getFullYear();
          this.render();
          this.attachEventListeners();
      }
      setPastDisabled(disabled) {
          this.config.pastDisabled = disabled;
          this.render();
          this.attachEventListeners();
      }
      destroy() {
          this.container.innerHTML = "";
      }
  }
  VanillaCalendar.DAYS_OF_WEEK = [
      "Mo",
      "Tu",
      "We",
      "Th",
      "Fr",
      "Sa",
      "Su",
  ];
  VanillaCalendar.MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
  ];

  function injectThemedStyles() {
      if (typeof document === "undefined")
          return;
      const styleId = "medos-themed-styles";
      if (document.getElementById(styleId))
          return;
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.innerHTML = `
/* Default Theme Variables */
:root {
  /* Colors */
  --medos-color-primary: #27903f;
  --medos-color-primary-dark: #1e7032;
  --medos-color-primary-hover: #1e7032;
  --medos-color-background: #ffffff;
  --medos-color-background-secondary: #f9fafb;
  --medos-color-surface: #ffffff;
  --medos-color-surface-hover: #f9fafb;
  --medos-color-text: #111827;
  --medos-color-text-secondary: #374151;
  --medos-color-text-muted: #9ca3af;
  --medos-color-text-on-primary: #ffffff;
  --medos-color-border: #e5e7eb;
  --medos-color-border-hover: #d1d5db;
  --medos-color-border-focus: #27903f;
  --medos-color-error: #ef4444;
  --medos-color-error-background: #fee2e2;
  --medos-color-error-border: #fca5a5;
  --medos-color-success: #10b981;
  --medos-color-success-background: #ecfdf5;
  
  /* Typography */
  --medos-typography-font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --medos-typography-font-size-xs: 12px;
  --medos-typography-font-size-sm: 14px;
  --medos-typography-font-size-md: 16px;
  --medos-typography-font-size-lg: 18px;
  --medos-typography-font-size-xl: 20px;
  --medos-typography-font-weight-normal: 400;
  --medos-typography-font-weight-medium: 500;
  --medos-typography-font-weight-semibold: 600;
  
  /* Spacing */
  --medos-spacing-xs: 4px;
  --medos-spacing-sm: 8px;
  --medos-spacing-md: 12px;
  --medos-spacing-lg: 16px;
  --medos-spacing-xl: 20px;
  --medos-spacing-2xl: 24px;
  
  /* Radius */
  --medos-radius-sm: 4px;
  --medos-radius-md: 8px;
  --medos-radius-lg: 12px;
  --medos-radius-full: 999px;
  
  /* Shadows */
  --medos-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --medos-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --medos-shadow-lg: 0 8px 24px rgba(16, 24, 40, 0.08);
  
  /* Transitions */
  --medos-transition-normal: 200ms ease-in-out;
}

/* Container & Card */
.medos-appointment-container {
  display: flex;
  justify-content: center;
  padding: var(--medos-spacing-xl, 20px);
  font-family: var(--medos-typography-font-family);
  background: var(--medos-color-background, #f6f8fa);
}

.medos-appointment-card {
  width: 100%;
  max-width: 720px;
  background: var(--medos-color-surface, #fff);
  border-radius: var(--medos-radius-lg, 12px);
  box-shadow: var(--medos-shadow-lg);
  padding: var(--medos-spacing-2xl, 24px);
  box-sizing: border-box;
}

/* Section Cards */
.medos-section-card {
  background: var(--medos-color-surface, #fff);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-lg, 12px);
  margin-bottom: var(--medos-spacing-lg, 16px);
  overflow: visible;
}

.medos-section-header {
  display: flex;
  align-items: center;
  gap: var(--medos-spacing-sm, 8px);
  padding: var(--medos-spacing-md, 12px) var(--medos-spacing-lg, 16px);
  background: var(--medos-color-background-secondary, #f9fafb);
  border-bottom: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-lg, 12px) var(--medos-radius-lg, 12px) 0 0;
}

.medos-section-header svg {
  color: var(--medos-color-primary, #27903f);
  flex-shrink: 0;
}

.medos-section-title {
  font-size: var(--medos-typography-font-size-sm, 14px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
  margin: 0;
}

.medos-section-body {
  padding: var(--medos-spacing-lg, 16px);
}

.medos-section-description {
  margin: 0 0 var(--medos-spacing-md, 12px) 0;
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text-secondary, #6b7280);
}

/* Form Groups */
.medos-form-group {
  margin-bottom: var(--medos-spacing-md, 12px);
}

.medos-form-row {
  display: flex;
  gap: var(--medos-spacing-md, 12px);
}

.medos-form-row .medos-form-group {
  flex: 1;
}

.medos-label {
  display: block;
  font-size: var(--medos-typography-font-size-xs, 13px);
  font-weight: var(--medos-typography-font-weight-medium, 500);
  color: var(--medos-color-text-secondary, #374151);
  margin-bottom: var(--medos-spacing-xs, 6px);
}

.medos-required {
  color: var(--medos-color-error, #ef4444);
}

/* Inputs */
.medos-input,
.medos-textarea {
  width: 100%;
  padding: var(--medos-spacing-sm, 10px) var(--medos-spacing-md, 12px);
  border-radius: var(--medos-radius-md, 8px);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  outline: none;
  font-size: var(--medos-typography-font-size-sm, 14px);
  box-sizing: border-box;
  font-family: inherit;
  color: var(--medos-color-text, #111827);
  background: var(--medos-color-surface, #fff);
  transition: var(--medos-transition-normal);
}

.medos-input:focus,
.medos-textarea:focus {
  border-color: var(--medos-color-primary, #27903f);
  box-shadow: 0 0 0 2px rgba(39, 144, 63, 0.15);
}

/* Buttons */
.medos-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--medos-spacing-xs, 6px);
  padding: var(--medos-spacing-sm, 10px) var(--medos-spacing-lg, 16px);
  border-radius: var(--medos-radius-md, 8px);
  font-size: var(--medos-typography-font-size-sm, 14px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  cursor: pointer;
  border: none;
  transition: var(--medos-transition-normal);
  font-family: inherit;
}

.medos-btn-primary {
  background: var(--medos-color-primary, #27903f);
  color: var(--medos-color-text-on-primary, #fff);
}

.medos-btn-primary:hover:not(:disabled) {
  background: var(--medos-color-primary-dark, #1e7032);
}

.medos-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.medos-btn-secondary {
  background: var(--medos-color-surface, #fff);
  color: var(--medos-color-text, #111827);
  border: 1px solid var(--medos-color-border, #e5e7eb);
}

.medos-btn-secondary:hover:not(:disabled) {
  background: var(--medos-color-background-secondary, #f9fafb);
  border-color: var(--medos-color-border-hover, #d1d5db);
}

.medos-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--medos-spacing-md, 12px);
  margin-top: var(--medos-spacing-lg, 16px);
}

/* Radio Options */
.medos-radio-option {
  display: flex;
  align-items: center;
  gap: var(--medos-spacing-sm, 8px);
  padding: var(--medos-spacing-sm, 10px) var(--medos-spacing-md, 12px);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-md, 8px);
  cursor: pointer;
  transition: var(--medos-transition-normal);
  margin-bottom: var(--medos-spacing-xs, 4px);
}

.medos-radio-option:hover {
  border-color: var(--medos-color-primary, #27903f);
  background: var(--medos-color-surface-hover, #f9fafb);
}

.medos-radio-option.selected {
  border-color: var(--medos-color-primary, #27903f);
  background: rgba(39, 144, 63, 0.05);
}

/* Booking Option Cards */
.medos-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--medos-spacing-lg, 16px);
}

.medos-option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--medos-spacing-2xl, 24px);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-lg, 12px);
  cursor: pointer;
  transition: var(--medos-transition-normal);
  text-align: center;
  background-color: var(--medos-color-surface, #fff);
  box-shadow: var(--medos-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04));
}

.medos-option-card:hover {
  border-color: var(--medos-color-primary, #27903f);
  background: var(--medos-color-surface-hover, #f9fafb);
}

.medos-option-card.selected {
  border-color: var(--medos-color-primary, #27903f);
  background: rgba(39, 144, 63, 0.08);
  box-shadow: 0 0 0 1px var(--medos-color-primary, #27903f);
}

.medos-option-icon {
  font-size: 32px;
  margin-bottom: var(--medos-spacing-md, 12px);
}

.medos-option-title {
  margin: 0 0 var(--medos-spacing-sm, 8px) 0;
  font-size: var(--medos-typography-font-size-md, 16px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
}

.medos-option-description {
  margin: 0;
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text-secondary, #6b7280);
  line-height: 1.5;
}

.medos-session-pack-badge {
  margin-top: var(--medos-spacing-md, 12px);
  padding: 6px 14px;
  background-color: var(--medos-color-success-background, #dcfce7);
  color: var(--medos-color-success, #166534);
  border-radius: var(--medos-radius-full, 999px);
  font-size: var(--medos-typography-font-size-xs, 12px);
  font-weight: var(--medos-typography-font-weight-medium, 500);
}

/* Session Pack Cards */
.medos-session-packs-section {
  margin-bottom: var(--medos-spacing-sm, 8px);
}

.medos-session-packs-title {
  margin: 0 0 var(--medos-spacing-lg, 16px) 0;
  font-size: 15px;
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
}

.medos-session-packs-list {
  display: flex;
  flex-direction: column;
  gap: var(--medos-spacing-md, 12px);
}

.medos-session-pack-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--medos-spacing-lg, 16px);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-lg, 12px);
  cursor: pointer;
  transition: var(--medos-transition-normal);
  background-color: var(--medos-color-surface, #fff);
}

.medos-session-pack-card:hover {
  border-color: var(--medos-color-primary, #27903f);
  background: var(--medos-color-surface-hover, #f9fafb);
}

.medos-session-pack-card.selected {
  border-color: var(--medos-color-primary, #27903f);
  background: rgba(39, 144, 63, 0.08);
}

.medos-session-pack-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.medos-session-pack-name {
  font-size: var(--medos-typography-font-size-sm, 14px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
}

.medos-session-pack-remaining {
  font-size: 13px;
  color: var(--medos-color-text-secondary, #6b7280);
}

.medos-session-pack-doctor {
  font-size: 13px;
  color: var(--medos-color-text-secondary, #6b7280);
}

.medos-session-pack-expiry {
  font-size: var(--medos-typography-font-size-xs, 12px);
  color: var(--medos-color-error, #dc2626);
  font-weight: var(--medos-typography-font-weight-medium, 500);
}

/* Package Cards */
.medos-packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--medos-spacing-lg, 16px);
}

.medos-package-card {
  display: flex;
  flex-direction: column;
  padding: var(--medos-spacing-xl, 20px);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-lg, 12px);
  cursor: pointer;
  transition: var(--medos-transition-normal);
  background-color: var(--medos-color-surface, #fff);
  box-shadow: var(--medos-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04));
}

.medos-package-card:hover {
  border-color: var(--medos-color-primary, #27903f);
  background: var(--medos-color-surface-hover, #f9fafb);
}

.medos-package-card.selected {
  border-color: var(--medos-color-primary, #27903f);
  background: rgba(39, 144, 63, 0.08);
  box-shadow: 0 0 0 1px var(--medos-color-primary, #27903f);
}

.medos-package-name {
  margin: 0 0 var(--medos-spacing-sm, 8px) 0;
  font-size: var(--medos-typography-font-size-md, 16px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
}

.medos-package-description {
  margin: 0 0 var(--medos-spacing-lg, 16px) 0;
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text-secondary, #6b7280);
  line-height: 1.5;
  flex: 1;
}

.medos-package-doctors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--medos-spacing-md, 12px);
}

.medos-doctor-badge {
  font-size: var(--medos-typography-font-size-xs, 12px);
  color: var(--medos-color-text, #374151);
  background-color: var(--medos-color-background-secondary, #f1f5f9);
  padding: 4px 10px;
  border-radius: var(--medos-radius-full, 999px);
}

.medos-consultation-modes {
  display: flex;
  gap: var(--medos-spacing-sm, 8px);
  margin-bottom: var(--medos-spacing-md, 12px);
}

.medos-mode-badge {
  font-size: 11px;
  color: var(--medos-color-text-secondary, #6b7280);
  background-color: var(--medos-color-background-secondary, #f1f5f9);
  padding: 4px 8px;
  border-radius: 6px;
}

.medos-package-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--medos-spacing-lg, 16px);
  border-top: 1px solid var(--medos-color-border, #e5e7eb);
}

.medos-package-sessions {
  font-size: 13px;
  color: var(--medos-color-text-secondary, #6b7280);
}

.medos-package-price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.medos-original-price {
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text-secondary, #6b7280);
  text-decoration: line-through;
}

.medos-package-price {
  font-size: var(--medos-typography-font-size-lg, 18px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-primary, #27903f);
}

.medos-per-session-price {
  font-size: var(--medos-typography-font-size-xs, 12px);
  color: var(--medos-color-text-secondary, #6b7280);
  font-weight: var(--medos-typography-font-weight-medium, 500);
}

.medos-discount-badge {
  font-size: 11px;
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: #fff;
  background-color: var(--medos-color-success, #16a34a);
  padding: 2px 8px;
  border-radius: var(--medos-radius-full, 999px);
}

.medos-package-validity {
  margin-top: var(--medos-spacing-sm, 8px);
  font-size: var(--medos-typography-font-size-xs, 12px);
  color: var(--medos-color-text-secondary, #6b7280);
}

/* Summary Step Styles */
.medos-summary-container {
  display: flex;
  flex-direction: column;
  gap: var(--medos-spacing-xl, 20px);
}

.medos-summary-title {
  margin: 0;
  font-size: var(--medos-typography-font-size-xl, 20px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
}

.medos-summary-subtitle {
  margin: 0;
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text-secondary, #6b7280);
}

.medos-summary-section {
  display: flex;
  flex-direction: column;
  gap: var(--medos-spacing-md, 12px);
}

.medos-summary-section-title {
  margin: 0;
  font-size: var(--medos-typography-font-size-md, 16px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
  display: flex;
  align-items: center;
  gap: var(--medos-spacing-sm, 8px);
}

.medos-summary-card {
  display: flex;
  flex-direction: column;
  gap: var(--medos-spacing-md, 12px);
  padding: var(--medos-spacing-lg, 16px);
  background-color: var(--medos-color-background-secondary, #f9fafb);
  border-radius: var(--medos-radius-md, 8px);
  border: 1px solid var(--medos-color-border, #e5e7eb);
}

.medos-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.medos-summary-label {
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text-secondary, #6b7280);
}

.medos-summary-value {
  font-size: var(--medos-typography-font-size-sm, 14px);
  font-weight: var(--medos-typography-font-weight-medium, 500);
  color: var(--medos-color-text, #111827);
  text-align: right;
}

.medos-summary-total-row {
  padding-top: var(--medos-spacing-md, 12px);
  border-top: 1px solid var(--medos-color-border, #e5e7eb);
  margin-top: 4px;
}

.medos-summary-total-label {
  font-size: var(--medos-typography-font-size-md, 16px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
}

.medos-summary-total-value {
  font-size: var(--medos-typography-font-size-lg, 18px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-primary, #27903f);
}

.medos-summary-price-container {
  display: flex;
  align-items: center;
  gap: var(--medos-spacing-sm, 8px);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.medos-summary-strikethrough-price {
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text-secondary, #6b7280);
  text-decoration: line-through;
}

.medos-summary-discount-badge {
  font-size: 11px;
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: #fff;
  background-color: var(--medos-color-success, #16a34a);
  padding: 2px 8px;
  border-radius: var(--medos-radius-full, 999px);
}

.medos-summary-remaining-info {
  font-size: 13px;
  color: var(--medos-color-text-secondary, #6b7280);
  margin-top: 4px;
}

/* Time Slots */
.medos-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--medos-spacing-sm, 8px);
}

.medos-slot-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--medos-spacing-xs, 4px);
  padding: var(--medos-spacing-sm, 10px) var(--medos-spacing-md, 12px);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-md, 8px);
  cursor: pointer;
  transition: var(--medos-transition-normal);
  position: relative;
}

.medos-slot-card:hover {
  border-color: var(--medos-color-primary, #27903f);
  background: var(--medos-color-surface-hover, #f9fafb);
}

.medos-slot-card.selected {
  border-color: var(--medos-color-primary, #27903f);
  background: rgba(39, 144, 63, 0.1);
}

/* Grouped Slots Container */
.medos-slots-container-grouped {
  display: flex;
  flex-direction: column;
  gap: var(--medos-spacing-lg, 16px);
}

.medos-slot-period {
  display: flex;
  flex-direction: column;
  gap: var(--medos-spacing-md, 12px);
}

.medos-slot-period-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--medos-spacing-sm, 8px);
  border-bottom: 2px solid var(--medos-color-border, #e5e7eb);
}

.medos-slot-period-title {
  font-size: var(--medos-typography-font-size-sm, 14px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.medos-slot-period-count {
  font-size: var(--medos-typography-font-size-xs, 12px);
  color: var(--medos-color-text-secondary, #6b7280);
  background: var(--medos-color-background-secondary, #f9fafb);
  padding: var(--medos-spacing-xs, 4px) var(--medos-spacing-sm, 8px);
  border-radius: var(--medos-radius-full, 999px);
}

.medos-slot-period-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--medos-spacing-md, 12px);
}

/* Slot Button */
.medos-slot-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--medos-spacing-xs, 6px);
  padding: var(--medos-spacing-md, 12px) var(--medos-spacing-sm, 10px);
  border: 2px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-md, 8px);
  background: var(--medos-color-surface, #fff);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--medos-transition-normal);
  position: relative;
  min-height: 80px;
}

.medos-slot-btn:hover:not(:disabled) {
  border-color: var(--medos-color-primary, #27903f);
  background: var(--medos-color-surface-hover, #f9fafb);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 144, 63, 0.15);
}

.medos-slot-btn:active:not(:disabled) {
  transform: translateY(0);
}

.medos-slot-btn.selected {
  border-color: var(--medos-color-primary, #27903f);
  background: var(--medos-color-primary, #27903f);
  color: var(--medos-color-text-on-primary, #fff);
  box-shadow: 0 4px 12px rgba(39, 144, 63, 0.3);
}

.medos-slot-time-range {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--medos-spacing-xs, 4px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  font-size: var(--medos-typography-font-size-md, 16px);
}

.medos-slot-start-time {
  color: inherit;
}

.medos-slot-separator {
  color: inherit;
  opacity: 0.7;
  font-size: var(--medos-typography-font-size-sm, 14px);
}

.medos-slot-end-time {
  color: inherit;
}

.medos-slot-duration {
  font-size: var(--medos-typography-font-size-xs, 12px);
  opacity: 0.75;
  font-weight: var(--medos-typography-font-weight-normal, 400);
}

/* Phone Input */
.medos-phone-input-row {
  display: flex;
  gap: var(--medos-spacing-sm, 8px);
  align-items: flex-start;
}

.medos-country-code-wrapper {
  width: 140px;
  flex-shrink: 0;
}

.medos-phone-wrapper {
  flex: 1;
}

/* VanillaSelect Styles */
.vanilla-select-container {
  position: relative;
  width: 100%;
  z-index: 1;
}

.vanilla-select-container.open {
  z-index: 10000;
}

.vanilla-select-display {
  width: 100%;
  padding: var(--medos-spacing-sm, 10px) var(--medos-spacing-md, 12px);
  border-radius: var(--medos-radius-md, 8px);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  background: var(--medos-color-surface, #fff);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text, #111827);
  box-sizing: border-box;
  transition: var(--medos-transition-normal);
}

.vanilla-select-display:hover {
  border-color: var(--medos-color-border-hover, #d1d5db);
}

.vanilla-select-display.open {
  border-color: var(--medos-color-primary, #27903f);
  box-shadow: 0 0 0 2px rgba(39, 144, 63, 0.15);
}

.vanilla-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--medos-color-surface, #fff);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-md, 8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.vanilla-select-option {
  padding: var(--medos-spacing-sm, 10px) var(--medos-spacing-md, 12px);
  cursor: pointer;
  font-size: var(--medos-typography-font-size-sm, 14px);
  color: var(--medos-color-text, #111827);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--medos-transition-normal);
}

.vanilla-select-option:hover {
  background: var(--medos-color-surface-hover, #f9fafb);
}

.vanilla-select-option.selected {
  background: rgba(39, 144, 63, 0.1);
  color: var(--medos-color-primary, #27903f);
}

/* VanillaCalendar Styles */
.vanilla-calendar-container {
  width: 100%;
  background: var(--medos-color-surface, #fff);
  border: 1px solid var(--medos-color-border, #e5e7eb);
  border-radius: var(--medos-radius-md, 8px);
  padding: var(--medos-spacing-lg, 16px);
}

.vanilla-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--medos-spacing-lg, 16px);
}

.vanilla-calendar-nav-btn {
  background: none;
  border: none;
  padding: var(--medos-spacing-xs, 4px);
  cursor: pointer;
  border-radius: var(--medos-radius-sm, 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--medos-transition-normal);
}

.vanilla-calendar-nav-btn:hover {
  background: var(--medos-color-surface-hover, #f9fafb);
}

.vanilla-calendar-month-year {
  font-size: var(--medos-typography-font-size-md, 16px);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
  color: var(--medos-color-text, #111827);
}

.vanilla-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.vanilla-calendar-day-header {
  text-align: center;
  font-size: var(--medos-typography-font-size-xs, 12px);
  font-weight: var(--medos-typography-font-weight-medium, 500);
  color: var(--medos-color-text-secondary, #6b7280);
  padding: var(--medos-spacing-sm, 8px);
}

.vanilla-calendar-day {
  text-align: center;
  padding: var(--medos-spacing-sm, 8px);
  cursor: pointer;
  border-radius: var(--medos-radius-sm, 4px);
  font-size: var(--medos-typography-font-size-sm, 14px);
  transition: var(--medos-transition-normal);
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vanilla-calendar-day:hover:not(.disabled):not(.other-month) {
  background: var(--medos-color-surface-hover, #f9fafb);
}

.vanilla-calendar-day.selected {
  background: var(--medos-color-primary, #27903f);
  color: var(--medos-color-text-on-primary, #fff);
}

.vanilla-calendar-day.disabled {
  color: var(--medos-color-text-muted, #9ca3af);
  cursor: not-allowed;
}

.vanilla-calendar-day.other-month {
  color: var(--medos-color-text-muted, #9ca3af);
}

.vanilla-calendar-day.today {
  background: rgba(39, 144, 63, 0.1);
  font-weight: var(--medos-typography-font-weight-semibold, 600);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .medos-slot-period-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .medos-slot-btn {
    min-height: 75px;
    padding: var(--medos-spacing-sm, 10px) var(--medos-spacing-xs, 6px);
  }

  .medos-slot-time-range {
    font-size: var(--medos-typography-font-size-sm, 14px);
  }

  .medos-slot-duration {
    font-size: var(--medos-typography-font-size-xs, 11px);
  }
}

@media (max-width: 480px) {
  .medos-slot-period-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .medos-slot-btn {
    min-height: 70px;
    padding: var(--medos-spacing-sm, 8px) var(--medos-spacing-xs, 4px);
    gap: var(--medos-spacing-xs, 4px);
  }

  .medos-slot-time-range {
    font-size: var(--medos-typography-font-size-sm, 13px);
  }

  .medos-slot-duration {
    font-size: var(--medos-typography-font-size-xs, 10px);
  }

  .medos-slot-period-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--medos-spacing-xs, 4px);
  }
}
  `;
      document.head.appendChild(styleElement);
  }

  class AppointmentCalendarWidget {
      constructor(container, options) {
          this.mounted = true;
          this.doctors = [];
          this.addressSelect = null;
          this.doctorSelect = null;
          this.calendar = null;
          this.countryCodeSelect = null;
          this.genderSelect = null;
          this.bloodGroupSelect = null;
          injectThemedStyles();
          if (typeof container === "string") {
              const el = document.getElementById(container);
              if (!el) {
                  throw new Error(`Container element with id "${container}" not found`);
              }
              this.container = el;
          }
          else {
              this.container = container;
          }
          this.options = options;
          this.state = { ...INITIAL_STATE };
          this.init();
      }
      async init() {
          if (this.options.apiKey) {
              await MedosClient.init({
                  apiKey: this.options.apiKey,
              });
          }
          else if (this.options.sessionToken) {
              await MedosClient.initWithSession({
                  sessionToken: this.options.sessionToken,
              });
          }
          else {
              throw new Error("Either apiKey or sessionToken must be provided");
          }
          await this.loadWorkspaceConfiguration();
          await this.loadAddresses();
          this.render();
      }
      async loadWorkspaceConfiguration() {
          this.setState({ loading: true, error: null });
          try {
              const workspaceResponse = await WorkspaceService.fetchWorkspace();
              console.log("Workspace configuration loaded:", {
                  workspaceId: workspaceResponse.workspaceId,
              });
          }
          catch (e) {
              console.error("Failed to load workspace configuration:", e);
          }
          finally {
              this.setState({ loading: false });
          }
      }
      async loadAddresses() {
          this.setState({ loading: true, error: null });
          try {
              const addrResp = await AppointmentService.getAddresses();
              if (addrResp && Array.isArray(addrResp.addresses)) {
                  const fetchedAddresses = addrResp.addresses;
                  if (addrResp.workspaceId) {
                      this.state.workspaceId = addrResp.workspaceId;
                  }
                  if (fetchedAddresses.length > 0) {
                      const addrMap = {};
                      const mappedAddrs = fetchedAddresses.map((a, idx) => {
                          const id = Number(a.id ?? idx);
                          const label = a.completeAddress ?? a.label ?? a.address ?? `Address ${idx + 1}`;
                          const docs = Array.isArray(a.doctors)
                              ? a.doctors
                              : [];
                          addrMap[id] = docs || [];
                          return { id, label };
                      });
                      this.state.addresses = mappedAddrs;
                      this.state.addressDoctorsMap = addrMap;
                      const anyDoctorsExist = Object.values(addrMap).some((arr) => Array.isArray(arr) && arr.length > 0);
                      if (mappedAddrs.length === 1) {
                          const only = mappedAddrs[0];
                          this.state.selectedAddress = only.id;
                          const docsForAddr = addrMap[only.id] || [];
                          if (docsForAddr.length > 0) {
                              this.doctors = docsForAddr;
                              if (docsForAddr.length === 1) {
                                  this.state.selectedDoctor = docsForAddr[0].id;
                              }
                          }
                          else {
                              if (anyDoctorsExist) {
                                  this.setState({
                                      error: "No doctors at this address. Please choose a different address.",
                                  });
                                  this.doctors = [];
                              }
                              else {
                                  this.setState({
                                      error: "No doctors available for the selected location(s).",
                                  });
                                  this.doctors = [];
                              }
                          }
                      }
                      this.state.step = 0;
                  }
                  else {
                      this.setState({ error: "No addresses or doctors available." });
                      this.state.addresses = [];
                      this.state.addressDoctorsMap = {};
                      this.doctors = [];
                      this.state.step = 0;
                  }
              }
          }
          catch (e) {
              const msg = e.message || "Failed to load addresses";
              this.setState({ error: msg });
              this.options.onError?.(e);
          }
          finally {
              this.setState({ loading: false });
          }
      }
      async handleAddressChange(addressId) {
          this.state.selectedAddress = addressId;
          if (!addressId) {
              this.doctors = [];
              this.state.selectedDoctor = null;
              this.render();
              return;
          }
          this.setState({ loading: true, error: null });
          try {
              const docsForAddr = this.state.addressDoctorsMap[addressId] ?? [];
              if (docsForAddr.length > 0) {
                  this.doctors = docsForAddr;
                  if (docsForAddr.length === 1) {
                      this.state.selectedDoctor = docsForAddr[0].id;
                  }
                  else {
                      this.state.selectedDoctor = null;
                  }
              }
              else {
                  const otherHasDoctors = Object.entries(this.state.addressDoctorsMap).some(([key, docs]) => Number(key) !== addressId && Array.isArray(docs) && docs.length > 0);
                  this.doctors = [];
                  this.state.selectedDoctor = null;
                  if (otherHasDoctors) {
                      this.setState({
                          error: "No doctors at this address. Please select a different address.",
                      });
                  }
                  else {
                      this.setState({
                          error: "No doctors available for the selected location(s).",
                      });
                  }
              }
          }
          catch (e) {
              this.setState({
                  error: e.message || "Failed to load doctors for address",
              });
          }
          finally {
              this.setState({ loading: false });
              this.render();
          }
      }
      async loadSlots() {
          const dateStr = formatDateToISO(this.state.selectedDate);
          if (!this.state.workspaceId ||
              !this.state.selectedAddress ||
              !this.state.selectedDoctor ||
              !dateStr) {
              this.state.slots = [];
              this.state.selectedSlot = null;
              this.render();
              return;
          }
          this.setState({ loading: true, error: null });
          try {
              const s = await AppointmentService.fetchSlots(this.state.workspaceId, this.state.selectedAddress, this.state.selectedDoctor, dateStr);
              this.state.slots = s || [];
              if (this.state.selectedSlot) {
                  const isSlotStillValid = this.state.slots.some((slot) => slot.start === this.state.selectedSlot?.start &&
                      slot.end === this.state.selectedSlot?.end);
                  if (!isSlotStillValid) {
                      this.state.selectedSlot = null;
                  }
              }
          }
          catch (e) {
              this.setState({ error: e.message || "Failed to load slots" });
          }
          finally {
              this.setState({ loading: false });
              this.render();
          }
      }
      canProceedFromMergedStep() {
          if (this.state.addresses.length === 0 || this.doctors.length === 0)
              return false;
          if (this.state.addresses.length > 1 && !this.state.selectedAddress)
              return false;
          if (this.doctors.length > 1 && !this.state.selectedDoctor)
              return false;
          return true;
      }
      updateSubmitButtonState() {
          try {
              const submitBtn = this.container.querySelector("#medos-btn-submit");
              if (submitBtn) {
                  const canSubmit = this.state.patientName &&
                      this.state.patientAddress &&
                      this.state.patientCity &&
                      this.state.patientState &&
                      this.state.patientCountry &&
                      this.state.patientZipcode &&
                      this.state.patientAge &&
                      this.state.patientGender &&
                      this.state.otpVerified &&
                      (!(this.state.bloodGroup && this.state.bloodGroup.trim() !== "") ||
                          this.isValidBloodGroup(this.state.bloodGroup));
                  submitBtn.disabled = !(canSubmit && !this.state.loading);
              }
          }
          catch (error) {
              console.error("Error updating submit button state:", error);
              const submitBtn = this.container.querySelector("#medos-btn-submit");
              if (submitBtn) {
                  submitBtn.disabled = true;
              }
          }
      }
      updatePatientDetailsButtonState() {
          try {
              const continueBtn = this.container.querySelector("#medos-btn-continue");
              if (continueBtn) {
                  const isFormValid = this.state.patientName &&
                      this.state.patientAge &&
                      this.state.patientGender &&
                      this.state.patientAddress &&
                      this.state.patientCity &&
                      this.state.patientState &&
                      this.state.patientCountry &&
                      this.state.patientZipcode &&
                      (!(this.state.bloodGroup && this.state.bloodGroup.trim() !== "") ||
                          this.isValidBloodGroup(this.state.bloodGroup));
                  continueBtn.disabled = !isFormValid;
              }
          }
          catch (error) {
              console.error("Error updating patient details button state:", error);
              const continueBtn = this.container.querySelector("#medos-btn-continue");
              if (continueBtn) {
                  continueBtn.disabled = true;
              }
          }
      }
      async sendOtp() {
          this.setState({ error: null });
          console.log("sendOtp called - Current state:", {
              countryCode: this.state.countryCode,
              patientPhone: this.state.patientPhone,
          });
          if (!this.state.countryCode) {
              this.setState({ error: "Please enter country code." });
              return;
          }
          if (!validateCountryCode$1(this.state.countryCode)) {
              this.setState({
                  error: "Please enter a valid country code (e.g., +91, +1).",
              });
              return;
          }
          if (!this.state.patientPhone) {
              this.setState({ error: "Please enter phone number." });
              return;
          }
          if (!validatePhoneNumber$1(this.state.patientPhone)) {
              this.setState({
                  error: "Please enter a valid phone number (7-15 digits).",
              });
              return;
          }
          this.setState({ otpSending: true });
          this.render();
          try {
              console.log("Sending OTP to:", {
                  countryCode: this.state.countryCode,
                  phoneNumber: this.state.patientPhone,
              });
              await PatientService.sendPhoneVerificationOtp({
                  countryCode: this.state.countryCode,
                  phoneNumber: this.state.patientPhone,
              });
              this.setState({ otpSent: true, error: null });
          }
          catch (e) {
              console.error("Send OTP error:", e);
              const msg = e?.response?.data?.message ||
                  e?.message ||
                  "Failed to send OTP. Please try again.";
              this.setState({ error: msg });
              this.options.onError?.(e);
          }
          finally {
              this.setState({ otpSending: false });
              this.render();
          }
      }
      async verifyOtp() {
          this.setState({ error: null });
          if (!this.state.countryCode ||
              !this.state.patientPhone ||
              !this.state.otpCode) {
              this.setState({ error: "Please enter all required fields." });
              return;
          }
          if (this.state.otpCode.length !== 6) {
              this.setState({ error: "Please enter a 6-digit OTP code." });
              return;
          }
          this.setState({ otpVerifying: true });
          this.render();
          try {
              console.log("Verifying OTP with:", {
                  countryCode: this.state.countryCode,
                  phoneNumber: this.state.patientPhone,
                  otpCode: this.state.otpCode,
              });
              const response = await PatientService.verifyPhoneVerificationOtp({
                  countryCode: this.state.countryCode,
                  phoneNumber: this.state.patientPhone,
                  otpCode: this.state.otpCode,
              });
              this.processOtpVerificationResponse(response);
              this.setState({ otpVerified: true, error: null });
              this.goToNext();
          }
          catch (e) {
              console.error("OTP verification error:", e);
              const msg = e?.response?.data?.message ||
                  e?.message ||
                  "Invalid OTP code. Please try again.";
              this.setState({ error: msg });
              this.options.onError?.(e);
          }
          finally {
              this.setState({ otpVerifying: false });
              this.render();
          }
      }
      processOtpVerificationResponse(response) {
          try {
              this.state.userSessionPacks = [];
              this.state.availablePackages = [];
              this.state.verifiedPatients = [];
              const sessionPacksDetails = response?.sessionPacksDetails;
              if (sessionPacksDetails?.associatedPatients &&
                  Array.isArray(sessionPacksDetails.associatedPatients) &&
                  sessionPacksDetails.associatedPatients.length > 0) {
                  this.state.verifiedPatients = sessionPacksDetails.associatedPatients;
              }
              else if (response.associatedPatients &&
                  Array.isArray(response.associatedPatients)) {
                  this.state.verifiedPatients = response.associatedPatients;
              }
              else if (response.patients && Array.isArray(response.patients)) {
                  this.state.verifiedPatients = response.patients;
              }
              if (sessionPacksDetails?.activeSessionPackResponses &&
                  Array.isArray(sessionPacksDetails.activeSessionPackResponses) &&
                  sessionPacksDetails.activeSessionPackResponses.length > 0) {
                  this.state.userSessionPacks =
                      sessionPacksDetails.activeSessionPackResponses.map((pack) => ({
                          id: pack.id || 0,
                          name: pack.packageName || pack.name || "Unknown Package",
                          description: pack.description,
                          totalSessions: pack.totalSessions || 0,
                          remainingSessions: pack.remainingSessions || 0,
                          expiryDate: pack.expiryDate || "",
                          purchaseDate: pack.purchaseDate,
                          doctorId: pack.doctorId,
                          doctorName: pack.doctorName,
                          allowedConsultationModes: pack.allowedConsultationModes || [],
                      }));
              }
              if (sessionPacksDetails?.allSessionPackResponses &&
                  Array.isArray(sessionPacksDetails.allSessionPackResponses) &&
                  sessionPacksDetails.allSessionPackResponses.length > 0) {
                  this.state.availablePackages =
                      sessionPacksDetails.allSessionPackResponses.map((pack) => ({
                          id: pack.id || 0,
                          name: pack.packageName || pack.name || "Unknown Package",
                          description: pack.description,
                          totalSessions: pack.totalSessions || 0,
                          price: pack.packagePrice || pack.price || 0,
                          discountedPrice: pack.discountedPrice,
                          discount: pack.discount,
                          discountType: pack.discountType,
                          validityDays: pack.validityDays || 0,
                          allowedConsultationModes: pack.allowedConsultationModes || [],
                          allowedDoctors: pack.allowedDoctors || [],
                          doctorIds: pack.doctorIds || [],
                          applicableOnline: pack.allowedConsultationModes?.includes("ONLINE") || false,
                          applicableOffline: pack.allowedConsultationModes?.includes("OFFLINE") || false,
                      }));
              }
              console.log("Processed OTP verification response:", {
                  verifiedPatients: this.state.verifiedPatients.length,
                  userSessionPacks: this.state.userSessionPacks.length,
                  availablePackages: this.state.availablePackages.length,
                  allSessionPackResponsesExists: sessionPacksDetails?.allSessionPackResponses?.length > 0,
                  sessionPacksDetailsExists: !!sessionPacksDetails,
              });
          }
          catch (error) {
              console.error("Error processing OTP verification response:", error);
              this.state.verifiedPatients = [];
              this.state.userSessionPacks = [];
              this.state.availablePackages = [];
          }
      }
      async submitAppointment() {
          this.setState({ error: null });
          if (!this.state.selectedDoctor ||
              !this.state.selectedSlot ||
              !this.state.workspaceId ||
              !this.state.selectedAddress ||
              !this.state.patientName ||
              !this.state.patientAge ||
              !this.state.patientGender ||
              !this.state.patientAddress ||
              !this.state.patientCity ||
              !this.state.patientState ||
              !this.state.patientCountry ||
              !this.state.patientZipcode) {
              this.setState({
                  error: "Please ensure all required fields are complete.",
              });
              return;
          }
          if (!this.state.otpVerified) {
              this.setState({ error: "Please verify your phone number first." });
              return;
          }
          if (this.state.bloodGroup && this.state.bloodGroup.trim() !== "") {
              if (!this.isValidBloodGroup(this.state.bloodGroup)) {
                  this.displayFieldValidationError("bloodGroup", "invalid");
                  return;
              }
              try {
                  const mappedValue = this.safeMapBloodGroupToApi(this.state.bloodGroup);
                  if (mappedValue === "UNKNOWN" && this.state.bloodGroup !== "UNKNOWN") {
                      this.displayFieldValidationError("bloodGroup", "mapping");
                      return;
                  }
              }
              catch (error) {
                  this.displayFieldValidationError("bloodGroup", "mapping");
                  return;
              }
          }
          this.setState({ loading: true });
          this.render();
          try {
              const { firstName, lastName } = parsePatientName(this.state.patientName || "Patient");
              const appointmentDate = formatDateToISO(this.state.selectedDate);
              const fromDateTimeTs = this.state.selectedSlot.start;
              const toDateTimeTs = this.state.selectedSlot.end;
              const patientPayload = {
                  firstName,
                  lastName,
                  countryCode: this.state.countryCode,
                  phoneNumber: this.state.patientPhone,
                  age: parseInt(this.state.patientAge, 10),
                  gender: this.state.patientGender.toUpperCase(),
              };
              if (this.state.patientEmail) {
                  patientPayload.email = this.state.patientEmail;
              }
              if (this.state.bloodGroup) {
                  patientPayload.bloodGroup = this.safeMapBloodGroupToApi(this.state.bloodGroup);
              }
              if (this.state.useExistingPatient && this.state.selectedPatient) {
                  patientPayload.id = this.state.selectedPatient.id;
              }
              const appointmentPayload = {
                  workspaceId: this.state.workspaceId,
                  workspaceAddressId: this.state.selectedAddress,
                  doctorId: this.state.selectedDoctor,
                  mode: this.state.consultationMode || "OFFLINE",
                  appointmentDate: appointmentDate,
                  fromDateTimeTs: fromDateTimeTs,
                  toDateTimeTs: toDateTimeTs,
                  consultationCharge: this.state.consultationCharge || "0",
                  type: "CONSULTATION",
                  source: "SDK_POWERED_WEBSITE",
                  bookingType: this.state.bookingType || "ONE_TIME_APPOINTMENT",
                  paymentMode: this.state.paymentMode || "CASH",
                  patientPayload,
                  patientAddress: {
                      addressLine1: this.state.patientAddress,
                      addressLine2: "",
                      city: this.state.patientCity,
                      state: this.state.patientState,
                      country: this.state.patientCountry,
                      zipcode: this.state.patientZipcode,
                      landmark: this.state.patientLandmark || undefined,
                      countryCode: this.state.countryCode,
                      phoneNumber: this.state.patientPhone,
                      patientId: this.state.selectedPatient?.id || 0,
                  },
              };
              if (this.state.packageConfigId) {
                  appointmentPayload.packageConfigId = this.state.packageConfigId;
              }
              if (this.state.patientPackageId) {
                  appointmentPayload.patientPackageId = this.state.patientPackageId;
              }
              if (this.state.packageAmount) {
                  appointmentPayload.packageAmount = this.state.packageAmount;
              }
              await AppointmentService.createAppointment(appointmentPayload);
              this.setState({ step: 7 });
              this.options.onSuccess?.();
          }
          catch (e) {
              const msg = e.message || "Failed to create appointment";
              this.setState({ error: msg });
              this.options.onError?.(e);
          }
          finally {
              this.setState({ loading: false });
              this.render();
          }
      }
      goToNext() {
          if (this.state.step === 0) {
              if (!this.state.otpVerified)
                  return;
              console.log("Step 0 transition - Debug info:", {
                  allSessionPackResponses: this.state.availablePackages?.length || 0,
                  userSessionPacks: this.state.userSessionPacks?.length || 0,
                  availablePackages: this.state.availablePackages?.length || 0,
              });
              if (this.state.availablePackages &&
                  Array.isArray(this.state.availablePackages) &&
                  this.state.availablePackages.length > 0) {
                  this.state.step = 1;
                  console.log("Showing Booking Option Step - allSessionPackResponses is not empty");
                  this.render();
                  return;
              }
              else {
                  this.state.bookingOptionType = "new-appointment";
                  this.state.step = 2;
                  console.log("Auto-skipping Booking Option Step - allSessionPackResponses is empty");
                  this.render();
                  return;
              }
          }
          if (this.state.step === 1) {
              if (!this.state.bookingOptionType)
                  return;
              if (this.state.bookingOptionType === "explore-packages") {
                  this.state.showPackageExplorer = true;
                  this.state.step = 2;
                  this.render();
                  return;
              }
              this.state.step = 2;
              this.render();
              return;
          }
          if (this.state.step === 2) {
              if (this.state.showPackageExplorer) {
                  if (this.state.selectedNewPackage) {
                      this.state.showPackageExplorer = false;
                      this.render();
                  }
                  return;
              }
              if (this.state.addresses.length > 1 && !this.state.selectedAddress)
                  return;
              if (this.doctors.length > 1 && !this.state.selectedDoctor)
                  return;
              this.state.step = 3;
              const dateStr = formatDateToISO(this.state.selectedDate);
              if (dateStr) {
                  this.loadSlots();
              }
              else {
                  this.render();
              }
              return;
          }
          if (this.state.step === 3) {
              const dateStr = formatDateToISO(this.state.selectedDate);
              if (!dateStr || !this.state.selectedSlot)
                  return;
              this.state.step = 4;
              this.render();
              return;
          }
          if (this.state.step === 4) {
              if (this.state.selectedPatient && this.state.useExistingPatient) {
                  this.state.step = 6;
                  this.render();
                  return;
              }
              if (!this.state.useExistingPatient) {
                  this.state.step = 5;
                  this.render();
                  return;
              }
              return;
          }
          if (this.state.step === 5) {
              const isFormValid = this.state.patientName &&
                  this.state.patientAge &&
                  this.state.patientGender &&
                  this.state.patientAddress &&
                  this.state.patientCity &&
                  this.state.patientState &&
                  this.state.patientCountry &&
                  this.state.patientZipcode;
              if (!isFormValid)
                  return;
              this.state.step = 6;
              this.render();
              return;
          }
          this.state.step = Math.min(7, this.state.step + 1);
          this.render();
      }
      goBack() {
          if (this.state.showPackageExplorer) {
              this.state.showPackageExplorer = false;
              this.state.selectedNewPackage = null;
              this.state.bookingOptionType = null;
              this.state.step = 1;
              this.render();
              return;
          }
          const currentStep = this.state.step;
          if (currentStep > 0) {
              if (currentStep === 6 && this.state.useExistingPatient) {
                  this.state.selectedPatient = null;
                  this.state.useExistingPatient = false;
                  this.state.step = 4;
                  this.render();
                  return;
              }
              if (currentStep === 2) {
                  if (this.state.availablePackages &&
                      Array.isArray(this.state.availablePackages) &&
                      this.state.availablePackages.length > 0) {
                      this.state.step = 1;
                      console.log("Going back to Booking Option Step - allSessionPackResponses is not empty");
                  }
                  else {
                      this.state.step = 0;
                      console.log("Auto-skipping Booking Option Step on back - allSessionPackResponses is empty");
                  }
                  this.render();
                  return;
              }
              this.state.step = currentStep - 1;
              this.render();
          }
      }
      async reset() {
          this.state = { ...INITIAL_STATE };
          this.doctors = [];
          await this.loadAddresses();
          this.render();
      }
      setState(updates) {
          try {
              const safeUpdates = { ...updates };
              if ("bloodGroup" in safeUpdates && safeUpdates.bloodGroup === undefined) {
                  safeUpdates.bloodGroup = "";
              }
              this.state = { ...this.state, ...safeUpdates };
              if (safeUpdates.bloodGroup !== undefined) {
                  this.updatePatientDetailsButtonState();
                  this.updateSubmitButtonState();
              }
          }
          catch (error) {
              console.error("Error updating state:", error);
              this.state = { ...this.state, ...updates };
          }
      }
      render() {
          if (!this.mounted)
              return;
          this.container.innerHTML = `
      <div class="medos-appointment-container">
        <div class="medos-appointment-card">
          <div class="medos-appointment-header">
            <h2 class="medos-appointment-title">Book Appointment</h2>
          </div>

          ${this.state.loading
            ? '<div class="medos-appointment-loading">Loading...</div>'
            : ""}
          ${this.state.error
            ? `<div class="medos-appointment-error">${this.escapeHtml(this.state.error)}</div>`
            : ""}

          ${this.renderStep()}
        </div>
      </div>
    `;
          this.attachEventListeners();
          this.initializeCustomComponents();
      }
      initializeCustomComponents() {
          if (this.state.step === 0) {
              const countryCodeContainer = this.container.querySelector("#medos-country-code-container");
              if (countryCodeContainer) {
                  const countryOptions = COUNTRY_CODES.map((c) => ({
                      value: c.code,
                      label: c.label,
                  }));
                  this.countryCodeSelect = new VanillaSelect(countryCodeContainer, countryOptions, {
                      placeholder: "Country",
                      onValueChange: (value) => {
                          this.state.countryCode = value;
                          const sendOtpBtn = this.container.querySelector("#medos-btn-send-otp");
                          if (sendOtpBtn) {
                              const canSendOtp = this.state.countryCode &&
                                  this.state.patientPhone.length >= 10;
                              sendOtpBtn.disabled = !canSendOtp;
                          }
                      },
                  });
                  if (this.state.countryCode) {
                      this.countryCodeSelect.setValue(this.state.countryCode);
                  }
              }
          }
          if (this.state.step === 2 && !this.state.showPackageExplorer) {
              const addressContainer = this.container.querySelector("#medos-address-select-container");
              if (addressContainer && this.state.addresses.length > 0) {
                  const addressOptions = this.state.addresses.map((a) => ({
                      value: a.id.toString(),
                      label: a.label || `Address ${a.id}`,
                  }));
                  this.addressSelect = new VanillaSelect(addressContainer, addressOptions, {
                      placeholder: "Select a location",
                      onValueChange: (value) => {
                          this.handleAddressChange(Number(value) || null);
                      },
                  });
                  if (this.state.selectedAddress) {
                      this.addressSelect.setValue(this.state.selectedAddress.toString());
                  }
              }
              const doctorContainer = this.container.querySelector("#medos-doctor-select-container");
              if (doctorContainer && this.doctors.length > 0) {
                  const doctorOptions = this.doctors.map((d) => ({
                      value: d.id.toString(),
                      label: d.name + (d.specialty ? ` • ${d.specialty}` : ""),
                  }));
                  this.doctorSelect = new VanillaSelect(doctorContainer, doctorOptions, {
                      placeholder: "Select a doctor",
                      onValueChange: (value) => {
                          this.state.selectedDoctor = Number(value) || null;
                          const selectedDoc = this.doctors.find((d) => d.id === this.state.selectedDoctor);
                          if (selectedDoc?.consultationCharge) {
                              this.state.consultationCharge = selectedDoc.consultationCharge;
                          }
                          this.render();
                      },
                  });
                  if (this.state.selectedDoctor) {
                      this.doctorSelect.setValue(this.state.selectedDoctor.toString());
                  }
              }
          }
          if (this.state.step === 3) {
              const calendarContainer = this.container.querySelector("#medos-calendar-container");
              if (calendarContainer) {
                  this.calendar = new VanillaCalendar(calendarContainer, {
                      selectedDate: this.state.selectedDate || undefined,
                      pastDisabled: true,
                      onSelect: (date) => {
                          this.state.selectedDate = date;
                          this.loadSlots();
                      },
                  });
              }
          }
          if (this.state.step === 5) {
              const genderContainer = this.container.querySelector("#medos-gender-select-container");
              if (genderContainer) {
                  const genderOptions = GENDER_OPTIONS.map((g) => ({
                      value: g.value,
                      label: g.label,
                  }));
                  this.genderSelect = new VanillaSelect(genderContainer, genderOptions, {
                      placeholder: "Select gender",
                      onValueChange: (value) => {
                          this.state.patientGender = value;
                          this.updatePatientDetailsButtonState();
                      },
                  });
                  if (this.state.patientGender) {
                      this.genderSelect.setValue(this.state.patientGender);
                  }
              }
              const bloodGroupContainer = this.container.querySelector("#medos-blood-group-select-container");
              if (bloodGroupContainer) {
                  const bloodGroupOptions = BLOOD_GROUP_OPTIONS.map((bg) => ({
                      value: bg.value,
                      label: bg.label,
                  }));
                  this.bloodGroupSelect = new VanillaSelect(bloodGroupContainer, bloodGroupOptions, {
                      placeholder: "Select blood group (optional)",
                      onValueChange: (value) => {
                          this.setState({ error: null });
                          try {
                              if (value && value.trim() !== "") {
                                  if (!this.isValidBloodGroup(value)) {
                                      this.displayFieldValidationError("bloodGroup", "invalid");
                                      return;
                                  }
                                  const mappedValue = this.safeMapBloodGroupToApi(value);
                                  if (mappedValue === "UNKNOWN" && value !== "UNKNOWN") {
                                      this.displayFieldValidationError("bloodGroup", "mapping");
                                      return;
                                  }
                              }
                              this.setState({ bloodGroup: value });
                              this.updatePatientDetailsButtonState();
                              this.updateSubmitButtonState();
                          }
                          catch (error) {
                              console.error("Blood group selection error:", error);
                              this.displayFieldValidationError("bloodGroup", "mapping");
                          }
                      },
                  });
                  if (this.state.bloodGroup) {
                      this.bloodGroupSelect.setValue(this.state.bloodGroup);
                  }
              }
          }
      }
      renderStep() {
          switch (this.state.step) {
              case 0:
                  return this.renderPhoneVerificationStep();
              case 1:
                  return this.renderBookingOptionStep();
              case 2:
                  return this.state.showPackageExplorer
                      ? this.renderPackageExplorerStep()
                      : this.renderLocationDoctorStep();
              case 3:
                  return this.renderNewAppointmentStep();
              case 4:
                  return this.renderPatientSelectionStep();
              case 5:
                  return this.renderPatientDetailsStep();
              case 6:
                  return this.renderAppointmentSummaryStep();
              case 7:
                  return this.renderSuccessStep();
              default:
                  return "";
          }
      }
      renderPhoneVerificationStep() {
          const countryCodeValid = this.state.countryCode && validateCountryCode$1(this.state.countryCode);
          const phoneValid = this.state.patientPhone && validatePhoneNumber$1(this.state.patientPhone);
          const canSendOtp = countryCodeValid && phoneValid && !this.state.otpSending;
          if (!this.state.otpSent) {
              return `
        <div class="medos-section-card">
          <div class="medos-section-header">
            ${VanillaIcons.phone(18)}
            <span class="medos-section-title">Verify Details</span>
          </div>
          <div class="medos-section-body">
            <p class="medos-section-description">Enter Phone Number</p>
            <div class="medos-phone-input-row">
              <div class="medos-country-code-wrapper">
                <div id="medos-country-code-container"></div>
              </div>
              <div class="medos-phone-wrapper">
                <input 
                  type="tel" 
                  class="medos-input" 
                  id="medos-phone" 
                  placeholder="0000 000 000" 
                  value="${this.escapeHtml(this.state.patientPhone)}" 
                  maxlength="15"
                />
              </div>
            </div>
            ${this.state.patientPhone && !phoneValid
                ? '<div class="medos-validation-error">Phone number should be 7-15 digits</div>'
                : ""}
          </div>
          <div class="medos-actions">
            <button class="medos-btn medos-btn-primary" id="medos-btn-send-otp" ${canSendOtp ? "" : "disabled"}>${this.state.otpSending ? "Sending..." : "Continue"}</button>
          </div>
        </div>
      `;
          }
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.phone(18)}
          <span class="medos-section-title">Enter OTP</span>
        </div>
        <div class="medos-section-body">
          <p class="medos-section-description">Enter the 6-digit code sent to ${this.escapeHtml(this.state.countryCode)} ${this.escapeHtml(this.state.patientPhone)}</p>
          <div class="medos-otp-input-wrapper">
            <input 
              type="text" 
              class="medos-input medos-otp-input" 
              id="medos-otp" 
              placeholder="000000" 
              value="${this.escapeHtml(this.state.otpCode)}" 
              maxlength="6"
            />
          </div>
          <button class="medos-link-btn" id="medos-btn-change-number">Change phone number</button>
        </div>
        <div class="medos-actions">
          <button class="medos-btn medos-btn-secondary" id="medos-btn-resend-otp">Resend OTP</button>
          <button class="medos-btn medos-btn-primary" id="medos-btn-verify-otp" ${this.state.otpCode.length === 6 && !this.state.otpVerifying
            ? ""
            : "disabled"}>${this.state.otpVerifying ? "Verifying..." : "Verify OTP"}</button>
        </div>
      </div>
    `;
      }
      renderBookingOptionStep() {
          const hasActivePacks = this.state.userSessionPacks.length > 0;
          const activePack = this.state.userSessionPacks.find((p) => p.remainingSessions > 0);
          const hasAvailablePackages = this.state.availablePackages.length > 0;
          const multipleActivePacks = this.state.userSessionPacks.filter((p) => p.remainingSessions > 0)
              .length > 1;
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          <h3 class="medos-section-title">Choose Booking Option</h3>
        </div>
        <div class="medos-section-body">
          <p class="medos-section-description">
            How would you like to book your appointment?
          </p>
          
          ${multipleActivePacks
            ? `
            <div class="medos-session-packs-section">
              <h4 class="medos-session-packs-title">Your Active Session Packs</h4>
              <div class="medos-session-packs-list">
                ${this.state.userSessionPacks
                .filter((pack) => pack.remainingSessions > 0)
                .map((pack) => `
                  <div class="medos-session-pack-card ${this.state.bookingOptionType === "session-pack" &&
                this.state.selectedSessionPack?.id === pack.id
                ? "selected"
                : ""}" data-pack-id="${pack.id}">
                    <div class="medos-session-pack-info">
                      <span class="medos-session-pack-name">${this.escapeHtml(pack.name)}</span>
                      <span class="medos-session-pack-remaining">${pack.remainingSessions}/${pack.totalSessions} sessions</span>
                      ${pack.doctorName
                ? `<span class="medos-session-pack-doctor">${this.escapeHtml(pack.doctorName)}</span>`
                : ""}
                    </div>
                    <div class="medos-session-pack-expiry">
                      Expires: ${new Date(pack.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                `)
                .join("")}
              </div>
            </div>
            ${hasActivePacks ? '<hr style="margin: 24px 0;" />' : ""}
          `
            : ""}
          
          <div class="medos-options-grid">
            ${activePack && !multipleActivePacks
            ? `
              <div class="medos-option-card ${this.state.bookingOptionType === "session-pack" &&
                this.state.selectedSessionPack?.id === activePack.id
                ? "selected"
                : ""}" data-option="session-pack" data-pack-id="${activePack.id}">
                <div class="medos-option-icon">📋</div>
                <h4 class="medos-option-title">Use Session Pack</h4>
                <p class="medos-option-description">
                  You have ${activePack.remainingSessions} session${activePack.remainingSessions > 1 ? "s" : ""} remaining
                </p>
                <div class="medos-session-pack-badge">
                  ${this.escapeHtml(activePack.name)}
                </div>
              </div>
            `
            : ""}
            
            <div class="medos-option-card ${this.state.bookingOptionType === "new-appointment"
            ? "selected"
            : ""}" data-option="new-appointment">
              <div class="medos-option-icon">📅</div>
              <h4 class="medos-option-title">Book New Appointment</h4>
              <p class="medos-option-description">
                Schedule a single consultation visit
              </p>
            </div>
            
            ${hasAvailablePackages
            ? `
              <div class="medos-option-card ${this.state.bookingOptionType === "explore-packages"
                ? "selected"
                : ""}" data-option="explore-packages">
                <div class="medos-option-icon">🎁</div>
                <h4 class="medos-option-title">Explore Packages</h4>
                <p class="medos-option-description">
                  View and purchase consultation packages
                </p>
              </div>
            `
            : ""}
          </div>
        </div>
        <div class="medos-actions">
          <button class="medos-btn medos-btn-secondary" id="medos-btn-back">${VanillaIcons.arrowLeft(14)} Back</button>
          <button class="medos-btn medos-btn-primary" id="medos-btn-continue" ${this.state.bookingOptionType ? "" : "disabled"}>Next</button>
        </div>
      </div>
    `;
      }
      renderPackageExplorerStep() {
          const packages = this.state.availablePackages.length > 0
              ? this.state.availablePackages
              : [
                  {
                      id: 1,
                      name: "Silver Package",
                      description: "• 3 consultations (In clinic & Online appointments)\n• Can redeem for 6 months after\n  purchase",
                      totalSessions: 3,
                      price: 5000,
                      validityDays: 180,
                      applicableOnline: true,
                      applicableOffline: true,
                  },
                  {
                      id: 2,
                      name: "Gold Package",
                      description: "• 5 consultations (In clinic & Online appointments)\n• Can redeem for 12 months after\n  purchase",
                      totalSessions: 5,
                      price: 8000,
                      validityDays: 365,
                      applicableOnline: true,
                      applicableOffline: true,
                  },
              ];
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          <h3 class="medos-section-title" style="font-size: var(--medos-typography-font-size-xl, 20px);">Explore Packages</h3>
        </div>
        <div class="medos-section-body">
          <p class="medos-section-description">
            Choose a package that suits your needs
          </p>
          
          ${packages.length > 0
            ? `
            <div class="medos-packages-grid">
              ${packages
                .map((pkg) => `
                <div class="medos-package-card ${this.state.selectedNewPackage?.id === pkg.id ? "selected" : ""}" data-package-id="${pkg.id}">
                  <h4 class="medos-package-name">${this.escapeHtml(pkg.name)}</h4>
                  <p class="medos-package-description">
                    ${this.escapeHtml(pkg.description || "").replace(/\n/g, "<br>")}
                  </p>
                  
                  ${pkg.allowedDoctors && pkg.allowedDoctors.length > 0
                ? `
                    <div class="medos-package-doctors">
                      ${pkg.allowedDoctors
                    .map((doc) => `
                        <span class="medos-doctor-badge">
                          ${this.escapeHtml(doc.fullName)}
                        </span>
                      `)
                    .join("")}
                    </div>
                  `
                : ""}
                  
                  ${pkg.allowedConsultationModes &&
                pkg.allowedConsultationModes.length > 0
                ? `
                    <div class="medos-consultation-modes">
                      ${pkg.allowedConsultationModes
                    .map((mode) => `
                        <span class="medos-mode-badge">
                          ${mode === "ONLINE" ? "🌐 Online" : "🏥 In-Person"}
                        </span>
                      `)
                    .join("")}
                    </div>
                  `
                : ""}
                  
                  <div class="medos-package-details">
                    <span class="medos-package-sessions">
                      ${pkg.totalSessions || pkg.sessions} session${(pkg.totalSessions || pkg.sessions || 1) > 1 ? "s" : ""}
                    </span>
                    <div class="medos-package-price-container">
                      ${pkg.discountedPrice && pkg.discountedPrice < pkg.price
                ? `
                        <span class="medos-original-price">
                          ₹${pkg.price.toLocaleString()}
                        </span>
                        <span class="medos-package-price">
                          ₹${pkg.discountedPrice.toLocaleString()}
                        </span>
                        <span class="medos-per-session-price">
                          ₹${Math.round(pkg.discountedPrice /
                    (pkg.totalSessions || pkg.sessions || 1)).toLocaleString()}/session
                        </span>
                        ${pkg.discount
                    ? `
                          <span class="medos-discount-badge">
                            ${pkg.discountType === "PERCENTAGE"
                        ? `${pkg.discount}% OFF`
                        : `₹${pkg.discount} OFF`}
                          </span>
                        `
                    : ""}
                      `
                : `
                        <span class="medos-package-price">
                          ₹${pkg.price.toLocaleString()}
                        </span>
                        <span class="medos-per-session-price">
                          ₹${Math.round(pkg.price / (pkg.totalSessions || pkg.sessions || 1)).toLocaleString()}/session
                        </span>
                      `}
                    </div>
                  </div>
                  <div class="medos-package-validity">
                    Valid for ${pkg.validityDays} days
                  </div>
                </div>
              `)
                .join("")}
            </div>
          `
            : `
            <div style="text-align: center; padding: 40px 20px; color: var(--medos-color-text-secondary, #6b7280); font-size: var(--medos-typography-font-size-sm, 14px);">
              <p>No packages available at the moment.</p>
            </div>
          `}
        </div>
      </div>
      <div class="medos-actions">
        <button class="medos-btn medos-btn-secondary" id="medos-btn-back">Back</button>
        <button class="medos-btn medos-btn-primary" id="medos-btn-continue" ${this.state.selectedNewPackage ? "" : "disabled"}>Next</button>
      </div>
    `;
      }
      renderLocationDoctorStep() {
          const canProceed = this.canProceedFromMergedStep();
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.mapPin(18)}
          <h3 class="medos-section-title">Location & Doctor</h3>
        </div>
        <div class="medos-section-body">
          <div class="medos-form-group">
            <label class="medos-label">
              Preferred Location <span class="medos-required">*</span>
            </label>
            <div id="medos-address-select-container"></div>
          </div>
          <div class="medos-form-group">
            <label class="medos-label">
              Preferred Doctor <span class="medos-required">*</span>
            </label>
            <div id="medos-doctor-select-container"></div>
          </div>
          <div class="medos-form-group">
            <label class="medos-label">
              Chief Complaint <span class="medos-optional">(optional)</span>
            </label>
            <textarea 
              class="medos-textarea" 
              id="medos-chief-complaint"
              placeholder="Enter Chief Complaint or Appointment Notes"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="medos-actions">
        <button class="medos-btn medos-btn-secondary" id="medos-btn-back">${VanillaIcons.arrowLeft(14)} Back</button>
        <button class="medos-btn medos-btn-primary" id="medos-btn-next" ${canProceed ? "" : "disabled"}>Continue</button>
      </div>
    `;
      }
      renderNewAppointmentStep() {
          formatDateToISO(this.state.selectedDate);
          this.state.consultationMode === "ONLINE" ? "500" : "300";
          const dateDisplay = this.state.selectedDate
              ? this.state.selectedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
              : "";
          const usingSessionPack = this.state.bookingOptionType === "session-pack" &&
              this.state.selectedSessionPack;
          usingSessionPack
              ? `
      <div class="medos-session-info">
        <span class="medos-session-label">Sessions:</span>
        <span class="medos-session-value">${this.state.selectedSessionPack?.remainingSessions} appointments now remaining</span>
      </div>
    `
              : "";
          const slotsByPeriod = this.groupSlotsByPeriod(this.state.slots);
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.consultationType(14)}
          <span class="medos-section-title">Consultation Type</span>
        </div>
        <div class="medos-section-body">
          <label class="medos-form-label">Consultation Mode</label>
          <div class="medos-consultation-options">
            <label class="medos-radio-option ${this.state.consultationMode === "OFFLINE" ? "selected" : ""}">
              <input 
                type="radio" 
                name="consultationMode" 
                value="OFFLINE" 
                ${this.state.consultationMode === "OFFLINE" ? "checked" : ""}
                class="medos-radio-input"
              />
              <span class="medos-radio-label">Offline</span>
            </label>
            <label class="medos-radio-option ${this.state.consultationMode === "ONLINE" ? "selected" : ""}">
              <input 
                type="radio" 
                name="consultationMode" 
                value="ONLINE" 
                ${this.state.consultationMode === "ONLINE" ? "checked" : ""}
                class="medos-radio-input"
              />
              <span class="medos-radio-label">Online</span>
            </label>
          </div>
        </div>
      </div>

      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.dateTime(14)}
          <span class="medos-section-title">Date & Time</span>
        </div>
        <div class="medos-section-body medos-datetime-layout">
          <div class="medos-calendar-section">
            <label class="medos-form-label">Available Dates</label>
            <div class="medos-date-display">${dateDisplay}</div>
            <div id="medos-calendar-container"></div>
          </div>
          <div class="medos-slots-section">
            <label class="medos-form-label">Available Slots</label>
            ${this.state.slots.length === 0
            ? '<div class="medos-empty-slots">Select a date to see available slots</div>'
            : this.renderGroupedSlots(slotsByPeriod)}
          </div>
        </div>
      </div>

      <div class="medos-actions">
        <button class="medos-btn medos-btn-secondary" id="medos-btn-back">${VanillaIcons.arrowLeft(14)} Back</button>
        <button class="medos-btn medos-btn-primary" id="medos-btn-continue" ${this.state.selectedSlot ? "" : "disabled"}>Continue</button>
      </div>
    `;
      }
      groupSlotsByPeriod(slots) {
          const groups = {
              Morning: [],
              Afternoon: [],
              Evening: [],
          };
          slots.forEach((slot) => {
              const startTime = new Date(slot.start);
              const hours = startTime.getHours();
              let period = "Morning";
              if (hours >= 12 && hours < 17) {
                  period = "Afternoon";
              }
              else if (hours >= 17) {
                  period = "Evening";
              }
              groups[period].push(slot);
          });
          return groups;
      }
      renderGroupedSlots(slotsByPeriod) {
          const periods = ["Morning", "Afternoon", "Evening"];
          return `
      <div class="medos-slots-container-grouped">
        ${periods
            .filter((period) => slotsByPeriod[period].length > 0)
            .map((period) => `
            <div class="medos-slot-period">
              <div class="medos-slot-period-header">
                <span class="medos-slot-period-title">${period.toUpperCase()}</span>
                <span class="medos-slot-period-count">${slotsByPeriod[period].length} ${slotsByPeriod[period].length === 1 ? "slot" : "slots"}</span>
              </div>
              <div class="medos-slot-period-grid">
                ${slotsByPeriod[period]
            .map((slot) => {
            const startDate = new Date(slot.start);
            const endDate = new Date(slot.end);
            const startTime = startDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            const endTime = endDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
            const selected = this.state.selectedSlot?.start === slot.start &&
                this.state.selectedSlot?.end === slot.end;
            return `
                      <button type="button" class="medos-slot-btn ${selected ? "selected" : ""}" 
                           data-slot-id="${this.escapeHtml(slot.id || `${slot.start}-${slot.end}`)}" 
                           data-slot-start="${this.escapeHtml(slot.start)}" 
                           data-slot-end="${this.escapeHtml(slot.end)}"
                           ${selected
                ? 'aria-pressed="true"'
                : 'aria-pressed="false"'}
                           aria-label="Select ${startTime} to ${endTime} time slot">
                        <span class="medos-slot-time-range">
                          <span class="medos-slot-start-time">${startTime}</span>
                          <span class="medos-slot-separator">–</span>
                          <span class="medos-slot-end-time">${endTime}</span>
                        </span>
                        <span class="medos-slot-duration">${durationMinutes}m</span>
                      </button>
                    `;
        })
            .join("")}
              </div>
            </div>
          `)
            .join("")}
      </div>
    `;
      }
      renderPatientSelectionStep() {
          const hasVerifiedPatients = this.state.verifiedPatients.length > 0;
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.users(14)}
          <span class="medos-section-title">Select Patient</span>
        </div>
        <div class="medos-section-body">
          ${hasVerifiedPatients
            ? `
            <div class="medos-patient-list">
              ${this.state.verifiedPatients
                .map((patient) => `
                <div class="medos-patient-card ${this.state.selectedPatient?.id === patient.id
                ? "selected"
                : ""}" data-patient-id="${patient.id}">
                  <div class="medos-patient-radio">
                    <input type="radio" name="patient" value="${patient.id}" ${this.state.selectedPatient?.id === patient.id
                ? "checked"
                : ""} />
                  </div>
                  <div class="medos-patient-avatar">
                    ${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}
                  </div>
                  <div class="medos-patient-info">
                    <div class="medos-patient-name">${this.escapeHtml(patient.firstName)} ${this.escapeHtml(patient.lastName)}</div>
                    <div class="medos-patient-details">${this.escapeHtml(patient.countryCode)} ${this.escapeHtml(patient.phoneNumber)}</div>
                    ${patient.age
                ? `<div class="medos-patient-age">Age: ${patient.age}</div>`
                : ""}
                  </div>
                  <div class="medos-patient-select">select</div>
                </div>
              `)
                .join("")}
            </div>
          `
            : `
            <div class="medos-no-patients">
              <p>No existing patients found for this phone number.</p>
            </div>
          `}
          
          <button class="medos-add-patient-btn" id="medos-btn-add-patient">
            ${VanillaIcons.plus(16)} New Patient
          </button>
        </div>
      </div>
      <div class="medos-actions">
        <button class="medos-btn medos-btn-secondary" id="medos-btn-back">${VanillaIcons.arrowLeft(14)} Back</button>
        <button class="medos-btn medos-btn-primary" id="medos-btn-continue" ${this.state.selectedPatient ? "" : "disabled"}>Continue</button>
      </div>
    `;
      }
      renderPatientDetailsStep() {
          const isFormValid = this.state.patientName &&
              this.state.patientAge &&
              this.state.patientGender &&
              this.state.patientAddress &&
              this.state.patientCity &&
              this.state.patientState &&
              this.state.patientCountry &&
              this.state.patientZipcode;
          return `
      <!-- Patient Information Section -->
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.user(14)}
          <span class="medos-section-title">Patient Information</span>
        </div>
        <div class="medos-section-body">
          <div class="medos-form-row">
            <div class="medos-form-field">
              <label class="medos-form-label">
                First Name <span class="medos-required">*</span>
              </label>
              <input
                type="text"
                class="medos-appointment-input"
                id="medos-patient-first-name"
                placeholder="Jane"
                value="${this.escapeHtml(this.state.patientName.split(" ")[0] || "")}"
              />
            </div>
            <div class="medos-form-field">
              <label class="medos-form-label">
                Last Name <span class="medos-required">*</span>
              </label>
              <input
                type="text"
                class="medos-appointment-input"
                id="medos-patient-last-name"
                placeholder="Doe"
                value="${this.escapeHtml(this.state.patientName.split(" ").slice(1).join(" ") || "")}"
              />
            </div>
          </div>

          <div class="medos-form-row">
            <div class="medos-form-field">
              <label class="medos-form-label">
                Age <span class="medos-required">*</span>
              </label>
              <input
                type="number"
                class="medos-appointment-input"
                id="medos-patient-age"
                placeholder="25"
                min="0"
                max="120"
                value="${this.escapeHtml(this.state.patientAge)}"
              />
            </div>
            <div class="medos-form-field">
              <label class="medos-form-label">Email</label>
              <input
                type="email"
                class="medos-appointment-input"
                id="medos-patient-email"
                placeholder="jane@example.com (optional)"
                value="${this.escapeHtml(this.state.patientEmail)}"
              />
            </div>
          </div>

          <div class="medos-form-row">
            <div class="medos-form-field">
              <label class="medos-form-label">
                Gender <span class="medos-required">*</span>
              </label>
              <div id="medos-gender-select-container"></div>
            </div>
            <div class="medos-form-field">
              <label class="medos-form-label">Blood Group</label>
              <div id="medos-blood-group-select-container"></div>
            </div>
          </div>

        </div>
      </div>

      <!-- Address Information Section -->
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.mapPin(14)}
          <span class="medos-section-title">Address Information</span>
        </div>
        <div class="medos-section-body">
          <div class="medos-form-field">
            <label class="medos-form-label">
              Address <span class="medos-required">*</span>
            </label>
            <input
              type="text"
              class="medos-appointment-input"
              id="medos-patient-address"
              placeholder="123 Main Street"
              value="${this.escapeHtml(this.state.patientAddress)}"
            />
          </div>

          <div class="medos-form-row">
            <div class="medos-form-field">
              <label class="medos-form-label">
                City <span class="medos-required">*</span>
              </label>
              <input
                type="text"
                class="medos-appointment-input"
                id="medos-patient-city"
                placeholder="New York"
                value="${this.escapeHtml(this.state.patientCity)}"
              />
            </div>
            <div class="medos-form-field">
              <label class="medos-form-label">
                State <span class="medos-required">*</span>
              </label>
              <input
                type="text"
                class="medos-appointment-input"
                id="medos-patient-state"
                placeholder="NY"
                value="${this.escapeHtml(this.state.patientState)}"
              />
            </div>
          </div>

          <div class="medos-form-row">
            <div class="medos-form-field">
              <label class="medos-form-label">
                Country <span class="medos-required">*</span>
              </label>
              <input
                type="text"
                class="medos-appointment-input"
                id="medos-patient-country"
                placeholder="United States"
                value="${this.escapeHtml(this.state.patientCountry)}"
              />
            </div>
            <div class="medos-form-field">
              <label class="medos-form-label">
                Zipcode <span class="medos-required">*</span>
              </label>
              <input
                type="text"
                class="medos-appointment-input"
                id="medos-patient-zipcode"
                placeholder="10001"
                value="${this.escapeHtml(this.state.patientZipcode)}"
              />
            </div>
          </div>

          <div class="medos-form-field" style="margin-top: 20px;">
            <label class="medos-form-label">Landmark</label>
            <input
              type="text"
              class="medos-appointment-input"
              id="medos-patient-landmark"
              placeholder="Near Central Park"
              value="${this.escapeHtml(this.state.patientLandmark)}"
            />
          </div>
        </div>
      </div>

      <div class="medos-actions">
        <button class="medos-btn medos-btn-secondary" id="medos-btn-back">${VanillaIcons.arrowLeft(14)} Back</button>
        <button class="medos-btn medos-btn-primary" id="medos-btn-continue" ${isFormValid ? "" : "disabled"}>Continue</button>
      </div>
    `;
      }
      renderAppointmentSummaryStep() {
          const selectedDoctor = this.doctors.find((d) => d.id === this.state.selectedDoctor);
          const selectedAddress = this.state.addresses.find((addr) => addr.id === this.state.selectedAddress);
          const usingSessionPack = this.state.bookingType === "USE_ACTIVE_PACKAGE" &&
              this.state.selectedSessionPack;
          const usingNewPackage = this.state.bookingType === "PACKAGE_PURCHASE" &&
              this.state.selectedNewPackage;
          const isPackageBooking = this.state.bookingType === "PACKAGE_PURCHASE" ||
              this.state.bookingType === "USE_ACTIVE_PACKAGE";
          const getDuration = () => {
              if (this.state.selectedSlot) {
                  return calculateDuration(this.state.selectedSlot.start, this.state.selectedSlot.end);
              }
              return 60;
          };
          const getPaymentInfo = () => {
              if (usingSessionPack) {
                  return {
                      type: "Session Pack",
                      name: this.state.selectedSessionPack?.name || "Session Pack",
                      amount: "Prepaid",
                      remaining: `${(this.state.selectedSessionPack?.remainingSessions || 1) - 1} sessions remaining after this appointment`,
                  };
              }
              else if (usingNewPackage) {
                  return {
                      type: "New Package",
                      name: this.state.selectedNewPackage?.name || "Package",
                      amount: `₹${this.state.selectedNewPackage?.price?.toLocaleString() || 0}`,
                      remaining: `${this.state.selectedNewPackage?.totalSessions ||
                        this.state.selectedNewPackage?.sessions ||
                        1} sessions included`,
                  };
              }
              else {
                  return {
                      type: "Single Appointment",
                      name: this.state.consultationMode === "ONLINE"
                          ? "Online Consultation"
                          : "In-Person Visit",
                      amount: this.state.consultationCharge
                          ? `₹${this.state.consultationCharge}`
                          : "Pay at clinic",
                  };
              }
          };
          const paymentInfo = getPaymentInfo();
          const patient = this.state.selectedPatient;
          const patientName = patient
              ? `${patient.firstName} ${patient.lastName}`
              : this.state.patientName || "New Patient";
          return `
      <div class="medos-summary-container">
        <h3 class="medos-summary-title">Appointment Summary</h3>
        <p class="medos-summary-subtitle">
          Please review your appointment details before confirming
        </p>

        <!-- Patient Information -->
        <div class="medos-summary-section">
          <h4 class="medos-summary-section-title">👤 Patient Information</h4>
          <div class="medos-summary-card">
            <div class="medos-summary-row">
              <span class="medos-summary-label">Name</span>
              <span class="medos-summary-value">${this.escapeHtml(patientName)}</span>
            </div>
            ${patient?.email || this.state.patientEmail
            ? `
              <div class="medos-summary-row">
                <span class="medos-summary-label">Email</span>
                <span class="medos-summary-value">${this.escapeHtml(patient?.email || this.state.patientEmail || "")}</span>
              </div>
            `
            : ""}
            <div class="medos-summary-row">
              <span class="medos-summary-label">Phone</span>
              <span class="medos-summary-value">${this.escapeHtml(this.state.countryCode)} ${this.escapeHtml(this.state.patientPhone)}</span>
            </div>
            ${patient?.age || this.state.patientAge
            ? `
              <div class="medos-summary-row">
                <span class="medos-summary-label">Age</span>
                <span class="medos-summary-value">${patient?.age || this.state.patientAge} years</span>
              </div>
            `
            : ""}
            ${patient?.bloodGroup || this.state.bloodGroup
            ? `
              <div class="medos-summary-row">
                <span class="medos-summary-label">Blood Group</span>
                <span class="medos-summary-value">${this.escapeHtml(patient?.bloodGroup || this.state.bloodGroup || "")}</span>
              </div>
            `
            : ""}
          </div>
        </div>

        <!-- Appointment Details -->
        <div class="medos-summary-section">
          <h4 class="medos-summary-section-title">📅 Appointment Details</h4>
          <div class="medos-summary-card">
            <div class="medos-summary-row">
              <span class="medos-summary-label">Date</span>
              <span class="medos-summary-value">${formatDate(this.state.selectedDate)}</span>
            </div>
            <div class="medos-summary-row">
              <span class="medos-summary-label">Time</span>
              <span class="medos-summary-value">${this.state.selectedSlot
            ? `${formatTime(this.state.selectedSlot.start)} - ${formatTime(this.state.selectedSlot.end)}`
            : "Not selected"}</span>
            </div>
            <div class="medos-summary-row">
              <span class="medos-summary-label">Duration</span>
              <span class="medos-summary-value">~${getDuration()} minutes</span>
            </div>
            <div class="medos-summary-row">
              <span class="medos-summary-label">Type</span>
              <span class="medos-summary-value">${this.state.consultationMode === "ONLINE"
            ? "Online Consultation"
            : "In-Person Visit"}</span>
            </div>
          </div>
        </div>

        <!-- Doctor & Location -->
        <div class="medos-summary-section">
          <h4 class="medos-summary-section-title">🏥 Doctor & Location</h4>
          <div class="medos-summary-card">
            ${selectedDoctor
            ? `
              <div class="medos-summary-row">
                <span class="medos-summary-label">Doctor</span>
                <span class="medos-summary-value">${this.escapeHtml(selectedDoctor.name)}${selectedDoctor.specialty
                ? ` • ${this.escapeHtml(selectedDoctor.specialty)}`
                : ""}</span>
              </div>
            `
            : ""}
            ${selectedAddress
            ? `
              <div class="medos-summary-row">
                <span class="medos-summary-label">Location</span>
                <span class="medos-summary-value">${this.escapeHtml(selectedAddress.label || "Unknown Location")}</span>
              </div>
            `
            : ""}
          </div>
        </div>

        <!-- Payment Information -->
        <div class="medos-summary-section">
          <h4 class="medos-summary-section-title">💳 Payment</h4>
          <div class="medos-summary-card">
            <div class="medos-summary-row">
              <span class="medos-summary-label">Booking Type</span>
              <span class="medos-summary-value">${paymentInfo.type}</span>
            </div>
            <div class="medos-summary-row">
              <span class="medos-summary-label">${usingSessionPack ? "Pack" : "Service"}</span>
              <span class="medos-summary-value">${paymentInfo.name}</span>
            </div>
            ${isPackageBooking && this.state.selectedNewPackage
            ? `
              <div class="medos-summary-row medos-summary-total-row">
                <span class="medos-summary-total-label">Amount</span>
                <div class="medos-summary-price-container">
                  ${this.state.selectedNewPackage.discountedPrice &&
                this.state.selectedNewPackage.discountedPrice <
                    this.state.selectedNewPackage.price
                ? `
                    <span class="medos-summary-strikethrough-price">
                      ₹${this.state.selectedNewPackage.price.toLocaleString()}
                    </span>
                    <span class="medos-summary-total-value">
                      ₹${this.state.selectedNewPackage.discountedPrice.toLocaleString()}
                    </span>
                    ${this.state.selectedNewPackage.discount
                    ? `
                      <span class="medos-summary-discount-badge">
                        ${this.state.selectedNewPackage.discountType ===
                        "PERCENTAGE"
                        ? `${this.state.selectedNewPackage.discount}% OFF`
                        : `₹${this.state.selectedNewPackage.discount} OFF`}
                      </span>
                    `
                    : ""}
                  `
                : `
                    <span class="medos-summary-total-value">
                      ₹${this.state.selectedNewPackage.price.toLocaleString()}
                    </span>
                  `}
                </div>
              </div>
            `
            : !usingSessionPack
                ? `
              <div class="medos-summary-row medos-summary-total-row">
                <span class="medos-summary-total-label">Amount</span>
                <span class="medos-summary-total-value">${paymentInfo.amount}</span>
              </div>
            `
                : `
              <div class="medos-summary-row medos-summary-total-row">
                <span class="medos-summary-total-label">Amount</span>
                <span class="medos-summary-total-value">${paymentInfo.amount}</span>
              </div>
            `}
            ${paymentInfo.remaining
            ? `
              <div class="medos-summary-remaining-info">${paymentInfo.remaining}</div>
            `
            : ""}
          </div>
        </div>

        <!-- Actions -->
        <div class="medos-actions">
          <button class="medos-btn medos-btn-secondary" id="medos-btn-back">Back</button>
          <button class="medos-btn medos-btn-primary" id="medos-btn-confirm" ${this.state.loading ? "disabled" : ""}>${this.state.loading ? "Confirming..." : "Confirm Appointment"}</button>
        </div>
      </div>
    `;
      }
      renderSuccessStep() {
          const duration = this.calculateDuration();
          this.doctors.find((d) => d.id === this.state.selectedDoctor);
          const selectedAddress = this.state.addresses.find((addr) => addr.id === this.state.selectedAddress);
          const appointmentDate = this.state.selectedDate
              ? this.formatDate(formatDateToISO(this.state.selectedDate))
              : "";
          const startTime = this.state.selectedSlot?.start
              ? this.formatTime(new Date(this.state.selectedSlot.start).toTimeString().slice(0, 5))
              : "";
          const patientName = this.state.selectedPatient
              ? `${this.state.selectedPatient.firstName} ${this.state.selectedPatient.lastName}`
              : this.state.patientName || "Patient";
          const usingSessionPack = this.state.bookingOptionType === "session-pack" &&
              this.state.selectedSessionPack;
          return `
      <div class="medos-success-container">
        <div class="medos-success-header">
          <h2>Appointment Confirmed</h2>
        </div>
        
        <div class="medos-success-content">
          <div class="medos-success-badge">
            ${VanillaIcons.successBadge(64)}
          </div>
          
          <h3 class="medos-success-title">Appointment Confirmed</h3>
          
          <div class="medos-success-details">
            <h4>Appointment Details</h4>
            <div class="medos-details-text">
              <p><strong>Patient:</strong> ${this.escapeHtml(patientName)}</p>
              <p><strong>Type:</strong> ${this.state.consultationMode === "ONLINE"
            ? "In Clinic Consultation"
            : "Online"}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${startTime}</p>
              <p><strong>Duration:</strong> ~${duration} minutes</p>
              ${selectedAddress?.label
            ? `<p><strong>Location:</strong> ${this.escapeHtml(selectedAddress.label)}</p>`
            : ""}
            </div>
          </div>
          
          <p class="medos-confirmation-message">
            A confirmation message has been sent to the registered Phone Number.
          </p>
          
          ${usingSessionPack
            ? `
            <div class="medos-session-remaining">
              <span class="medos-remaining-label">Sessions:</span>
              <span class="medos-remaining-value">${(this.state.selectedSessionPack?.remainingSessions || 1) - 1} appointments now remaining</span>
            </div>
          `
            : ""}
        </div>
      </div>
    `;
      }
      formatDate(dateStr) {
          try {
              const date = new Date(dateStr);
              return date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              });
          }
          catch {
              return dateStr;
          }
      }
      formatTime(timeStr) {
          try {
              const time = new Date(`2000-01-01T${timeStr}`);
              return time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
              });
          }
          catch {
              return timeStr;
          }
      }
      calculateDuration() {
          if (this.state.selectedSlot) {
              const start = new Date(this.state.selectedSlot.start);
              const end = new Date(this.state.selectedSlot.end);
              const diffMs = end.getTime() - start.getTime();
              return Math.round(diffMs / (1000 * 60));
          }
          return 60;
      }
      attachEventListeners() {
          const consultationRadios = this.container.querySelectorAll('input[name="consultationMode"]');
          consultationRadios.forEach((radio) => {
              radio.addEventListener("change", (e) => {
                  const target = e.target;
                  this.state.consultationMode = target.value;
                  this.render();
              });
          });
          const slotCards = this.container.querySelectorAll(".medos-slot-card, .medos-slot-btn");
          slotCards.forEach((card) => {
              card.addEventListener("click", (e) => {
                  e.preventDefault();
                  const slotId = card.dataset.slotId;
                  const slotStart = card.dataset.slotStart;
                  const slotEnd = card.dataset.slotEnd;
                  if (slotStart && slotEnd) {
                      this.state.selectedSlot = {
                          start: slotStart,
                          end: slotEnd,
                          id: slotId || undefined,
                      };
                      this.render();
                  }
              });
          });
          const countryCodeInput = this.container.querySelector("#medos-country-code");
          if (countryCodeInput) {
              countryCodeInput.addEventListener("input", (e) => {
                  const target = e.target;
                  let value = target.value;
                  if (value && !value.startsWith("+")) {
                      value = "+" + value;
                  }
                  value = value.replace(/[^\d+]/g, "");
                  this.state.countryCode = value;
                  target.value = value;
                  const sendOtpBtn = this.container.querySelector("#medos-btn-send-otp");
                  if (sendOtpBtn) {
                      const canSendOtp = this.state.countryCode && this.state.patientPhone.length >= 10;
                      sendOtpBtn.disabled = !canSendOtp;
                  }
              });
          }
          const phoneInput = this.container.querySelector("#medos-phone");
          if (phoneInput) {
              phoneInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientPhone = target.value.replace(/\D/g, "");
                  target.value = this.state.patientPhone;
                  const sendOtpBtn = this.container.querySelector("#medos-btn-send-otp");
                  if (sendOtpBtn) {
                      const canSendOtp = this.state.countryCode && this.state.patientPhone.length >= 10;
                      sendOtpBtn.disabled = !canSendOtp;
                  }
              });
          }
          const otpInput = this.container.querySelector("#medos-otp");
          if (otpInput) {
              otpInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.otpCode = target.value;
                  const verifyBtn = this.container.querySelector("#medos-btn-verify-otp");
                  if (verifyBtn) {
                      verifyBtn.disabled = !(this.state.otpCode.length === 6 && !this.state.otpVerifying);
                  }
              });
          }
          const patientNameInput = this.container.querySelector("#medos-patient-name");
          if (patientNameInput) {
              patientNameInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientName = target.value;
                  this.updateSubmitButtonState();
              });
          }
          const patientAgeInput = this.container.querySelector("#medos-patient-age");
          if (patientAgeInput) {
              patientAgeInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientAge = target.value;
                  this.updateSubmitButtonState();
                  this.updatePatientDetailsButtonState();
              });
          }
          const patientEmailInput = this.container.querySelector("#medos-patient-email");
          if (patientEmailInput) {
              patientEmailInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientEmail = target.value;
                  this.updateSubmitButtonState();
              });
          }
          const patientAddressInput = this.container.querySelector("#medos-patient-address");
          if (patientAddressInput) {
              patientAddressInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientAddress = target.value;
                  this.updateSubmitButtonState();
                  this.updatePatientDetailsButtonState();
              });
          }
          const patientCityInput = this.container.querySelector("#medos-patient-city");
          if (patientCityInput) {
              patientCityInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientCity = target.value;
                  this.updateSubmitButtonState();
                  this.updatePatientDetailsButtonState();
              });
          }
          const patientStateInput = this.container.querySelector("#medos-patient-state");
          if (patientStateInput) {
              patientStateInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientState = target.value;
                  this.updateSubmitButtonState();
                  this.updatePatientDetailsButtonState();
              });
          }
          const patientCountryInput = this.container.querySelector("#medos-patient-country");
          if (patientCountryInput) {
              patientCountryInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientCountry = target.value;
                  this.updateSubmitButtonState();
                  this.updatePatientDetailsButtonState();
              });
          }
          const patientZipcodeInput = this.container.querySelector("#medos-patient-zipcode");
          if (patientZipcodeInput) {
              patientZipcodeInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientZipcode = target.value;
                  this.updateSubmitButtonState();
                  this.updatePatientDetailsButtonState();
              });
          }
          const patientLandmarkInput = this.container.querySelector("#medos-patient-landmark");
          if (patientLandmarkInput) {
              patientLandmarkInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientLandmark = target.value;
              });
          }
          const patientFirstNameInput = this.container.querySelector("#medos-patient-first-name");
          if (patientFirstNameInput) {
              patientFirstNameInput.addEventListener("input", (e) => {
                  const target = e.target;
                  const lastName = this.state.patientName.split(" ").slice(1).join(" ") || "";
                  this.state.patientName = `${target.value} ${lastName}`.trim();
                  this.updatePatientDetailsButtonState();
              });
          }
          const patientLastNameInput = this.container.querySelector("#medos-patient-last-name");
          if (patientLastNameInput) {
              patientLastNameInput.addEventListener("input", (e) => {
                  const target = e.target;
                  const firstName = this.state.patientName.split(" ")[0] || "";
                  this.state.patientName = `${firstName} ${target.value}`.trim();
                  this.updatePatientDetailsButtonState();
              });
          }
          const optionCards = this.container.querySelectorAll(".medos-option-card");
          optionCards.forEach((card) => {
              card.addEventListener("click", () => {
                  const option = card.dataset.option;
                  const packId = card.dataset.packId
                      ? Number.parseInt(card.dataset.packId, 10)
                      : null;
                  if (option === "new-appointment" ||
                      option === "session-pack" ||
                      option === "explore-packages") {
                      this.state.bookingOptionType = option;
                      if (option === "session-pack" && packId) {
                          const pack = this.state.userSessionPacks.find((p) => p.id === packId);
                          if (pack) {
                              this.state.selectedSessionPack = pack;
                          }
                      }
                      this.render();
                  }
              });
          });
          const packCards = this.container.querySelectorAll(".medos-session-pack-card");
          packCards.forEach((card) => {
              card.addEventListener("click", () => {
                  const packId = Number.parseInt(card.dataset.packId || "0", 10);
                  const pack = this.state.userSessionPacks.find((p) => p.id === packId);
                  if (pack) {
                      this.state.selectedSessionPack = pack;
                      this.state.bookingOptionType = "session-pack";
                      this.render();
                  }
              });
          });
          const packageCards = this.container.querySelectorAll(".medos-package-card");
          packageCards.forEach((card) => {
              card.addEventListener("click", () => {
                  const packageId = parseInt(card.dataset.packageId || "0", 10);
                  const pkg = this.state.availablePackages.length > 0
                      ? this.state.availablePackages.find((p) => p.id === packageId)
                      : {
                          id: packageId,
                          name: packageId === 1 ? "Silver Package" : "Gold Package",
                          totalSessions: packageId === 1 ? 3 : 5,
                          price: packageId === 1 ? 5000 : 8000,
                          validityDays: packageId === 1 ? 180 : 365,
                          applicableOnline: true,
                          applicableOffline: true,
                      };
                  if (pkg) {
                      this.state.selectedNewPackage = pkg;
                      this.render();
                  }
              });
          });
          const patientCards = this.container.querySelectorAll(".medos-patient-card");
          patientCards.forEach((card) => {
              card.addEventListener("click", () => {
                  const patientId = parseInt(card.dataset.patientId || "0", 10);
                  const patients = this.state.verifiedPatients.length > 0
                      ? this.state.verifiedPatients
                      : this.getPlaceholderPatients();
                  const patient = patients.find((p) => p.id === patientId);
                  if (patient) {
                      this.handleSelectExistingPatient(patient);
                  }
              });
          });
          const nextBtn = this.container.querySelector("#medos-btn-next");
          if (nextBtn) {
              nextBtn.addEventListener("click", () => {
                  if (!nextBtn.disabled) {
                      this.goToNext();
                  }
              });
          }
          const continueBtn = this.container.querySelector("#medos-btn-continue");
          if (continueBtn) {
              continueBtn.addEventListener("click", () => {
                  if (!continueBtn.disabled) {
                      this.goToNext();
                  }
              });
          }
          const backBtn = this.container.querySelector("#medos-btn-back");
          if (backBtn) {
              backBtn.addEventListener("click", () => this.goBack());
          }
          const sendOtpBtn = this.container.querySelector("#medos-btn-send-otp");
          if (sendOtpBtn) {
              sendOtpBtn.addEventListener("click", () => {
                  if (!sendOtpBtn.disabled) {
                      this.sendOtp();
                  }
              });
          }
          const verifyOtpBtn = this.container.querySelector("#medos-btn-verify-otp");
          if (verifyOtpBtn) {
              verifyOtpBtn.addEventListener("click", () => {
                  if (!verifyOtpBtn.disabled) {
                      this.verifyOtp();
                  }
              });
          }
          const changeNumberBtn = this.container.querySelector("#medos-btn-change-number");
          if (changeNumberBtn) {
              changeNumberBtn.addEventListener("click", () => {
                  this.setState({ otpSent: false, otpCode: "", otpVerified: false });
                  this.render();
              });
          }
          const resendOtpBtn = this.container.querySelector("#medos-btn-resend-otp");
          if (resendOtpBtn) {
              resendOtpBtn.addEventListener("click", () => {
                  this.sendOtp();
              });
          }
          const confirmBtn = this.container.querySelector("#medos-btn-confirm");
          if (confirmBtn) {
              confirmBtn.addEventListener("click", () => {
                  if (!confirmBtn.disabled) {
                      this.submitAppointment();
                  }
              });
          }
          const submitBtn = this.container.querySelector("#medos-btn-submit");
          if (submitBtn) {
              submitBtn.addEventListener("click", () => {
                  if (!submitBtn.disabled) {
                      this.submitAppointment();
                  }
              });
          }
          const bookAnotherBtn = this.container.querySelector("#medos-btn-book-another");
          if (bookAnotherBtn) {
              bookAnotherBtn.addEventListener("click", () => this.reset());
          }
          const addPatientBtn = this.container.querySelector("#medos-btn-add-patient");
          if (addPatientBtn) {
              addPatientBtn.addEventListener("click", () => {
                  this.handleProceedAsNewPatient();
              });
          }
      }
      handleSelectExistingPatient(patient) {
          this.state.selectedPatient = patient;
          this.state.useExistingPatient = true;
          this.state.patientName = `${patient.firstName} ${patient.lastName}`;
          this.state.patientEmail = patient.email;
          this.state.patientAge = patient.age.toString();
          this.state.patientGender = patient.gender;
          this.state.bloodGroup = patient.bloodGroup;
          if (patient.address) {
              this.state.patientAddress = patient.address.addressLine1;
              this.state.patientCity = patient.address.city;
              this.state.patientState = patient.address.state;
              this.state.patientCountry = patient.address.country;
              this.state.patientZipcode = patient.address.zipcode;
              this.state.patientLandmark = patient.address.landmark || "";
          }
          this.state.step = 6;
          this.render();
      }
      handleProceedAsNewPatient() {
          this.state.selectedPatient = null;
          this.state.useExistingPatient = false;
          this.state.patientName = "";
          this.state.patientEmail = "";
          this.state.patientAge = "";
          this.state.patientGender = "";
          this.state.bloodGroup = "";
          this.state.patientAddress = "";
          this.state.patientCity = "";
          this.state.patientState = "";
          this.state.patientCountry = "";
          this.state.patientZipcode = "";
          this.state.patientLandmark = "";
          this.state.step = 5;
          this.render();
      }
      getPlaceholderPatients() {
          return [
              {
                  id: 1,
                  firstName: "Mumma",
                  lastName: "Bear",
                  email: "mumma@example.com",
                  countryCode: "+91",
                  phoneNumber: this.state.patientPhone,
                  dob: "1970-01-01",
                  age: 55,
                  gender: "FEMALE",
                  bloodGroup: "O+",
                  mrn: "MRN001",
                  address: {
                      id: 1,
                      completeAddress: "123 Main St",
                      addressLine1: "123 Main St",
                      addressLine2: "",
                      city: "Mumbai",
                      state: "Maharashtra",
                      country: "India",
                      zipcode: "400001",
                      landmark: "",
                      phoneNumber: this.state.patientPhone,
                      latitude: 0,
                      longitude: 0,
                  },
              },
              {
                  id: 2,
                  firstName: "Papa",
                  lastName: "Bear",
                  email: "papa@example.com",
                  countryCode: "+91",
                  phoneNumber: this.state.patientPhone,
                  dob: "1968-01-01",
                  age: 57,
                  gender: "MALE",
                  bloodGroup: "B+",
                  mrn: "MRN002",
                  address: {
                      id: 2,
                      completeAddress: "123 Main St",
                      addressLine1: "123 Main St",
                      addressLine2: "",
                      city: "Mumbai",
                      state: "Maharashtra",
                      country: "India",
                      zipcode: "400001",
                      landmark: "",
                      phoneNumber: this.state.patientPhone,
                      latitude: 0,
                      longitude: 0,
                  },
              },
          ];
      }
      escapeHtml(text) {
          const div = document.createElement("div");
          div.textContent = text;
          return div.innerHTML;
      }
      isValidDateOfBirth(dob) {
          try {
              return validateDateOfBirth(dob);
          }
          catch (error) {
              console.warn("Date of birth validation error:", error);
              return false;
          }
      }
      isValidBloodGroup(bloodGroup) {
          try {
              return validateBloodGroup(bloodGroup);
          }
          catch (error) {
              console.warn("Blood group validation error:", error);
              return false;
          }
      }
      safeMapBloodGroupToApi(bloodGroup) {
          try {
              if (!bloodGroup) {
                  return "UNKNOWN";
              }
              if (!this.isValidBloodGroup(bloodGroup)) {
                  console.warn(`Invalid blood group provided: ${bloodGroup}, using UNKNOWN`);
                  return "UNKNOWN";
              }
              const mapped = mapBloodGroupToApi(bloodGroup);
              if (!mapped || mapped === "") {
                  console.warn(`Blood group mapping failed for: ${bloodGroup}, using UNKNOWN`);
                  return "UNKNOWN";
              }
              return mapped;
          }
          catch (error) {
              console.error("Blood group mapping error:", error);
              return "UNKNOWN";
          }
      }
      safeFormatDateOfBirth(dob) {
          try {
              if (!dob) {
                  return undefined;
              }
              if (!this.isValidDateOfBirth(dob)) {
                  console.warn(`Invalid date of birth provided: ${dob}, excluding from payload`);
                  return undefined;
              }
              return dob;
          }
          catch (error) {
              console.error("Date of birth formatting error:", error);
              return undefined;
          }
      }
      getDateOfBirthErrorMessage(dobValue) {
          try {
              const today = new Date();
              const inputDate = new Date(dobValue);
              if (inputDate > today) {
                  return '<div class="medos-validation-error">Date of birth cannot be in the future</div>';
              }
              else if (!/^\d{4}-\d{2}-\d{2}$/.test(dobValue)) {
                  return '<div class="medos-validation-error">Please use YYYY-MM-DD format</div>';
              }
              else {
                  return '<div class="medos-validation-error">Please enter a valid date of birth</div>';
              }
          }
          catch (error) {
              console.warn("Error generating date of birth error message:", error);
              return '<div class="medos-validation-error">Please enter a valid date of birth</div>';
          }
      }
      displayFieldValidationError(fieldName, errorType) {
          let errorMessage = "";
          switch (fieldName) {
              case "bloodGroup":
                  switch (errorType) {
                      case "invalid":
                          errorMessage =
                              "Please select a valid blood group from the dropdown or leave it empty.";
                          break;
                      case "mapping":
                          errorMessage =
                              "Blood group selection failed. Please try selecting again or leave it empty.";
                          break;
                      default:
                          errorMessage =
                              "Blood group validation failed. Please check your selection.";
                  }
                  break;
              case "dateOfBirth":
                  switch (errorType) {
                      case "invalid":
                          errorMessage =
                              "Please enter a valid date of birth in YYYY-MM-DD format or leave it empty.";
                          break;
                      case "future":
                          errorMessage =
                              "Date of birth cannot be in the future. Please enter a valid past date.";
                          break;
                      case "format":
                          errorMessage =
                              "Please enter date of birth in the correct format (YYYY-MM-DD).";
                          break;
                      default:
                          errorMessage =
                              "Date of birth validation failed. Please check the date format.";
                  }
                  break;
              default:
                  errorMessage = `Validation failed for ${fieldName}. Please check your input.`;
          }
          this.setState({ error: errorMessage });
      }
      async handleSubmitAppointment() {
          await this.submitAppointment();
      }
      async handleOtpVerification(otpCode) {
          this.state.otpCode = otpCode;
          await this.verifyOtp();
          if (this.state.otpVerified) {
              this.goToNext();
          }
      }
      handleAddressSelect(addressId) {
          return this.handleAddressChange(addressId);
      }
      handleDoctorSelect(doctorId) {
          this.state.selectedDoctor = doctorId;
          const selectedDoc = this.doctors.find((d) => d.id === doctorId);
          if (selectedDoc?.consultationCharge) {
              this.state.consultationCharge = selectedDoc.consultationCharge;
          }
          this.render();
      }
      handleDateSelect(date) {
          this.state.selectedDate = date;
          this.loadSlots();
      }
      handleSlotSelect(slot) {
          this.state.selectedSlot = slot;
          this.render();
      }
      handleSessionPackSelect(sessionPack) {
          this.state.selectedSessionPack = sessionPack;
          this.state.bookingOptionType = "session-pack";
          this.render();
      }
      handleExplorePackages() {
          this.state.bookingOptionType = "explore-packages";
          this.state.showPackageExplorer = true;
          this.render();
      }
      handlePackageSelect(packageItem) {
          this.state.selectedNewPackage = packageItem;
          this.render();
      }
      handleNewAppointmentSelect() {
          this.state.bookingOptionType = "new-appointment";
          this.render();
      }
      handlePatientSelect(patient) {
          this.handleSelectExistingPatient(patient);
      }
      handleNewPatient() {
          this.handleProceedAsNewPatient();
      }
      goToNextStep() {
          this.goToNext();
      }
      goBackStep() {
          this.goBack();
      }
      getState() {
          return { ...this.state };
      }
      destroy() {
          this.mounted = false;
          this.container.innerHTML = "";
      }
  }
  function initAppointmentCalendar(options) {
      const container = document.getElementById(options.containerId);
      if (!container) {
          throw new Error(`Container element with id "${options.containerId}" not found`);
      }
      return new AppointmentCalendarWidget(container, options);
  }

  const EnquiryService = {
      async submitEnquiry(payload) {
          try {
              const client = await MedosClient.ensureInitialized();
              const enquiryPayload = {
                  type: "ENQUIRY",
                  subject: payload.inquirySubject,
                  description: payload.inquiryMessage,
                  senderName: payload.patientName,
                  senderEmail: payload.patientEmail,
                  senderPhone: `${payload.countryCode}${payload.patientPhone}`,
              };
              const formData = new FormData();
              const jsonBlob = new Blob([JSON.stringify(enquiryPayload)], {
                  type: "application/json",
              });
              formData.append("payload", jsonBlob);
              const res = await client.post("/inbox/create", formData);
              return res.data;
          }
          catch (error) {
              if (error instanceof Error) {
                  throw new Error(`Failed to submit enquiry: ${error.message}`);
              }
              throw new Error("Failed to submit enquiry: Unknown error");
          }
      },
  };

  const validateName = (name) => {
      return name.trim().length > 0;
  };
  const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  };
  const validatePhoneNumber = (phone) => {
      const cleaned = phone.replace(/\D/g, "");
      return cleaned.length >= 7 && cleaned.length <= 15;
  };
  const validateSubject = (subject) => {
      return subject.trim().length > 0;
  };
  const validateMessage = (message) => {
      const trimmed = message.trim();
      return trimmed.length > 0;
  };
  const validateCountryCode = (code) => {
      return /^\+[1-9]\d{0,3}$/.test(code);
  };

  const COUNTRY_CODES_ENQUIRY = [
      { value: "+91", label: "🇮🇳 +91" },
      { value: "+1", label: "🇺🇸 +1" },
      { value: "+44", label: "🇬🇧 +44" },
      { value: "+86", label: "🇨🇳 +86" },
      { value: "+81", label: "🇯🇵 +81" },
  ];
  class EnquiryFormWidget {
      constructor(container, options) {
          this.mounted = true;
          this.countryCodeSelect = null;
          this.contactMethodSelect = null;
          injectThemedStyles();
          if (typeof container === "string") {
              const el = document.getElementById(container);
              if (!el) {
                  throw new Error(`Container element with id "${container}" not found`);
              }
              this.container = el;
          }
          else {
              this.container = container;
          }
          this.options = options;
          this.state = {
              step: 0,
              loading: false,
              error: null,
              patientName: "",
              patientEmail: "",
              countryCode: "+91",
              patientPhone: "",
              inquirySubject: "",
              inquiryMessage: "",
              preferredContactMethod: "EMAIL",
              submitted: false,
          };
          this.init();
      }
      async init() {
          if (this.options.apiKey) {
              await MedosClient.init({
                  apiKey: this.options.apiKey,
              });
          }
          else if (this.options.sessionToken) {
              await MedosClient.initWithSession({
                  sessionToken: this.options.sessionToken,
              });
          }
          else {
              throw new Error("Either apiKey or sessionToken must be provided");
          }
          this.render();
      }
      validateContactStep() {
          this.setState({ error: null });
          if (!validateName(this.state.patientName)) {
              this.setState({ error: "Please enter a valid name." });
              return false;
          }
          if (this.state.patientEmail && !validateEmail(this.state.patientEmail)) {
              this.setState({ error: "Please enter a valid email address." });
              return false;
          }
          if (!validateCountryCode(this.state.countryCode)) {
              this.setState({
                  error: "Please enter a valid country code (e.g., +91, +1).",
              });
              return false;
          }
          if (!validatePhoneNumber(this.state.patientPhone)) {
              this.setState({
                  error: "Please enter a valid phone number (7-15 digits).",
              });
              return false;
          }
          return true;
      }
      validateInquiryStep() {
          this.setState({ error: null });
          if (!validateSubject(this.state.inquirySubject)) {
              this.setState({ error: "Please enter a valid subject." });
              return false;
          }
          if (!validateMessage(this.state.inquiryMessage)) {
              this.setState({
                  error: "Please enter a valid message (max 1000 characters).",
              });
              return false;
          }
          return true;
      }
      goToNext() {
          if (this.state.step === 0) {
              if (!this.validateContactStep()) {
                  this.render();
                  return;
              }
          }
          else if (this.state.step === 1) {
              if (!this.validateInquiryStep()) {
                  this.render();
                  return;
              }
          }
          this.state.step = Math.min(3, this.state.step + 1);
          this.render();
      }
      goBack() {
          this.state.step = Math.max(0, this.state.step - 1);
          this.render();
      }
      async submitEnquiry() {
          this.setState({ error: null });
          if (!this.validateContactStep() || !this.validateInquiryStep()) {
              this.render();
              return;
          }
          this.setState({ loading: true });
          this.render();
          try {
              const payload = {
                  patientName: this.state.patientName,
                  patientEmail: this.state.patientEmail,
                  countryCode: this.state.countryCode,
                  patientPhone: this.state.patientPhone,
                  inquirySubject: this.state.inquirySubject,
                  inquiryMessage: this.state.inquiryMessage,
                  preferredContactMethod: this.state.preferredContactMethod,
              };
              await EnquiryService.submitEnquiry(payload);
              this.state.step = 3;
              this.options.onSuccess?.(payload);
              setTimeout(() => {
                  this.resetForm();
              }, 5000);
          }
          catch (e) {
              const msg = e.message || "Failed to submit enquiry";
              this.setState({ error: msg });
              this.options.onError?.(e);
          }
          finally {
              this.setState({ loading: false });
              this.render();
          }
      }
      resetForm() {
          this.state = {
              step: 0,
              loading: false,
              error: null,
              patientName: "",
              patientEmail: "",
              countryCode: "+91",
              patientPhone: "",
              inquirySubject: "",
              inquiryMessage: "",
              preferredContactMethod: "EMAIL",
              submitted: false,
          };
          this.render();
      }
      setState(updates) {
          this.state = { ...this.state, ...updates };
      }
      render() {
          if (!this.mounted)
              return;
          this.container.innerHTML = `
      <div class="medos-enquiry-container">
        <div class="medos-enquiry-card">
          ${this.state.step !== 3
            ? `
            <div class="medos-enquiry-header">
              <h2 class="medos-enquiry-title">Submit Inquiry</h2>
              <p class="medos-enquiry-step-indicator">Step ${this.state.step + 1} of 3</p>
            </div>

            ${this.state.loading
                ? '<div class="medos-enquiry-loading">Loading...</div>'
                : ""}
            ${this.state.error
                ? `<div class="medos-enquiry-error">${this.escapeHtml(this.state.error)}</div>`
                : ""}
          `
            : ""}

          ${this.renderStep()}
        </div>
      </div>
    `;
          this.attachEventListeners();
          this.initializeCustomComponents();
      }
      initializeCustomComponents() {
          if (this.state.step === 0) {
              const countryCodeContainer = this.container.querySelector("#medos-enquiry-country-code-container");
              if (countryCodeContainer) {
                  this.countryCodeSelect = new VanillaSelect(countryCodeContainer, COUNTRY_CODES_ENQUIRY, {
                      placeholder: "Country",
                      onValueChange: (value) => {
                          this.state.countryCode = value;
                      },
                  });
                  if (this.state.countryCode) {
                      this.countryCodeSelect.setValue(this.state.countryCode);
                  }
              }
          }
          if (this.state.step === 2) {
              const contactMethodContainer = this.container.querySelector("#medos-enquiry-contact-method-container");
              if (contactMethodContainer) {
                  this.contactMethodSelect = createContactMethodSelect(contactMethodContainer, this.state.preferredContactMethod, (value) => {
                      this.state.preferredContactMethod = value;
                  });
              }
          }
      }
      renderStep() {
          switch (this.state.step) {
              case 0:
                  return this.renderStep0();
              case 1:
                  return this.renderStep1();
              case 2:
                  return this.renderStep2();
              case 3:
                  return this.renderStep3();
              default:
                  return "";
          }
      }
      renderStep0() {
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.user(14)}
          <span class="medos-section-title">Contact Information</span>
        </div>
        <div class="medos-section-body">
          <div class="medos-form-group">
            <label class="medos-label">Full Name <span class="medos-required">*</span></label>
            <input 
              type="text" 
              class="medos-input" 
              id="medos-enquiry-name" 
              placeholder="Enter your full name"
              value="${this.escapeHtml(this.state.patientName)}"
            />
          </div>
          
          <div class="medos-form-group">
            <label class="medos-label">Email Address</label>
            <input 
              type="email" 
              class="medos-input" 
              id="medos-enquiry-email" 
              placeholder="your.email@example.com"
              value="${this.escapeHtml(this.state.patientEmail)}"
            />
          </div>
          
          <div class="medos-form-group">
            <label class="medos-label">Phone Number <span class="medos-required">*</span></label>
            <div class="medos-phone-input-row">
              <div class="medos-country-code-wrapper">
                <div id="medos-enquiry-country-code-container"></div>
              </div>
              <div class="medos-phone-wrapper">
                <input 
                  type="tel" 
                  class="medos-input" 
                  id="medos-enquiry-phone" 
                  placeholder="Enter phone number"
                  value="${this.escapeHtml(this.state.patientPhone)}"
                  maxlength="15"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="medos-actions">
        <button class="medos-btn medos-btn-secondary" id="medos-enquiry-btn-cancel">Cancel</button>
        <button class="medos-btn medos-btn-primary" id="medos-enquiry-btn-next">Next</button>
      </div>
    `;
      }
      renderStep1() {
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.mail(14)}
          <span class="medos-section-title">Inquiry Details</span>
        </div>
        <div class="medos-section-body">
          <div class="medos-form-group">
            <label class="medos-label">Subject <span class="medos-required">*</span></label>
            <input 
              type="text" 
              class="medos-input" 
              id="medos-enquiry-subject" 
              placeholder="What is your inquiry about?"
              value="${this.escapeHtml(this.state.inquirySubject)}"
            />
          </div>
          
          <div class="medos-form-group">
            <label class="medos-label">Message <span class="medos-required">*</span></label>
            <textarea 
              class="medos-textarea" 
              id="medos-enquiry-message" 
              placeholder="Please describe your inquiry in detail (max 1000 characters)"
              maxlength="1000"
            >${this.escapeHtml(this.state.inquiryMessage)}</textarea>
            <div class="medos-char-count">${this.state.inquiryMessage.length}/1000</div>
          </div>
        </div>
      </div>
      
      <div class="medos-actions">
        <button class="medos-btn medos-btn-secondary" id="medos-enquiry-btn-back">Back</button>
        <button class="medos-btn medos-btn-primary" id="medos-enquiry-btn-next">Next</button>
      </div>
    `;
      }
      renderStep2() {
          return `
      <div class="medos-section-card">
        <div class="medos-section-header">
          ${VanillaIcons.phone(14)}
          <span class="medos-section-title">Contact Preference</span>
        </div>
        <div class="medos-section-body">
          <p class="medos-section-description">How would you prefer to be contacted?</p>
          <div class="medos-form-group">
            <label class="medos-label">Preferred Contact Method</label>
            <div class="medos-contact-method-container" id="medos-enquiry-contact-method-container"></div>
          </div>
        </div>
      </div>
      
      <div class="medos-actions">
        <button class="medos-btn medos-btn-secondary" id="medos-enquiry-btn-back">Back</button>
        <button class="medos-btn medos-btn-primary" id="medos-enquiry-btn-submit" ${this.state.loading ? "disabled" : ""} style="opacity: ${this.state.loading ? 0.6 : 1}">${this.state.loading ? "Submitting..." : "Submit Inquiry"}</button>
      </div>
    `;
      }
      renderStep3() {
          return `
      <div style="display: flex; flex-direction: column; padding: 0; font-family: Arial, sans-serif; background: #f8f9fa; min-height: 500px;">
        <!-- Header with border -->
        <div style="padding: 20px 24px; font-size: 24px; font-weight: bold; color: #1a365d; border-bottom: 2px solid #e2e8f0; background: white;">
          Inquiry Confirmed
        </div>
        
        <!-- Main content with border -->
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; border: 2px solid #e2e8f0; border-top: none; background: white; text-align: center;">
          <!-- Success Title -->
          <h2 style="font-size: 20px; font-weight: 600; color: #006E0F; margin: 0 0 24px 0;">
            Inquiry Submitted Successfully
          </h2>
          
          <!-- Success Icon -->
          <div style="margin-bottom: 32px;">
            ${this.renderSuccessIcon()}
          </div>
          
          <!-- Inquiry Details -->
          <div style="width: 100%; max-width: 500px; margin-bottom: 32px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #006E0F; margin-bottom: 24px;">
              Inquiry Details
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 12px; font-size: 16px; line-height: 1.6; color: #4a5568;">
              <div><strong style="color: #006E0F;">Name:</strong> ${this.escapeHtml(this.state.patientName || "Patient")}</div>
              <div><strong style="color: #006E0F;">Email:</strong> ${this.escapeHtml(this.state.patientEmail)}</div>
              <div><strong style="color: #006E0F;">Phone:</strong> ${this.escapeHtml(this.state.countryCode)} ${this.escapeHtml(this.state.patientPhone)}</div>
              <div><strong style="color: #006E0F;">Subject:</strong> ${this.escapeHtml(this.state.inquirySubject)}</div>
              <div><strong style="color: #006E0F;">Preferred Contact:</strong> ${this.state.preferredContactMethod === "PHONE"
            ? "Phone"
            : this.state.preferredContactMethod === "EMAIL"
                ? "Email"
                : "Both"}</div>
            </div>
          </div>
          
          <!-- Confirmation Message -->
          <div style="font-size: 16px; font-style: italic; color: #718096; text-align: center; max-width: 600px; line-height: 1.5;">
            Thank you for your inquiry. We have received your message and will get back to you soon via your preferred contact method.
          </div>
        </div>
      </div>
    `;
      }
      renderSuccessIcon() {
          return `
      <div style="position: relative; display: inline-block;">
        <svg width="64" height="64" viewBox="0 0 41 41" fill="none">
          <path
            d="M31.1309 4.90254C32.388 4.98797 33.0166 5.03069 33.5247 5.25288             C34.2598 5.57438 34.8467 6.16126 35.1682 6.8964C35.3904 7.40445 35.4331 8.03302 35.5185 9.29016L35.7135 12.159C35.748 12.6674 35.7653 12.9217 35.8206 13.1645C35.9004 13.5154 36.0391 13.8503 36.2308 14.1549C36.3634 14.3657 36.531 14.5576 36.8661 14.9416L38.7568 17.108C39.5853 18.0574 39.9996 18.532 40.2017 19.0484C40.4942 19.7955 40.4942 20.6255 40.2017 21.3727C39.9996 21.889 39.5853 22.3637 38.7568 23.313L36.8661 25.4795C36.531 25.8634 36.3634 26.0554 36.2308 26.2662C36.0391 26.5708 35.9004 26.9056 35.8206 27.2566C35.7653 27.4994 35.748 27.7536 35.7135 28.2621L35.5185 31.1309C35.4331 32.388 35.3904 33.0166 35.1682 33.5247C34.8467 34.2598 34.2598 34.8467 33.5247 35.1682C33.0166 35.3904 32.388 35.4331 31.1309 35.5185L28.2621 35.7135C27.7536 35.748 27.4994 35.7653 27.2566 35.8206C26.9056 35.9004 26.5708 36.0391 26.2662 36.2308C26.0554 36.3634 25.8634 36.531 25.4795 36.8661L23.313 38.7568C22.3637 39.5853 21.889 39.9996 21.3727 40.2017C20.6255 40.4942 19.7955 40.4942 19.0484 40.2017C18.532 39.9996 18.0574 39.5853 17.108 38.7568L14.9416 36.8661C14.5576 36.531 14.3657 36.3634 14.1549 36.2308C13.8503 36.0391 13.5154 35.9004 13.1645 35.8206C12.9217 35.7653 12.6674 35.748 12.159 35.7135L9.29016 35.5185C8.03302 35.4331 7.40445 35.3904 6.8964 35.1682C6.16126 34.8467 5.57438 34.2598 5.25288 33.5247C5.03069 33.0166 4.98797 32.388 4.90254 31.1309L4.70759 28.2621C4.67304 27.7536 4.65576 27.4994 4.60049 27.2566C4.52063 26.9056 4.38193 26.5708 4.19028 26.2662C4.05764 26.0554 3.89009 25.8634 3.555 25.4795L1.66428 23.313C0.83576 22.3637 0.421499 21.889 0.219363 21.3727C-0.073121 20.6255 -0.0731209 19.7955 0.219363 19.0484C0.421499 18.532 0.83576 18.0574 1.66428 17.108L3.555 14.9416C3.89009 14.5576 4.05764 14.3657 4.19027 14.1549C4.38193 13.8503 4.52063 13.5154 4.60049 13.1645C4.65576 12.9217 4.67304 12.6674 4.70759 12.159L4.90254 9.29016C4.98797 8.03302 5.03069 7.40445 5.25288 6.8964C5.57438 6.16126 6.16126 5.57438 6.8964 5.25288C7.40445 5.03069 8.03302 4.98797 9.29016 4.90254L12.159 4.70759C12.6674 4.67304 12.9217 4.65577 13.1645 4.6005C13.5154 4.52063 13.8503 4.38193 14.1549 4.19028C14.3657 4.05764 14.5576 3.89009 14.9416 3.555L17.108 1.66428C18.0574 0.83576 18.532 0.421499 19.0484 0.219363C19.7955 -0.073121 20.6255 -0.073121 21.3727 0.219363C21.889 0.421499 22.3637 0.83576 23.313 1.66428L25.4795 3.555C25.8634 3.89009 26.0554 4.05764 26.2662 4.19028C26.5708 4.38193 26.9056 4.52063 27.2566 4.6005C27.4994 4.65577 27.7536 4.67304 28.2621 4.70759L31.1309 4.90254Z"
            fill="#006E0F"
          />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
          <path
            d="M5.472 11.544L0 6.072L1.368 4.704L5.472 8.808L14.28 0L15.648 1.368L5.472 11.544Z"
            fill="white"
          />
        </svg>
      </div>
    `;
      }
      attachEventListeners() {
          const nameInput = this.container.querySelector("#medos-enquiry-name");
          if (nameInput) {
              nameInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientName = target.value;
              });
          }
          const emailInput = this.container.querySelector("#medos-enquiry-email");
          if (emailInput) {
              emailInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientEmail = target.value;
              });
          }
          const countryCodeInput = this.container.querySelector("#medos-enquiry-country-code");
          if (countryCodeInput) {
              countryCodeInput.addEventListener("input", (e) => {
                  const target = e.target;
                  let value = target.value;
                  if (value && !value.startsWith("+")) {
                      value = "+" + value;
                  }
                  value = value.replace(/[^\d+]/g, "");
                  this.state.countryCode = value;
                  target.value = value;
              });
          }
          const phoneInput = this.container.querySelector("#medos-enquiry-phone");
          if (phoneInput) {
              phoneInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.patientPhone = target.value.replace(/\D/g, "");
                  target.value = this.state.patientPhone;
              });
          }
          const subjectInput = this.container.querySelector("#medos-enquiry-subject");
          if (subjectInput) {
              subjectInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.inquirySubject = target.value;
              });
          }
          const messageInput = this.container.querySelector("#medos-enquiry-message");
          if (messageInput) {
              messageInput.addEventListener("input", (e) => {
                  const target = e.target;
                  this.state.inquiryMessage = target.value;
                  this.render();
              });
          }
          const nextBtn = this.container.querySelector("#medos-enquiry-btn-next");
          if (nextBtn) {
              nextBtn.addEventListener("click", () => this.goToNext());
          }
          const backBtn = this.container.querySelector("#medos-enquiry-btn-back");
          if (backBtn) {
              backBtn.addEventListener("click", () => this.goBack());
          }
          const submitBtn = this.container.querySelector("#medos-enquiry-btn-submit");
          if (submitBtn) {
              submitBtn.addEventListener("click", () => this.submitEnquiry());
          }
          const cancelBtn = this.container.querySelector("#medos-enquiry-btn-cancel");
          if (cancelBtn) {
              cancelBtn.addEventListener("click", () => this.resetForm());
          }
      }
      escapeHtml(text) {
          const div = document.createElement("div");
          div.textContent = text;
          return div.innerHTML;
      }
      destroy() {
          this.mounted = false;
          if (this.countryCodeSelect) {
              this.countryCodeSelect.destroy();
              this.countryCodeSelect = null;
          }
          if (this.contactMethodSelect) {
              this.contactMethodSelect.destroy();
              this.contactMethodSelect = null;
          }
          this.container.innerHTML = "";
      }
  }
  function initEnquiryForm(options) {
      const container = document.getElementById(options.containerId);
      if (!container) {
          throw new Error(`Container element with id "${options.containerId}" not found`);
      }
      return new EnquiryFormWidget(container, options);
  }

  if (typeof window !== "undefined") {
      window.MedosAppointmentCalendar = {
          init: initAppointmentCalendar,
          Widget: AppointmentCalendarWidget,
      };
      window.MedosEnquiryForm = {
          init: initEnquiryForm,
          Widget: EnquiryFormWidget,
      };
      window.MedosAppointmentWidget = AppointmentCalendarWidget;
      window.MedosEnquiryWidget = EnquiryFormWidget;
  }

  exports.AppointmentCalendarWidget = AppointmentCalendarWidget;
  exports.EnquiryFormWidget = EnquiryFormWidget;
  exports.initAppointmentCalendar = initAppointmentCalendar;
  exports.initEnquiryForm = initEnquiryForm;

}));
