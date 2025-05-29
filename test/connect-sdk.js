(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ConnectSDK = factory());
})(this, (function () { 'use strict';

  function asyncGeneratorStep(n, t, e, r, o, a, c) {
    try {
      var i = n[a](c),
        u = i.value;
    } catch (n) {
      return void e(n);
    }
    i.done ? t(u) : Promise.resolve(u).then(r, o);
  }
  function _asyncToGenerator(n) {
    return function () {
      var t = this,
        e = arguments;
      return new Promise(function (r, o) {
        var a = n.apply(t, e);
        function _next(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
        }
        function _throw(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
        }
        _next(void 0);
      });
    };
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return e;
    };
    var t,
      e = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      o = Object.defineProperty || function (t, e, r) {
        t[e] = r.value;
      },
      i = "function" == typeof Symbol ? Symbol : {},
      a = i.iterator || "@@iterator",
      c = i.asyncIterator || "@@asyncIterator",
      u = i.toStringTag || "@@toStringTag";
    function define(t, e, r) {
      return Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), t[e];
    }
    try {
      define({}, "");
    } catch (t) {
      define = function (t, e, r) {
        return t[e] = r;
      };
    }
    function wrap(t, e, r, n) {
      var i = e && e.prototype instanceof Generator ? e : Generator,
        a = Object.create(i.prototype),
        c = new Context(n || []);
      return o(a, "_invoke", {
        value: makeInvokeMethod(t, r, c)
      }), a;
    }
    function tryCatch(t, e, r) {
      try {
        return {
          type: "normal",
          arg: t.call(e, r)
        };
      } catch (t) {
        return {
          type: "throw",
          arg: t
        };
      }
    }
    e.wrap = wrap;
    var h = "suspendedStart",
      l = "suspendedYield",
      f = "executing",
      s = "completed",
      y = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var p = {};
    define(p, a, function () {
      return this;
    });
    var d = Object.getPrototypeOf,
      v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t) {
      ["next", "throw", "return"].forEach(function (e) {
        define(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function AsyncIterator(t, e) {
      function invoke(r, o, i, a) {
        var c = tryCatch(t[r], t, o);
        if ("throw" !== c.type) {
          var u = c.arg,
            h = u.value;
          return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
            invoke("next", t, i, a);
          }, function (t) {
            invoke("throw", t, i, a);
          }) : e.resolve(h).then(function (t) {
            u.value = t, i(u);
          }, function (t) {
            return invoke("throw", t, i, a);
          });
        }
        a(c.arg);
      }
      var r;
      o(this, "_invoke", {
        value: function (t, n) {
          function callInvokeWithMethodAndArg() {
            return new e(function (e, r) {
              invoke(t, n, e, r);
            });
          }
          return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(e, r, n) {
      var o = h;
      return function (i, a) {
        if (o === f) throw Error("Generator is already running");
        if (o === s) {
          if ("throw" === i) throw a;
          return {
            value: t,
            done: !0
          };
        }
        for (n.method = i, n.arg = a;;) {
          var c = n.delegate;
          if (c) {
            var u = maybeInvokeDelegate(c, n);
            if (u) {
              if (u === y) continue;
              return u;
            }
          }
          if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
            if (o === h) throw o = s, n.arg;
            n.dispatchException(n.arg);
          } else "return" === n.method && n.abrupt("return", n.arg);
          o = f;
          var p = tryCatch(e, r, n);
          if ("normal" === p.type) {
            if (o = n.done ? s : l, p.arg === y) continue;
            return {
              value: p.arg,
              done: n.done
            };
          }
          "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
        }
      };
    }
    function maybeInvokeDelegate(e, r) {
      var n = r.method,
        o = e.iterator[n];
      if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
      var i = tryCatch(o, e.iterator, r.arg);
      if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
      var a = i.arg;
      return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
    }
    function pushTryEntry(t) {
      var e = {
        tryLoc: t[0]
      };
      1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
    }
    function resetTryEntry(t) {
      var e = t.completion || {};
      e.type = "normal", delete e.arg, t.completion = e;
    }
    function Context(t) {
      this.tryEntries = [{
        tryLoc: "root"
      }], t.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(e) {
      if (e || "" === e) {
        var r = e[a];
        if (r) return r.call(e);
        if ("function" == typeof e.next) return e;
        if (!isNaN(e.length)) {
          var o = -1,
            i = function next() {
              for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
              return next.value = t, next.done = !0, next;
            };
          return i.next = i;
        }
      }
      throw new TypeError(typeof e + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), o(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
      var e = "function" == typeof t && t.constructor;
      return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
    }, e.mark = function (t) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
    }, e.awrap = function (t) {
      return {
        __await: t
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
      return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new AsyncIterator(wrap(t, r, n, o), i);
      return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
        return t.done ? t.value : a.next();
      });
    }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
      return this;
    }), define(g, "toString", function () {
      return "[object Generator]";
    }), e.keys = function (t) {
      var e = Object(t),
        r = [];
      for (var n in e) r.push(n);
      return r.reverse(), function next() {
        for (; r.length;) {
          var t = r.pop();
          if (t in e) return next.value = t, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, e.values = values, Context.prototype = {
      constructor: Context,
      reset: function (e) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
      },
      stop: function () {
        this.done = !0;
        var t = this.tryEntries[0].completion;
        if ("throw" === t.type) throw t.arg;
        return this.rval;
      },
      dispatchException: function (e) {
        if (this.done) throw e;
        var r = this;
        function handle(n, o) {
          return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
        }
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var i = this.tryEntries[o],
            a = i.completion;
          if ("root" === i.tryLoc) return handle("end");
          if (i.tryLoc <= this.prev) {
            var c = n.call(i, "catchLoc"),
              u = n.call(i, "finallyLoc");
            if (c && u) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            } else if (c) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            } else {
              if (!u) throw Error("try statement without catch or finally");
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            }
          }
        }
      },
      abrupt: function (t, e) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var o = this.tryEntries[r];
          if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
            var i = o;
            break;
          }
        }
        i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
        var a = i ? i.completion : {};
        return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
      },
      complete: function (t, e) {
        if ("throw" === t.type) throw t.arg;
        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
      },
      finish: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
        }
      },
      catch: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.tryLoc === t) {
            var n = r.completion;
            if ("throw" === n.type) {
              var o = n.arg;
              resetTryEntry(r);
            }
            return o;
          }
        }
        throw Error("illegal catch attempt");
      },
      delegateYield: function (e, r, n) {
        return this.delegate = {
          iterator: values(e),
          resultName: r,
          nextLoc: n
        }, "next" === this.method && (this.arg = t), y;
      }
    }, e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }

  var ConnectSDK = /*#__PURE__*/function () {
    function ConnectSDK(config) {
      _classCallCheck(this, ConnectSDK);
      console.log(config);
      this.config = _objectSpread2({
        authServiceUrl: config.environment === 'production' ? 'https://authservice.withbenji.com' : 'https://authservice-staging.withbenji.com',
        authUrl: config.environment === 'production' ? 'https://verifyapp.withbenji.com' : 'https://verifyapp-staging.withbenji.com'
      }, config);
      this.iframe = null;
      this.iframeContainer = null;
      if (!this.config.bearerToken) {
        throw new Error('Bearer token is required in the configuration');
      }
      if (typeof this.config.onSuccess !== 'function') {
        throw new Error('onSuccess callback is required in the configuration');
      }
      if (typeof this.config.onExit !== 'function') {
        throw new Error('onExit callback is required in the configuration');
      }
      if (typeof this.config.onEvent !== 'function') {
        throw new Error('onEvent callback is required in the configuration');
      }
      // Bind methods to ensure correct 'this' context
      this.handleMessage = this.handleMessage.bind(this);
    }
    return _createClass(ConnectSDK, [{
      key: "getAuthToken",
      value: function () {
        var _getAuthToken = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(params) {
          var requestData, response, data;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                requestData = _objectSpread2(_objectSpread2(_objectSpread2({}, params.userExternalId ? {
                  user_external_id: params.userExternalId
                } : {}), {}, {
                  mode: params.mode || 1
                }, !params.mode || params.mode != 2 ? {
                  partner_id: params.partnerId,
                  merchant_id: params.merchantId
                } : {}), {}, {
                  display_name: params.displayName
                }, params.partnershipId ? {
                  partnership_id: params.partnershipId
                } : {});
                _context.prev = 1;
                _context.next = 4;
                return fetch("".concat(this.config.authServiceUrl, "/verify/token/create"), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer ".concat(this.config.bearerToken)
                  },
                  body: JSON.stringify(requestData)
                });
              case 4:
                response = _context.sent;
                _context.next = 7;
                return response.json();
              case 7:
                data = _context.sent;
                return _context.abrupt("return", data.data.token);
              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](1);
                console.error('Error in getAuthToken:', _context.t0);
                throw _context.t0;
              case 15:
              case "end":
                return _context.stop();
            }
          }, _callee, this, [[1, 11]]);
        }));
        function getAuthToken(_x) {
          return _getAuthToken.apply(this, arguments);
        }
        return getAuthToken;
      }()
    }, {
      key: "initialize",
      value: function () {
        var _initialize = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(params) {
          var token;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                console.log('params', params);
                if (!params.connect_token) {
                  _context2.next = 6;
                  break;
                }
                this.config.token = params.connect_token;
                _context2.next = 10;
                break;
              case 6:
                _context2.next = 8;
                return this.getAuthToken(params);
              case 8:
                token = _context2.sent;
                this.config.token = token;
              case 10:
                _context2.next = 16;
                break;
              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](0);
                console.error('Failed to initialize SDK:', _context2.t0);
                throw _context2.t0;
              case 16:
              case "end":
                return _context2.stop();
            }
          }, _callee2, this, [[0, 12]]);
        }));
        function initialize(_x2) {
          return _initialize.apply(this, arguments);
        }
        return initialize;
      }()
    }, {
      key: "openWithParams",
      value: function () {
        var _openWithParams = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(params) {
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.initialize(params);
              case 3:
                this.open();
                _context3.next = 10;
                break;
              case 6:
                _context3.prev = 6;
                _context3.t0 = _context3["catch"](0);
                console.error('Failed in openWithParams:', _context3.t0);
                throw _context3.t0;
              case 10:
              case "end":
                return _context3.stop();
            }
          }, _callee3, this, [[0, 6]]);
        }));
        function openWithParams(_x3) {
          return _openWithParams.apply(this, arguments);
        }
        return openWithParams;
      }()
    }, {
      key: "open",
      value: function open() {
        var _this = this;
        if (this.iframe) {
          console.warn('Authentication iframe is already open');
          return;
        }
        // Create container for iframe
        this.iframeContainer = document.createElement('div');
        this.iframeContainer.style.position = 'fixed';
        this.iframeContainer.style.top = '0';
        this.iframeContainer.style.left = '0';
        this.iframeContainer.style.width = '100%';
        this.iframeContainer.style.height = '100%';
        this.iframeContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.iframeContainer.style.zIndex = '9999';
        this.iframeContainer.style.display = 'flex';
        this.iframeContainer.style.alignItems = 'center';
        this.iframeContainer.style.justifyContent = 'center';
        this.iframeContainer.style.overflow = 'auto';

        // Create iframe
        var timestamp = new Date().getTime();
        var url = new URL(this.config.authUrl);
        url.searchParams.set('code', this.config.token);
        url.searchParams.set('t', timestamp);
        this.iframe = document.createElement('iframe');
        this.iframe.src = url.toString();
        this.iframe.style.position = 'relative';
        this.iframe.style.width = '400px';
        this.iframe.style.height = '645px';
        this.iframe.style.border = 'none';
        this.iframe.style.borderRadius = '20px';
        this.iframe.style.overflow = 'hidden';
        this.iframeContainer.appendChild(this.iframe);
        document.body.appendChild(this.iframeContainer);
        window.addEventListener('message', this.handleMessage);
        this.iframeContainer.addEventListener('click', function (event) {
          if (event.target === _this.iframeContainer) {
            _this.close();
          }
        });
      }
    }, {
      key: "close",
      value: function close() {
        if (this.iframe) {
          window.removeEventListener('message', this.handleMessage);
          document.body.removeChild(this.iframeContainer);
          this.iframe = null;
          this.iframeContainer = null;
          this.config.onExit();
        }
      }
    }, {
      key: "cleanup",
      value: function cleanup() {
        if (this.iframe) {
          this.close();
        }
      }
    }, {
      key: "handleMessage",
      value: function handleMessage(event) {
        if (event.origin !== new URL(this.config.authUrl).origin) return;
        var _event$data = event.data,
          type = _event$data.type,
          data = _event$data.data;
        switch (type) {
          case 'authSuccess':
            this.config.onSuccess(data.token, data.metadata);
            this.close();
            break;
          case 'authExit':
            this.close();
            break;
          default:
            this.config.onEvent({
              type: type,
              data: data
            });
        }
      }
    }]);
  }(); // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    window.ConnectSDK = ConnectSDK;
  }

  return ConnectSDK;

}));
