/**
 * 统计页面点击事件, 统计页面pv和uv。<br>
 1.在页面隐藏域上存放公共参数;<br>
 2.在需要统计的元素上，添加class：`tf8-log`，以及4个自定义属性：`data-log-position`、`data-log-bussiness-type`、`data-log-content`、`data-log-bm-category`(可选,仅针对类目下的商品有效);<br>
 3.自定义统计页面点击事件。
 * @namespace
 * @classdesc 淘粉吧日志统计模块
 * @example
 * // 页面隐藏域公共参数
 * <input class="tf8-log-hidden" type="hidden" id="pageType" value="" />
 * <input class="tf8-log-hidden" type="hidden" id="pageName" value="" />
 * <input class="tf8-log-hidden" type="hidden" id="channel" value="" />
 * <input class="tf8-log-hidden" type="hidden" id="code" value="" />
 * <input class="tf8-log-hidden" type="hidden" id="userId" value="" />
 * <input class="tf8-log-hidden" type="hidden" id="cookie" value="" />
 *
 * // 需要统计的元素
 * <div class="tf8-log" data-log-position="自定义按钮" data-log-bussiness-type="按钮" data-log-content="摇一摇">摇一摇</button>
 * <div class="tf8-log" data-log-position="楼层_男装" data-log-bussiness-type="站内普返" data-log-content="商品ID" data-log-bm-category="商品一级类目">商品</button>
 *
 * //自定义统计事件
 * tf8Log.countPageClick({
    "position": "",
    "bussinessType": "",
    "content": "",
    "bmCategory": "",
  });
 * @version v1.0.0
 * @author Liu Bing
 */
var tf8Log = (function () {
  /**
   * 日志统计页面公共参数
   * @type {object}
   * @memberof tf8Log
   * @property {string}   pageType - 页面类型：mobile | pc
   * @property {string}   pageName - 页面名称
   * @property {string}   channel - 渠道, 来源
   * @property {string}   code - 活动code
   * @property {string}   userId - 用户ID
   * @property {string}   cookie - cookie
   */
  var defaultOpts = {};

  // 初始化默认参数,获取页面上隐藏域的参数
  $('.tf8-log-hidden').each(function () {
    var $this = $(this);
    defaultOpts[$this.attr('id')] = $this.val();
  });

  // 埋点上报方法
  function _reportFunc(url, data) {
    $.ajax({
      type: 'POST',
      url: url,
      data: data,
      contentType: 'application/x-www-form-urlencoded;charset=UTF-8'
    });
  }

  /**
   * 统计页面pv,uv
   * @private
   * @function
   * @memberof tf8Log
   * @param {object} defaultOpts - 页面公共参数{@link tf8Log.defaultOpts}
   */
  _reportFunc('/log/ajaxViewLog', defaultOpts);

  /**
   * 自定义统计页面点击事件
   * @name countPageClick
   * @function
   * @memberof tf8Log
   * @param {object} opts - 参数
   * @param {string} opts.position - 页面内位置
   * @param {string} opts.bussinessType - 业务类型
   * @param {string} opts.content - 内容
   * @param {string} [opts.bmCategory] - 后台类目
   */
  function countPageClick(opts) {
    opts = $.extend({}, defaultOpts, opts);
    // 上报页面点击
    _reportFunc('/log/ajaxClickLog', opts);
  }

  $('body').on('click', '.tf8-log', function () {
    var $this = $(this);
    var opts = {
      'position': $this.data('logPosition'),
      'bussinessType': $this.data('logBussinessType'),
      'content': $this.data('logContent'),
      'bmCategory': $this.data('logBmCategory')
    };
    countPageClick(opts);
  });

  /**
   * 统计活动商品点击数量，历史遗留功能，可能废弃
   * @name countItemClick
   * @private
   * @function
   * @deprecated
   * @memberof tf8Log
   * @param {string} actCode - 活动code
   * @param {string} type - 元素类型
   * @param {string} pageItemId - 元素ID
   */
  $('body').on('click', '.tf8-item-log', function () {
    var $this = $(this);
    var opts = {
      'actCode': defaultOpts.code,
      'type': $this.data('logItemType'),
      'pageItemId': $this.data('logItemId')
    };

    // 上报商品点击
    _reportFunc('/log/ajaxClick', opts);
  });

  return {
    defaultOpts: defaultOpts,
    countPageClick: countPageClick
  };
})();
