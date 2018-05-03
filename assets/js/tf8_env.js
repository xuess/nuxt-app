/**
 * 检测终端系统类型, 浏览器类型, 淘粉吧APP, 第三方APP
 * @namespace
 * @classdesc 淘粉吧环境检测模块
 * @version v1.0.0
 * @author Liu Bing
 * @example
 * tf8Env = {
    browser: {
      isSafari: true,
      name: "Safari",
      version: "9.0"
    },
    os: {
      isIOS: true,
      isIPad: false,
      isIPhone: true,
      name: "iPhone",
      version: "9.1"
    },
    tf8App: {
      isTf8App: true,
      productVersion: "IPhone_v9.74",
      version: 9.74
    },
    thirdApp: {
      isWeixin: false,
      isWeibo: false
    }
 }
 */
var tf8Env = (function () {
  var _ua = window.navigator.userAgent;
  /**
   * 检测终端系统类型
   * @type {object}
   * @memberof tf8Env
   * @property {boolean}  isWindowsPhone - 是否为微软WP系统
   * @property {boolean}  isAndroid - 是否为安卓系统
   * @property {boolean}  isIOS - 是否为苹果系统
   * @property {boolean}  isIPhone - 是否为苹果手机
   * @property {boolean}  isIPad - 是否为ipad
   * @property {string}   name - 系统名称
   * @property {string}   version - 系统版本号
   */
  var os = _detectOs();
  /**
   * 检测浏览器类型
   * @type {object}
   * @memberof tf8Env
   * @property {boolean}  isUC - 是否为UC
   * @property {boolean}  isQQ - 是否为QQ
   * @property {boolean}  isFirefox - 是否为Firefox
   * @property {boolean}  isIEMobile - 
   * @property {boolean}  isIE - 
   * @property {boolean}  isIELikeWebkit - 
   * @property {boolean}  isChrome - 是否为谷歌
   * @property {boolean}  isWebview - 是否为webview
   * @property {boolean}  isAndroid - 是否为安卓浏览器
   * @property {boolean}  isSafari - 是否为Safari浏览器
   * @property {string}   name - 浏览器名称
   * @property {string}   version - 浏览器版本号
   */
  var browser = _detectBrowser();
  /**
   * 检测淘粉吧APP
   * @type {object}
   * @memberof tf8Env
   * @property {boolean}  isTf8App - 是否为淘粉吧客户端
   * @property {string}  productVersion - 客户端版本字符串,例:IPhone_v9.74 | Android_v9.74
   * @property {number}  version - 客户端版本号,例:9.74
   */
  var tf8App = _detectTf8App();
  /**
   * 检测第三方APP
   * @type {object}
   * @memberof tf8Env
   * @property {boolean}  isWeixin - 是否为微信客户端
   * @property {boolean}  isWeibo - 是否为微博客户端
   */
  var thirdApp = _detectThirdApp();

  // 检测系统类型
  function _detectOs() {
    var os = {};
    var result = [];

    if (result = _ua.match(/Windows\sPhone\s(?:OS\s)?([\d\.]+)/i)) {
      os = {
        name: "Windows Phone",
        isWindowsPhone: true,
        version: result[1]
      };
    } else if (result = _ua.match(/Android[\s\/]([\d\.]+)/i)) {
      os = {
        name: "Android",
        isAndroid: true,
        version: result[1]
      };
    } else if (result = _ua.match(/(iPhone|iPad|iPod)/i)) {
      var name = result[1];
      if (result = _ua.match(/OS ([\d_\.]+) like Mac OS X/i)) {
        os = {
          name: name,
          isIPhone: "iPhone" === name || "iPod" === name,
          isIPad: "iPad" === name,
          isIOS: true,
          version: result[1].split("_").join(".")
        }
      }
    } else {
      os = {
        name: "unknown",
        version: '0'
      };
    }

    return os;
  };

  // 检测浏览器类型
  function _detectBrowser() {
    var browser = {};
    var result = [];

    if (result = _ua.match(/(?:UCWEB|UCBrowser\/)([\d\.]+)/)) {
      browser = {
        name: "UC",
        isUC: true,
        version: result[1]
      };
    } else if (result = _ua.match(/MQQBrowser\/([\d\.]+)/)) {
      browser = {
        name: "QQ",
        isQQ: true,
        version: result[1]
      };
    } else if (result = _ua.match(/(?:Firefox|FxiOS)\/([\d\.]+)/)) {
      browser = {
        name: "Firefox",
        isFirefox: true,
        version: result[1]
      };
    } else if ((result = _ua.match(/MSIE\s([\d\.]+)/)) || (result = _ua.match(/IEMobile\/([\d\.]+)/))) {
      browser = {
        version: result[1]
      };
      if (_ua.match(/IEMobile/)) {
        browser.name = "IEMobile";
        browser.isIEMobile = true;
      } else {
        browser.name = "IE";
        browser.isIE = true;
      }
      if (_ua.match(/Android|iPhone/)) {
        browser.isIELikeWebkit = true;
      }
    } else if (result = _ua.match(/(?:Chrome|CriOS)\/([\d\.]+)/)) {
      browser = {
        name: "Chrome",
        isChrome: true,
        version: result[1]
      };
      if (_ua.match(/Version\/[\d+\.]+\s*Chrome/)) {
        browser.name = "Chrome Webview";
        browser.isWebview = true;
      }
    } else if (_ua.match(/Safari/) && (result = _ua.match(/Android[\s\/]([\d\.]+)/))) {
      browser = {
        name: "Android",
        isAndroid: true,
        version: result[1]
      };
    } else if (_ua.match(/iPhone|iPad|iPod/i)) {
      if (_ua.match(/Safari/) && (result = _ua.match(/Version\/([\d\.]+)/))) {
        browser = {
          name: "Safari",
          isSafari: true,
          version: result[1]
        };
      } else if (result = _ua.match(/OS ([\d_\.]+) like Mac OS X/)) {
        browser = {
          name: "iOS Webview",
          isWebview: true,
          version: result[1].split("_").join(".")
        };
      }
    } else {
      browser = {
        name: "unknown",
        version: '0'
      };
    }

    return browser;
  };

  // 检测淘粉吧APP
  function _detectTf8App() {
    var tf8App = {};
    var result;

    tf8App.isTf8App = !!_ua.match(/taofen8/i);

    if (tf8App.isTf8App) {
      result = window.location.href.match(/(?:\?|&)(?:productVersion|p)=([^&]*)/);
      tf8App.productVersion = result && decodeURIComponent(result[1]) || '';
      tf8App.version = +tf8App.productVersion.match(/\d+\.\d+/);
    }

    return tf8App;
  };

  // 检测第三方APP
  function _detectThirdApp() {
    var thirdApp = {};

    thirdApp.isWeixin = !!_ua.match(/MicroMessenger/i);
    thirdApp.isWeibo = !!_ua.match(/weibo/i);

    return thirdApp;
  };

  return {
    os: os,
    browser: browser,
    tf8App: tf8App,
    thirdApp: thirdApp
  };
})();
