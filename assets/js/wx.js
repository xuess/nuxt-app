/**
 * xuess
 * 微信被动加人
 * 2018-04-18
 */

var vm = new Vue({
	el: "#main",
	data: {
		giftList: pageData.giftList,
		//抽奖码
		drawCode: pageData.drawCode,
		userId: 1111,
		showPop: false,
		showDownAppPop: false, //非微信 弹窗下载
		showDownWxPop: false, //微信弹窗下载
	},
	//计算属性
	computed: {
	},
	//方法
	methods: {
		closePop: function() {
			this.showDownWxPop = false;
			this.showDownAppPop = false;
		},
		//下载app
		downApp: function() {
			//下载
			tf8Common.downloadApp()
		},
		//下载淘粉吧app弹窗
		downTf8Pop:function(){
			//外部环境打开
			if(!tf8Env.tf8App.isTf8App) {
				this.showDownAppPop = true;
//				//微信
//				if(tf8Env.thirdApp.isWeixin) {
//					this.showDownWxPop = true;
//				} else {
//					this.showDownAppPop = true;
//				}
			}
		},
		/**
		 * ajax方法
		 * @param {Object} url
		 * @param {Object} data
		 * @param {Object} successFn
		 * @param {Object} errFn
		 */
		ajaxHttp: function(url, data, successFn, errFn) {
			tf8Common.ajax({
				url: url,
				type: "get",
				data: data,
				dataType: "json",
				success: function(data) {
					successFn && successFn(data);
				},
				error: function() {
					errFn && errFn();
				}
			});
		},
	},
	//监听
	watch: {

	},
	//	生命周期钩子的一些使用方法：

	//	beforecreate : 可以在这加个loading事件，在加载实例时触发
	//	created : 初始化完成时的事件写在这里，如在这结束loading事件，异步请求也适宜在这里调用
	//	mounted : 挂载元素，获取到DOM节点
	//	updated : 如果对数据统一处理，在这里写上相应函数
	//	beforeDestroy : 可以做一个确认停止事件的确认框
	//	nextTick : 更新数据后立即操作dom

	//vue实例创建之前
	beforecreate: function() {
		//300ms 延迟
		fastclick.attach(document.body);
	},
	//vue实例创建之后
	created: function() {
		//复制按钮
		var clipboard = new Clipboard('#J_copy');
		clipboard.on('success', function(e) {
			tf8Utils.toast('复制成功！')
		});

		clipboard.on('error', function(e) {
			tf8Utils.toast('复制失败！')
		});
		var actUrl = '';
		//外部环境打开
//		if(!tf8Env.tf8App.isTf8App) {
//			//唤起
//			tf8Common.awakeApp('taofen8-master://wl?id=' + this.actUrl);
//		}
//		else {
//			//app内 用户为空 去登陆
//			if(!this.userId) {
//				//去登陆
//				tf8Common.loginByWap(this.actUrl);
//			}
//		}
	}
});