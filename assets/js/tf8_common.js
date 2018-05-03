/**
 * 淘粉吧公用方法模块
 * @namespace
 * @classdesc 淘粉吧公用模块，依赖于{@link tf8Env},{@link tf8Utils}
 * @version v1.0.0
 * @author Liu Bing
 */
var tf8Common = (function () {
  // 用户ID
  var _userId = tf8Utils.getUrlParam('userId') || $('#userId').val();
  // 页面来源
  var _mobilePage = $('#mobilePage').val();
  // 链接参数
  var _isApp = tf8Utils.getUrlParam('isApp');
  // 9.74及以上版本唤起手淘开关（全局）
  var _awakeTb = $('#awakeTb').val() === 'true';
  // 9.74以下版本唤起手淘开关（仅优惠券）
  var _lowVersionAwakeTb = $('#lowVersionAwakeTb').val() === 'true';

  /**
   * 唤起淘粉吧客户端
   * @type {function}
   * @memberof tf8Common
   * @example
   * tf8Common.awakeApp('taofen8-master://id=url&p=1,2,3')
   * @param {string} awakeUrl - 唤起链接
   */
  function awakeApp(awakeUrl) {
  	//获取 schema 头信息
  	var schema = getSchema();
  	if(schema != 'taofen8'){
  		awakeUrl = awakeUrl.replace('taofen8-master', schema + '-master');
  	}
    // 安卓手机谷歌浏览器使用intent协议进行唤起
    if (tf8Env.os.isAndroid && tf8Env.browser.isChrome && !tf8Env.browser.isWebview) {
      window.location.replace('intent:' + awakeUrl.replace(/^(.*):/, "") + '#Intent;scheme='+ schema +'-master;package=com.leixun.taofen8;end');
    } else if (tf8Env.browser.isSafari && tf8Env.browser.version >= 9 || tf8Env.browser.isChrome) {
      // safari浏览器9.0以上版本以及chrome内核浏览器直接跳转进行唤起
      window.location.href = awakeUrl;
    } else {
      // 其他浏览器使用iframe方法进行唤起
      var iframe = document.createElement('iframe');

      iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
      document.body.appendChild(iframe);
      iframe.src = awakeUrl;
    }
  }
  /**
   * 下载淘粉吧客户端
   * @type {function}
   * @memberof tf8Common
   * @example
   * tf8Common.downloadApp();
   * tf8Common.downloadApp('http://www.taofen8.com/d/m/taofen8_quanmama_signed.apk');
   * @param {string} [androidUrl] - 安卓特殊渠道下载链接
   */
  function downloadApp(androidUrl) {
    var jumpUrl = '';

    if (tf8Env.thirdApp.isWeixin) {
      jumpUrl = "//a.app.qq.com/o/simple.jsp?pkgname=com.leixun.taofen8";
    } else {
      if (tf8Env.os.isAndroid) {
        jumpUrl = androidUrl || "//m.taofen8.com/download.jsp";
      } else if (tf8Env.os.isIOS) {
        jumpUrl = "//itunes.apple.com/us/app/tao-fen-ba/id527012586?ls=1&mt=8";
      } else {
        jumpUrl = "//a.app.qq.com/o/simple.jsp?pkgname=com.leixun.taofen8";
      }
    }
    window.location.href = jumpUrl;
  }
  /**
   * 查看返利商品
   * @type {function}
   * @memberof tf8Common
   * @example
     tf8Common.viewRebateItem('546946139141', '23.12%');
   * @param {string} itemId - 商品ID
   * @param {string} fanliRate - 返利比例
   * @param {string} awakeTb - 页面input参数，9.74及以上版本唤起手淘开关（全局）
   * @param {string} mobilePage - 页面input参数，页面来源
   * @param {string} isApp - 链接上的参数，是否为APP
   */
  function viewRebateItem(itemId, fanliRate) {
    var url = encodeURIComponent(window.location.protocol + '//m.taofen8.com/item/' + itemId + '?sid=null&cancelAlert=1&ttid=400000_12450255@taofen8_wap&f=' + _mobilePage + '&p=' + tf8Env.tf8App.productVersion);

    if (tf8Env.tf8App.isTf8App && (!tf8Env.os.isIPad || tf8Env.tf8App.version >= 7.5)) {
      if (tf8Env.tf8App.version >= 9.74 && _awakeTb) {
        window.location.href = 'taofen8-master://bci/?id=' + url + '&p=' + encodeURIComponent(fanliRate || '');
      } else {
        window.location.href = 'taofen8-master://bl?id=' + url + '&p=' + itemId + ',,yes,' + url + ',';
      }
    } else {
      window.location.href = "//m.taofen8.com/d.jsp?i=" + itemId + "&r=iDetail&t=" + _mobilePage + "&isApp=" + _isApp + "&userId=" + _userId + "&p=" + tf8Env.tf8App.productVersion;
    }
  }
  /**
   * 查看优惠券商品
   * @type {function}
   * @memberof tf8Common
   * @example
     tf8Common.viewCouponItem('558196975630','d4787f36b62a4301aa943b3ab083931b','129.0','100','29.0','false','baicai','baicai_wx','0.5','mm_112595285_15712398_77836521');
   * @param {string} itemId - 商品ID
   * @param {string} couponId - 券ID
   * @param {string|number} originalPrice - 原价
   * @param {string|number} couponValue - 券ID
   * @param {string|number} handPrice - 到手价
   * @param {string} isTmall - 是否天猫，'true'|'false'
   * @param {string} clickChannel - 渠道来源
   * @param {string} wx_channel - 微信上的渠道来源
   * @param {string|number} rewardValue - 分享奖励金额
   * @param {string} pid - 推广位ID
   * @param {string} awakeTb - 页面input参数，9.74及以上版本唤起手淘开关（全局）
   * @param {string} lowVersionAwakeTb - 页面input参数，9.74以下版本唤起手淘开关（仅优惠券）
   */
  function viewCouponItem(itemId, couponId, originalPrice, couponValue, handPrice, isTmall, clickChannel, wx_channel, rewardValue, pid) {
    var mall, title, reportFlag;
    var url = window.location.protocol + '//m.taofen8.com/couponItem/' + itemId + '/' + couponId + "?clickChannel=" + clickChannel + "&pid=" + pid;

    // 淘粉吧客户端内
    if (tf8Env.tf8App.isTf8App) {
      if (tf8Env.tf8App.version >= 9.74 && _awakeTb) {
        window.location.href = 'taofen8-master://bcc/?id=' + encodeURIComponent(url) + '&p=' + handPrice;
      } else if (_lowVersionAwakeTb && tf8Env.tf8App.version < 9.74) {
        window.location.href = 'tbopen://m.taobao.com/tbopen/index.html?action=ali.open.nav&module=h5&h5Url=' + encodeURIComponent(url);
      } else {
        mall = isTmall === 'true' ? 1 : 0;
        title = '优惠券买商品';
        reportFlag = 'no';

        window.location.href = 'taofen8-master://scd/?id=' + itemId + '&p=' + encodeURIComponent(url) + ',' + originalPrice + ',' + couponValue + ',' + handPrice + ',' + mall + ',' + title + ',' + reportFlag + ',' + rewardValue;
      }
    } else if (tf8Env.thirdApp.isWeixin) {
      //微信中
      window.location.href = "//m.taofen8.com/taocode/couponDetail?itemId=" + itemId + "&couponId=" + couponId + "&channel=" + wx_channel;
    } else {
      window.location.href = url;
    }
  }

  /**
   * 淘粉吧移动端登陆
   * @type {function}
   * @memberof tf8Common
   * @example
   * tf8Common.loginByWap("http://act.taofen8.com/index.html");
   * @param {string} [callbackUrl] - 登陆回调地址
   */
  function loginByWap(callbackUrl) {
    if (tf8Env.tf8App.isTf8App) {
      // 唤起客户端原生登陆
      window.location.href = 'native-check://login/?callback=' + encodeURIComponent(callbackUrl);
    } else {
      // wap登陆
      window.location.href = '//m.taofen8.com/s/login?callback=' + encodeURIComponent(callbackUrl);
    }
  }
  /**
   * 获取schema头部，用于区分马甲包唤起
   * @example tf8Common.getSchema()
   * @return 返回头部信息，如果没有取到，默认为`taofen8`
   */
	function getSchema() {
		var temp = tf8Utils.getUrlParam('product');
		return !!temp ? temp : 'taofen8';
	}
  /**
   * 淘粉吧ajax方法,用法完全与$.ajax()方法一致
   * 对$.ajax()方法进行了一次业务封装:
   * 1.防止同次请求重复提交
   * 2.交互上面增加了一个菊花组件
   * 3.成功回调函数接口异常处理封装
   * 4.失败回调函数封装
   * 5.全局设置ajax请求默认参数, dataType:"json",timeout:30000
   * @type {function}
   * @memberof tf8Common
   * @example
   * tf8Common.ajax("/getDate");
   * tf8Common.ajax("/getDate", {success: function(){console.log(成功回调函数);}});
   * tf8Common.ajax({url: "/getDate", success: function(){console.log(成功回调函数);});
   * @param {string} url  一个用来包含发送请求的URL字符串
   * @param {string} [settings] AJAX请求设置。所有选项都是可选的
   */
  function ajax() {
    // ajax请求状态缓存对象
    var requestMap = {};
    var _$loading = null;
    // 全局设置ajax默认参数
    $.ajaxSetup({
      dataType: "json",
      timeout: 30000
    });
    return function (url, settings) {
      var _opts = null;
      var _url = url;

      if (typeof url === "object") {
        settings = url;
        _url = settings.url;
      } else {
        settings = settings || {};
      }
      // 添加菊花组件
      if (!_$loading) {
        $("head").append("<style>@keyframes rotation{from{-webkit-transform: rotate(0deg);} to{-webkit-transform: rotate(360deg);}}@-webkit-keyframes rotation{from{-webkit-transform: rotate(0deg);} to{-webkit-transform: rotate(360deg);}}</style>");
        _$loading = $('<div id="J_loading" style="z-index:9999;display:none;position:fixed;top:0;right:0;bottom:0;left:0;">\
        <img style="position:absolute;top:40%;left:4.375rem;width:1.25rem;height:1.25rem;animation:rotation 1s linear infinite;-webkit-animation:rotation 1s linear infinite" src="https://y.taofen8.com/imgextra/i4/2296013456/TB2SHzabbH9F1JjSZFBXXc9ZFXa_!!2296013456.png">\
        </div>').appendTo($('body'));
      }
      // 拷贝选项参数
      _opts = $.extend({}, settings);
      // 成功函数封装
      settings.success = function (data) {
        if (data.success) {
          // 成功回调函数钩子
          _opts.success && _opts.success(data);
        } else {
          tf8Utils.toast("接口异常-->" + data.errorCode + " " + data.errorMsg);
        }
      };
      // 失败函数封装
      settings.error = function (XMLHttpRequest, textStatus, errorThrown) {
        tf8Utils.toast("服务器请求失败-->" + textStatus);
        // 失败回调函数钩子
        _opts.error && _opts.error(XMLHttpRequest, textStatus, errorThrown);
      };
      // 发送请求前函数封装
      settings.beforeSend = function (XMLHttpRequest) {
        // 防止重复请求
        if (requestMap[_url]) return false;
        requestMap[_url] = true;
        // 转菊花
        _$loading.show();
        // 请求前函数钩子
        _opts.beforeSend && _opts.beforeSend(XMLHttpRequest);
      };
      // 请求完成后回调函数封装
      settings.complete = function (XMLHttpRequest, textStatus) {
        // 更新该请求状态为完成
        requestMap[_url] = false;
        // 隐藏菊花
        _$loading.hide();
        // 请求完成后回调函数钩子
        _opts.complete && _opts.complete(XMLHttpRequest, textStatus);
      };
      // 继续执行$.ajax请求
      $.ajax(url, settings);
    };
  }

  return {
    awakeApp: awakeApp,
    downloadApp: downloadApp,
    loginByWap: loginByWap,
    viewRebateItem: viewRebateItem,
    viewCouponItem: viewCouponItem,
    getSchema: getSchema,
    ajax: ajax()
  };
})();