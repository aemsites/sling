"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _client = require("@apollo/client");
var _crossFetch = _interopRequireDefault(require("cross-fetch"));
var _apollo3CachePersist = require("apollo3-cache-persist");
var _localforage = _interopRequireDefault(require("localforage"));
var _error = require("@apollo/client/link/error");
var _apiConfig = require("../api-config");
var _commerceSession = require("./cart/commerceSession");
var _processPackages = _interopRequireDefault(require("./cart/processPackages"));
var _constants = require("../constants");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var accountStatusChangeOperationNames = new Set(['placeOrder', 'pauseSubscription', 'cancelSubscription', 'resumeSubscription', 'initiatePartnerSubscription']);

// TODO move these to somewhere more configurable
/**
 * Operations with:
 *    Method: GET
 *    Authentication: NO
 */
var getMethodOperationNames = new Set(['classifications', 'GetPackage', 'packages', 'zipcodeAddressVerificationV2', 'packagesPerZipcode', 'regionalPackagesByZipCodeV2']);

/**
 * Operations with:
 *    Method: GET
 *    Authentication: YES
 */
var getMethodOperationNamesWithAuthentication = new Set(['accountDetails', 'accountDetailsAndeligibleForFullRefund']);
var requestTracingMiddleware = new _client.ApolloLink(function (operation, forward) {
  var arr = new Uint8Array(16);
  window.crypto.getRandomValues(arr);
  var xB3TraceId = Array.from(arr, function (_byte) {
    return ('0' + _byte.toString(16)).slice(-2);
  }).join('');
  operation.setContext(function (_ref) {
    var _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers;
    return {
      headers: _objectSpread(_objectSpread({}, headers), {}, {
        'Consumer': 'Web-Client',
        "X-B3-TraceId": xB3TraceId,
        "Sling-Id": localStorage.getItem('user_guid') || ''
      })
    };
  });
  return forward(operation);
});
var bearerTokenMiddleware = new _client.ApolloLink(function (operation, forward) {
  // Prevent needless accountDetails requests
  if (getMethodOperationNamesWithAuthentication.has(operation.operationName)) {
    // When commerce session doesn't exist.
    if (!(0, _commerceSession.getCommerceSession)()) {
      return {};
    }
  }

  // For certain operation names
  if (!getMethodOperationNames.has(operation.operationName)) {
    var arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);
    var xB3TraceId = Array.from(arr, function (_byte2) {
      return ('0' + _byte2.toString(16)).slice(-2);
    }).join('');
    operation.setContext(function (_ref2) {
      var _ref2$headers = _ref2.headers,
        headers = _ref2$headers === void 0 ? {} : _ref2$headers;
      return {
        headers: _objectSpread(_objectSpread({}, headers), {}, {
          authorization: "Bearer ".concat((0, _commerceSession.getCommerceSession)() || ''),
          'Consumer': 'Web-Client',
          "X-B3-TraceId": xB3TraceId,
          "Sling-Id": localStorage.getItem('user_guid') || ''
        })
      };
    });
  }
  return forward(operation).map(function (response) {
    if (getMethodOperationNamesWithAuthentication.has(operation.operationName)) {
      var _response$data, _response$data$accoun, _response$data$accoun2;
      localStorage.setItem('sling_user_guid', response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$accoun = _response$data.accountDetails) === null || _response$data$accoun === void 0 ? void 0 : (_response$data$accoun2 = _response$data$accoun.user_details) === null || _response$data$accoun2 === void 0 ? void 0 : _response$data$accoun2.guid);
    }
    return response;
  });
});
var methodMiddleware = new _client.ApolloLink(function (operation, forward) {
  if (accountStatusChangeOperationNames.has(operation.operationName)) {
    localStorage.removeItem('account_status');
  }

  // For certain operation names, set the request ot GET
  if (getMethodOperationNames.has(operation.operationName) || getMethodOperationNamesWithAuthentication.has(operation.operationName)) {
    operation.setContext(function (_ref3) {
      var _ref3$fetchOptions = _ref3.fetchOptions,
        fetchOptions = _ref3$fetchOptions === void 0 ? {} : _ref3$fetchOptions;
      return {
        fetchOptions: _objectSpread(_objectSpread({}, fetchOptions), {}, {
          method: 'GET'
        })
      };
    });
  }
  return forward(operation);
});
var httpLink = new _client.HttpLink({
  uri: _apiConfig.COMMERCE_URL,
  // Strip excess whitespace, primarily to make GET queries smaller
  print: function print(ast, originalPrint) {
    return originalPrint(ast).replaceAll(/\s+/g, ' ');
  },
  // By default, the Fetch API is used unless it isn't available in your runtime environment.
  // https://www.apollographql.com/docs/react/api/link/apollo-link-http/#customizing-fetch
  fetch: _crossFetch["default"]
});
var logoutLink = (0, _error.onError)(function () {
  var _window$slingUtils, _window$slingUtils$jw, _window$slingUtils$jw2, _window$slingUtils2, _window$slingUtils2$u, _window$slingUtils2$u2;
  if ((_window$slingUtils = window.slingUtils) !== null && _window$slingUtils !== void 0 && (_window$slingUtils$jw = _window$slingUtils.jwtService) !== null && _window$slingUtils$jw !== void 0 && (_window$slingUtils$jw2 = _window$slingUtils$jw.isJWTExpired) !== null && _window$slingUtils$jw2 !== void 0 && _window$slingUtils$jw2.call(_window$slingUtils$jw)) (_window$slingUtils2 = window.slingUtils) === null || _window$slingUtils2 === void 0 ? void 0 : (_window$slingUtils2$u = _window$slingUtils2.user) === null || _window$slingUtils2$u === void 0 ? void 0 : (_window$slingUtils2$u2 = _window$slingUtils2$u.logOut) === null || _window$slingUtils2$u2 === void 0 ? void 0 : _window$slingUtils2$u2.call(_window$slingUtils2$u);
});
var cache = new _client.InMemoryCache({
  typePolicies: {
    Cart: {
      fields: {
        infoObj: {
          read: function read(_, _ref4) {
            var _readField;
            var cartCache = _ref4.cache,
              readField = _ref4.readField;
            var extractCache = cartCache.extract();
            var selectedSkus = new Set();
            var selectedBasePackSkus = new Set();
            var deviceSkus = new Set();
            var itemList = (_readField = readField('items')) !== null && _readField !== void 0 ? _readField : [];
            itemList.forEach(function (item) {
              var _extractCache$item$__ = extractCache[item.__ref],
                itemPackageType = _extractCache$item$__.package_type,
                actionType = _extractCache$item$__.action_type,
                parentSku = _extractCache$item$__.parent_sku,
                _extractCache$item$__2 = _extractCache$item$__.product,
                _extractCache$item$__3 = _extractCache$item$__2 === void 0 ? {} : _extractCache$item$__2,
                sku = _extractCache$item$__3.sku;
              // Add as a selected product, this includes both packages and device
              if (actionType === 'R') {
                return;
              }
              if (sku) {
                if (!parentSku || parentSku === '') {
                  selectedSkus.add(sku);
                }
              }
              if (itemPackageType === 'device' || itemPackageType === 'partner_device') {
                deviceSkus.add(sku);
              }
              if (itemPackageType === 'base_linear') {
                if (!parentSku || parentSku === '') {
                  selectedBasePackSkus.add(sku);
                }
              }
            });
            return {
              selectedSkus: selectedSkus,
              selectedBasePackSkus: selectedBasePackSkus,
              deviceSkus: deviceSkus,
              isBaseSelected: selectedBasePackSkus.size > 0
            };
          }
        }
      }
    },
    Packages: {
      fields: {
        processedPackages: {
          read: function read(_, _ref5) {
            var _readField2;
            var readField = _ref5.readField;
            var rawPackages = (_readField2 = readField('package', readField('items'))) !== null && _readField2 !== void 0 ? _readField2 : [];
            if (rawPackages.length === 0) {
              return {};
            }
            var processedPackagesList = (0, _processPackages["default"])({
              rawPackages: rawPackages
            });
            return _objectSpread({}, processedPackagesList);
          }
        }
      }
    },
    CategoryResult: {
      fields: {
        classificationsMapping: {
          read: function read(_, _ref6) {
            var _readField3;
            var readField = _ref6.readField;
            var classificationsMapping = new Map();
            var _ref7 = (_readField3 = readField('items')) !== null && _readField3 !== void 0 ? _readField3 : [],
              _ref8 = (0, _slicedToArray2["default"])(_ref7, 1),
              classificationList = _ref8[0].children;
            classificationList.forEach(function (classification) {
              classificationsMapping.set(classification.name, classification);
            });
            return classificationsMapping;
          }
        }
      }
    }
  }
});
var link = methodMiddleware.concat(bearerTokenMiddleware).concat(requestTracingMiddleware).concat(logoutLink).concat(httpLink);
var fetchedAt = localStorage.getItem('slingAemACFetchedAt');
var timeSinceLastUpdated = Date.now() - fetchedAt;
var dataTooOld = _constants.CACHE_TTL < timeSinceLastUpdated;
if (dataTooOld) {
  localStorage.setItem('slingAemACFetchedAt', Date.now());
  _localforage["default"].removeItem('sling-aem-ac');
}
var client = new Promise( /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(res) {
    var persistor, apolloClient;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          persistor = new _apollo3CachePersist.CachePersistor({
            cache: cache,
            storage: new _apollo3CachePersist.LocalForageWrapper(_localforage["default"]),
            key: 'sling-aem-ac',
            persistenceMapper: function () {
              var _persistenceMapper = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      return _context.abrupt("return", data);
                    case 1:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }));
              function persistenceMapper(_x2) {
                return _persistenceMapper.apply(this, arguments);
              }
              return persistenceMapper;
            }()
          });
          _context2.next = 3;
          return persistor.restore();
        case 3:
          apolloClient = new _client.ApolloClient({
            cache: cache,
            link: link
          });
          res(apolloClient);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x) {
    return _ref9.apply(this, arguments);
  };
}());
var apolloClientConfig = {
  client: client
};
var _default = exports["default"] = apolloClientConfig;