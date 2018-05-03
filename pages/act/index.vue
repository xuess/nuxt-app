<template>
	<div class="content" id="main">
		<div class="banner">
			<img src="https://y.taofen8.com/3e60518530f741ad8bb3ff9bbbc0d70b.jpg" />
		</div>
		<div class="draw-area-finsh" v-if="isDrawed">
			<p class="draw-finsh">
				恭喜您<br /><span>获得{{targetGiftStr}}</span>
			</p>
			<ul class="reward">
				<li :class="{selected:(item.giftId == targetGift)}" v-for="(item, index) in giftList">
					<p class="reward-str">{{item.giftName}}</p>
				</li>
			</ul>
		</div>
		<div class="draw-area" v-if="!isDrawed">
			<ul class="reward">
				<li :class="{selected:(item.giftId == targetGift)}" v-for="(item, index) in giftList">
					<p class="reward-str">{{item.giftName}}</p>
				</li>
			</ul>
			<div class="input-area">
				<input type="text" name="draw-code" id="draw-code" value="" v-model="drawCode" placeholder="请输入抽奖码" />
			</div>

		</div>
		<div class="btn-info tf8-log" @click="doDraw" v-if="!isDrawed" data-log-position="自定义按钮" data-log-bussiness-type="按钮" data-log-content="抽奖">
			<img src="https://y.taofen8.com/06f460eeca7a4841b27305dccb5764a7.jpg" />
		</div>
		<div class="act-rule" v-if="wxUserName">
			<div class="rule">
				<button class="copy bw1 tf8-log" id="J_copy" data-clipboard-action="copy" data-clipboard-target="#copy-str" data-log-position="自定义按钮" data-log-bussiness-type="按钮" data-log-content="复制微信号">复制微信号</button>
				<p>1.加小粉微信号：<span id="copy-str">{{wxUserName}}</span>为好友</p>
				<p>2.通过小粉提供的链接领取抽奖码</p>
				<p>3.回到淘粉吧输入抽奖码即可领奖</p>
			</div>
		</div>
		<div class="footer clearfix" v-else>
			<img src="https://y.taofen8.com/7caceed9a9e04c2d8a5498a635300425.jpg" />
		</div>

		<div class="mask" @touchmove.prevent v-show="showPop" @click="closePop"></div>
		<div class="pop-success" @touchmove.prevent v-show="showPop">
			<div class="close tf8-log" @click="closePop" data-log-position="自定义按钮" data-log-bussiness-type="按钮" data-log-content="关闭抽奖弹窗"><img src="https://y.taofen8.com/b69c31467b204d2585d8a5d5dd3ee566.jpg" /></div>
			<div class="pop-main">
				<p class="pop-title">
					恭喜中奖
				</p>
				<p class="pop-win-info">
					恭喜您获得{{targetGiftStr}}，集分宝将在1个工作日内发放到您绑定的支付宝账号中。
				</p>
				<p class="iknow-btn" @click="closePop"></p>
			</div>
		</div>

		<div class="toast hide">
			提示文字，很多
		</div>

	</div>
</template>

