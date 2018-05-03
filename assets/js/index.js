/**
 * xuess
 * 微信被动加人
 * 2018-04-18
 */

var vm = new Vue({
	el: "#main",
	data: {
		wxUserName: pageData.wxUserName,
		giftList: pageData.giftList,
		//中奖编号
		targetGift: pageData.giftId || -1,
		//奖品名称
		targetGiftStr: pageData.giftName||'',
		//抽奖码
		drawCode: pageData.drawCode,
		userId: pageData.userId,
		showPop: false,
		//是否抽过奖
		isDrawed: pageData.received || false,
		//跑马灯特效
		drawStyleInfo: {
			//循环用 code
			targetGiftCode: -1,
			speedNum: 100,
			index: 0
		}
	},
	//计算属性
	computed: {
		//奖品列表 code
		giftCodeList: function() {
			var codeList = [];
			this.giftList.forEach(function(item) {
				codeList.push(item.giftId)
			})
			return codeList;
		}
	},
	//方法
	methods: {
		closePop: function() {
			this.showPop = false;
		},
		//抽奖
		doDraw: function() {
			if(!this.drawCode) {
				tf8Utils.toast('请输入抽奖码！')
				return;
			}
			var _this = this;
			this.ajaxHttp('/passiveAdd/draw', 'userId=' + this.userId + '&drawCode=' + this.drawCode, function(res) {
				if(res) {
					if(res.result) {
						//执行 抽奖跑马灯
						_this.drawStyle();
						setTimeout(function(){
							_this.drawStyleInfo.targetGiftCode = res.giftCode;
							_this.targetGiftStr = res.giftName;
						},1200)
						
					} else {
						tf8Utils.toast(res.errmsg);
					}
				} else {
					tf8Utils.toast('网络错误，请重试！')
				}
			}, function() {
				tf8Utils.toast('网络错误，请重试！')
			});
		},
		//奖品滚动效果
		drawStyle: function() {
			var len = this.giftCodeList.length,
				_this = this;

			//设置下一个球
			if(this.drawStyleInfo.index == len) {
				//从0 开始
				this.drawStyleInfo.index = 0;
			} else {
				this.drawStyleInfo.index++;
			}
			//复制目标位置
			this.targetGift = this.giftCodeList[this.drawStyleInfo.index];

			//有目标球时减速
			if(this.drawStyleInfo.targetGiftCode > 0) {
				//减速
				if(this.drawStyleInfo.speedNum < 400) {
					this.drawStyleInfo.speedNum = this.drawStyleInfo.speedNum + 100;
				}
				//到目标位置停止
				if(this.drawStyleInfo.targetGiftCode == this.giftCodeList[this.drawStyleInfo.index]){
					setTimeout(function() {
						_this.showPop = true;
						_this.isDrawed = true;
					}, this.drawStyleInfo.speedNum)
					return;
				}
			} else {
				//时间加速
				if(this.drawStyleInfo.speedNum > 100) {
					this.drawStyleInfo.speedNum = this.drawStyleInfo.speedNum - 100;
				}
			}

			setTimeout(function() {
				_this.drawStyle();
			}, this.drawStyleInfo.speedNum)
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

		//唤起
		tf8Common.awakeApp('taofen8-master://wl?id=' +encodeURIComponent('http://act.jinribiqiang.com/cavil/tiaoti-453'));
	}
	
});


/**
 * 引用了公共js
 */
function getSchema() {
	var temp = tf8Utils.getUrlParam('product');
	return !!temp ? temp : 'taofen8';
}

console.log(getSchema())