/**
 * 淘粉吧常用方法模块
 * @namespace
 * @classdesc 淘粉吧工具类
 * @version v1.0.0
 * @author Liu Bing
 */
var tf8Utils = (function () {
  // 正则表达式
  var _rTrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  /**
   * 加密支付宝账号
   * @type {function}
   * @memberof tf8Utils
   * @example
   * tf8Utils.encryptAliaccount('18501734573') // returns '185**573'
   * tf8Utils.encryptAliaccount('abc@126.com') // returns 'a**c@126.com'
   * tf8Utils.encryptAliaccount('abcd@126.com') // returns 'a**c@126.com'
   * tf8Utils.encryptAliaccount('abcde@126.com') // returns 'ab**de@126.com'
   * @param {string} account - 支付宝账号
   * @return {string} 加密后的支付宝账号,中间信息以*代替
   */
  function encryptAliaccount(account) {
    var result, mailPrefix, mailSuffix;
    var rPhone = /^\s*(\d{3})(\d{5})(\d{3})\s*$/;
    var rMail = /^\s*(\w+)(@\w+.\w+)\s*$/;

    if (isEmpty(account)) return account;

    if (result = account.match(rPhone)) {
      account = result[1] + "**" + result[3];
    } else if (result = account.match(rMail)) {
      mailPrefix = result[1];
      mailSuffix = result[2];

      if (mailPrefix.length <= 4) {
        account = mailPrefix.charAt(0) + "**" + mailPrefix.charAt(mailPrefix.length - 1) + mailSuffix;
      } else {
        account = mailPrefix.substring(0, 2) + "**" + mailPrefix.substring(mailPrefix.length - 2) + mailSuffix;
      }
    }
    return account;
  };
  /**
   * 获取url指定参数的值
   * @type {function}
   * @memberof tf8Utils
   * @example
   * // 当前页面地址为'http://www.test1.com?userId=123&p=1'
   * tf8Utils.getUrlParam('userId') // returns '123'
   * tf8Utils.getUrlParam('userId', 'http://www.test2.com?userId=456&p=1') // returns '456'
   * @param {string} key - url指定参数名称
   * @param {string} [url = window.location.href] - 指定链接，可选参数，默认为当前页面地址
   * @return {string} url对应参数的值
   */
  function getUrlParam(key, url) {
    if (key == undefined) return '';

    var rParam = new RegExp("(\\?|&)" + key + "=([^&]*)(&|$)", "i");
    var result = (url || window.location.search).match(rParam);

    if (result) return decodeURIComponent(result[2]);

    return '';
  }
  /**
   * 设置url参数
   * @type {function}
   * @memberof tf8Utils
   * @example
   * // 当前页面地址为'http://www.test1.com?userId=123'
   * tf8Utils.setUrlParam('p', '1') // returns 'http://www.test1.com?userId=123&p=1'
   * tf8Utils.setUrlParam('p', '1', 'http://www.test2.com') // returns 'http://www.test2.com?p=1'
   * @param {string} key - 参数名称
   * @param {string | number} val - 参数值
   * @param {string} [url = window.location.href] - 指定链接，可选参数，默认为当前页面地址
   * @return {string} 设置参数后的url
   */
  function setUrlParam(key, val, url) {
    var symbol, rParam, result;
    url = url || window.location.href;

    if (isEmpty(key)) return url;

    rParam = new RegExp("((?:\\?|&)" + key + "=)(?:[^&]*)(&|$)", "i");
    result = url.match(rParam);

    if (result) {
      url = url.replace(result[0], result[1] + val + result[2]);
    } else {
      url.indexOf('?') > -1 ? symbol = '&' : symbol = '?';
      url = [url, symbol, key, '=', encodeURIComponent(val)].join('');
    }

    return url;
  }
  /**
   * 判断指定字符串是否为空
   * @type {function}
   * @memberof tf8Utils
   * @example
   * tf8Utils.isEmpty(' ') // returns true
   * tf8Utils.isEmpty(null) // returns true
   * tf8Utils.isEmpty(undefined) // returns true
   * tf8Utils.isEmpty(123) // returns false
   * @param {string} str - 字符串
   * @return {boolean} null和undefined也将返回true
   */
  function isEmpty(str) {
    if (trim(str) === "") return true;
    return false;
  }
  /**
   * 判断指定字符串是否为手机号码
   * @type {function}
   * @memberof tf8Utils
   * @example
   * tf8Utils.isMobile('15212345678') // returns true
   * tf8Utils.isMobile('1521234567') // returns false
   * tf8Utils.isMobile('25212345678') // returns false
   * @param {string} str - 字符串
   * @return {boolean} 以1开头的11位数字为合法的手机号
   */
  function isMobile(str) {
    return /^1\d{10}$/.test(str);
  }
  /**
   * 判断指定字符串是否为邮箱
   * @type {function}
   * @memberof tf8Utils
   * @example
   * tf8Utils.isMail('abc@126.com') // returns true
   * tf8Utils.isMail('abc@126.com123') // returns false
   * tf8Utils.isMail('#abc@126.com') // returns false
   * @param {string} str - 字符串
   * @return {boolean} 以字母|数字|_|.|-开头，加上@，然后至少包含一个"."和两个单词，顶级域长度为2-4个字符
   */
  function isMail(str) {
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/.test(str);
  }
  /**
   * 创建并返回一个像节流阀一样的函数,当重复调用函数的时候,最多每隔wait毫秒调用一次该函数
   * @type {function}
   * @memberof tf8Utils
   * @example
   * // 限制滚动事件的触发频率
   * $(window).on('scroll', tf8Utils.throttle(funcA, 100));
   * @param {function} func - 待限制的函数
   * @param {number} wait - 时间,单位为ms
   * @param {object} [options] - 可选参数
   * @param {boolean} [options.leading] - false:禁用首次执行
   * @param {boolean} [options.trailing] - false:禁用最后一次执行
   * @return {function} 返回一个节流后的函数,在给定的时间内只会执行一次
   */
  function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout)
        context = args = null;
    };
    return function () {
      var now = Date.now();
      if (!previous && options.leading === false)
        previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout)
          context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }
  /**
   * 去除字符串首尾空格
   * @type {function}
   * @memberof tf8Utils
   * @example
   * tf8Utils.trim(' ab ') // returns 'ab'
   * tf8Utils.trim(null) // returns ''
   * tf8Utils.trim(undefined) // returns ''
   * tf8Utils.trim() // returns ''
   * @param {string} str - 待处理的字符串
   * @return {string} 去除首尾空格后的字符串,null和undefined会被转成空字符串
   */
  function trim(str) {
    return str == null ? "" : (str + "").replace(_rTrim, "");
  }

  /**
   * toast弹窗
   * @type {function}
   * @memberof tf8Utils
   * @example
   * tf8Utils.toast('提示文案')
   * @param {string} msg - 提示文案
   */
  function toast() {
    var _$toast = null;
    var _isToasting = false;

    return function (msg) {
      if (!_$toast) {
        _$toast = $('<div class="fs14" id="J_toast" style="display:none;z-index:9999;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);width:6.8125rem;line-height:1.6;padding:.3125rem;text-align:center;color:#fff;background-color:#000;border-radius:.15625rem;background-clip:padding-box;opacity:.8;word-break:break-all;box-sizing:border-box;"></div>').appendTo($('body'));
      }
      if (_isToasting) return false;
      _isToasting = true;
      _$toast.html(msg).fadeIn(500, function () {
        setTimeout(function () {
          _$toast.fadeOut(1000);
          _isToasting = false;
        }, 1000);
      });
    };
  }
  /**
   * 格式化日期
   * @type {function}
   * @memberof tf8Utils
   * @example
   * tf8Utils.formatDate(1514532743880, 'yyyy/MM/dd hh:mm:ss') // returns '2017/12/29 15:32:23'
   * tf8Utils.formatDate('2017/12/29', 'yyyy/MM/dd hh:mm:ss') // returns '2017/12/29 00:00:00'
   * @param {string | number} timestamp - 待格式化的日期字符串或者时间戳
   * @param {string} formatStr - 日期格式字符串
   * @return {string} 格式化后的日期字符串
   */
  function formatDate(timestamp, formatStr) {
    var date;
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp.replace(/\-/g, '/'));
    } else {
      return timestamp;
    }
    var map = {
      // 月
      'M': date.getMonth() + 1,
      // 日
      'd': date.getDate(),
      // 小时
      'h': date.getHours(),
      // 分
      'm': date.getMinutes(),
      // 秒
      's': date.getSeconds()
    };
    var dateStr = formatStr.replace(/([yMdhms])+/g, function (match, p) {
      var v = map[p];
      if (v !== undefined) {
        if (match.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (p === 'y') {
        return (date.getFullYear() + '').substr(4 - match.length);
      }
      return match;
    });
    return dateStr;
  }

  return {
    encryptAliaccount: encryptAliaccount,
    getUrlParam: getUrlParam,
    setUrlParam: setUrlParam,
    isEmpty: isEmpty,
    isMobile: isMobile,
    isMail: isMail,
    throttle: throttle,
    trim: trim,
    toast: toast(),
    formatDate: formatDate
  };
})();