<script>
	export default {
		head: {
			title: '首页',
			titleTemplate: '%s - 送你9999集分宝',
		},
		data() {
			return {
				showPop: false,
				//跑马灯特效
				drawStyleInfo: {
					//循环用 code
					targetGiftCode: -1,
					speedNum: 100,
					index: 0
				}
			}
		},
		async asyncData({ app }) {
			const indexData = await app.$axios.get(`http://111.231.88.63:86/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/getInfo`)
			return {
				wxUserName: indexData.data.wxUserName,
				giftList: indexData.data.giftList,
				//中奖编号
				targetGift: indexData.data.giftId || -1,
				//奖品名称
				targetGiftStr: indexData.data.giftName || '',
				//抽奖码
				drawCode: '',
				//				drawCode: indexData.data.drawCode,
				userId: indexData.data.userId,
				//是否抽过奖
				isDrawed: indexData.data.received || false,

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
				this.ajaxHttp('http://111.231.88.63:86/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/draw/', 'userId=' + this.userId + '&drawCode=' + this.drawCode, function(res) {
					if(res) {
						if(res.success) {
							//执行 抽奖跑马灯
							_this.drawStyle();
							setTimeout(function() {
								_this.drawStyleInfo.targetGiftCode = res.giftCode;
								_this.targetGiftStr = res.giftName;
							}, 1200)

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
					if(this.drawStyleInfo.targetGiftCode == this.giftCodeList[this.drawStyleInfo.index]) {
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
			
		}

	}
</script>

<style lang="less" scoped>
	@base : 1;
	[v-clock] {
		display: none;
	}
	
	.tac {
		text-align: center;
	}
	
	.clearfix:after {
		content: '';
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}
	
	input {
		-webkit-appearance: none;
		border-radius: 0;
	}
	
	.fw-b {
		font-weight: bold;
	}
	
	[data-dpr="1"] .bw1 {
		border-width: 1px;
	}
	
	[data-dpr="2"] .bw1 {
		border-width: 2px;
	}
	
	[data-dpr="3"] .bw1 {
		border-width: 3px;
	}
	
	[data-dpr="1"] .bw2 {
		border-width: 2px;
	}
	
	[data-dpr="2"] .bw2 {
		border-width: 4px;
	}
	
	[data-dpr="3"] .bw2 {
		border-width: 6px;
	}
	
	[data-dpr="1"] .fs11 {
		font-size: 11px;
	}
	
	[data-dpr="1"] .fs12 {
		font-size: 12px;
	}
	
	[data-dpr="1"] .fs14 {
		font-size: 14px;
	}
	
	[data-dpr="1"] .fs15 {
		font-size: 15px;
	}
	
	[data-dpr="1"] .fs16 {
		font-size: 16px;
	}
	
	[data-dpr="1"] .fs17 {
		font-size: 17px;
	}
	
	[data-dpr="1"] .fs18 {
		font-size: 18px;
	}
	
	[data-dpr="1"] .fs20 {
		font-size: 20px;
	}
	
	[data-dpr="1"] .fs24 {
		font-size: 24px;
	}
	
	[data-dpr="1"] .fs28 {
		font-size: 28px;
	}
	
	[data-dpr="1"] .fs30 {
		font-size: 30px;
	}
	
	[data-dpr="2"] .fs11 {
		font-size: 22px;
	}
	
	[data-dpr="2"] .fs12 {
		font-size: 24px;
	}
	
	[data-dpr="2"] .fs14 {
		font-size: 28px;
	}
	
	[data-dpr="2"] .fs15 {
		font-size: 30px;
	}
	
	[data-dpr="2"] .fs16 {
		font-size: 32px;
	}
	
	[data-dpr="2"] .fs17 {
		font-size: 34px;
	}
	
	[data-dpr="2"] .fs18 {
		font-size: 36px;
	}
	
	[data-dpr="2"] .fs20 {
		font-size: 40px;
	}
	
	[data-dpr="2"] .fs24 {
		font-size: 48px;
	}
	
	[data-dpr="2"] .fs28 {
		font-size: 56px;
	}
	
	[data-dpr="2"] .fs30 {
		font-size: 60px;
	}
	
	[data-dpr="3"] .fs11 {
		font-size: 36px;
	}
	
	[data-dpr="3"] .fs12 {
		font-size: 41px;
	}
	
	[data-dpr="3"] .fs14 {
		font-size: 45px;
	}
	
	[data-dpr="3"] .fs15 {
		font-size: 48px;
	}
	
	[data-dpr="3"] .fs16 {
		font-size: 51px;
	}
	
	[data-dpr="3"] .fs17 {
		font-size: 54px;
	}
	
	[data-dpr="3"] .fs18 {
		font-size: 57px;
	}
	
	[data-dpr="3"] .fs20 {
		font-size: 63px;
	}
	
	[data-dpr="3"] .fs24 {
		font-size: 75px;
	}
	
	[data-dpr="3"] .fs28 {
		font-size: 84px;
	}
	
	[data-dpr="3"] .fs30 {
		font-size: 90px;
	}
	
	a {
		text-decoration: none!important;
	}
	
	body,
	div,
	li,
	ol,
	ul,
	p,
	span {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	
	button,
	input {
		outline: none;
		-webkit-appearance: none;
		border-radius: 0;
	}
	
	html {}
	
	body {
		font-family: 'PingFangSC-Light';
		width: 10rem;
		overflow-x: hidden;
		margin: 0 auto;
	}
	
	.content {
		width: 10rem;
		margin: 0 auto;
		overflow-x: hidden;
		color: #333;
	}
	
	.hide {
		display: none;
	}
	
	.reward {
		overflow: hidden;
		li {
			width: 185rem/@base;
			height: 149rem/@base;
			float: left;
			background-size: 100%;
			background-repeat: no-repeat;
			background-image: url(https://y.taofen8.com/c6a9886b22904857a86be45bc4c76620.jpg);
			&.selected {
				background-image: url(https://y.taofen8.com/85f8032d49d2468d92c48ee473585462.jpg);
				p {
					color: #fff194;
				}
			}
		}
		.reward-str {
			margin-top: 90rem/@base;
			color: #e04500;
			font-size: 28rem/@base;
			text-align: center;
		}
	}
	
	.toast {
		z-index: 100;
		position: fixed;
		bottom: 20%;
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.8);
		border-radius: 10rem/@base;
		color: #FFF;
		line-height: 2;
		max-width: 300rem/@base;
		padding: 10rem/@base 20rem/@base;
		font-size: 24rem/@base;
	}
	
	@base : 64;
	.banner {
		width: 100%;
		height: 396rem/@base;
		img {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	
	.draw-area {
		background-image: url(https://y.taofen8.com/c729968ec3ed4ca48fe8482aa5b76831.jpg);
		width: 640rem/@base;
		height: 439rem/@base;
		background-repeat: no-repeat;
		background-size: 100%;
		padding: 0 40rem/@base 0 45rem/@base;
	}
	
	.draw-area-finsh {
		background-image: url(https://y.taofen8.com/8b66b45c83f14d888724971bb361e80b.jpg);
		width: 640rem/@base;
		height: 534rem/@base;
		background-repeat: no-repeat;
		background-size: 100%;
		padding: 20rem/@base 40rem/@base 0 45rem/@base;
	}
	
	.draw-finsh {
		font-size: 48rem/@base;
		color: #fff;
		text-align: center;
		line-height: 1.6;
		span {
			font-size: 48rem/@base;
		}
	}
	
	.input-area {
		background-image: url(https://y.taofen8.com/83be7636e6304850b9a0aca679537c79.jpg);
		width: 542rem/@base;
		height: 82rem/@base;
		background-repeat: no-repeat;
		background-size: 100%;
		margin: 0 auto;
		margin-top: 18rem/@base;
		position: relative;
		z-index: 1;
		input {
			position: relative;
			top: 11rem/@base;
			left: 13rem/@base;
			z-index: 2;
			//      margin: 15rem/@base 0 0 15rem/@base;
			width: 520rem/@base;
			height: 63rem/@base;
			background: #fff;
			border: none;
			font-size: 24rem/@base;
			color: #cccccc;
		}
	}
	
	.btn-info {
		width: 640rem/@base;
		height: 94rem/@base;
		img {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
	
	.act-rule {
		background-image: url(https://y.taofen8.com/22852185b8c349b1b431fa80d8678c4e.jpg);
		width: 640rem/@base;
		height: 371rem/@base;
		background-repeat: no-repeat;
		background-size: 100%;
		.rule {
			position: relative;
			padding-top: 105rem/@base;
			width: 573rem/@base;
			//      height: 165rem/@base;
			margin: 0 auto;
			font-size: 28rem/@base;
			color: #fff;
			line-height: 2;
		}
	}
	
	.copy {
		position: absolute;
		z-index: 11;
		left: 50%;
		transform: translateX(-50%);
		bottom: -46rem/@base;
		border-radius: 10rem/@base;
		padding: 3rem/@base 20rem/@base;
		border: solid #fff;
		font-size: 24rem/@base;
		background: none;
		color: #fff;
	}
	
	.mask {
		position: fixed;
		z-index: 12;
		background-color: rgba(0, 0, 0, .7);
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.pop-success {
		position: fixed;
		z-index: 13;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		.close {
			position: absolute;
			bottom: -120rem/@base;
			left: 50%;
			transform: translateX(-50%);
			img {
				width: 71rem/@base;
				height: 71rem/@base;
			}
		}
		.pop-main {
			background-image: url(https://y.taofen8.com/6675f73a9f304027b25738dc47a6aebf.jpg);
			width: 405rem/@base;
			height: 577rem/@base;
			background-repeat: no-repeat;
			background-size: 100%;
			margin: 0 auto;
			padding: 27rem/@base;
			color: #fff;
			.pop-title {
				padding-top: 190rem/@base;
				font-size: 56rem/@base;
				text-align: center;
			}
			.pop-win-info {
				margin-top: 6rem/@base;
				font-size: 24rem/@base;
			}
			.iknow-btn {
				width: 100%;
				height: 70rem/@base;
				margin-top: 80rem/@base;
			}
		}
	}
	
	.footer {
		width: 640rem/@base;
		height: 109rem/@base;
		img {
			width: 100%;
			height: 100%;
			display: block;
		}
	}
</style>