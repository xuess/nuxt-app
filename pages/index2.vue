<template>
	<div id="J_index">
		<!--搜索框-->
		<div style="height: 44px;">
			<div class="search">
				<form action="javascript:return true;" class="form">
					<div class="placeholder">
						<button type="button"></button>
						<span>立即查找独家优惠券</span>
					</div>
					<input type="search" disabled="disabled">
				</form>
			</div>
		</div>
		<!--tabs-->
		<div style="height: 40px;">
			<div class="tabs-wrapper">
				<div style="position: relative;">
					<div id="tabs" class="tabs">
						<a v-for="(item,index) in categoryList" :key="index">{{item.name}}</a>
						<a href="">&nbsp;</a>
					</div>
					<span class="category"></span>
				</div>
			</div>
		</div>

		<div class="categorys" v-show="showCategory">
			<div class="wrapper">
				<a class="category-cell router-link-active" v-for="(item,index) in categoryList" :key="index">
					<p class="category-cell-item">{{item.name}}</p>
				</a>
			</div>
		</div>

				<!--主题资源-->
			<div v-for="(item,index) in bannerList" :key="index">
				<template v-if="item.layout_type == '3c1h'">
					<div class="row topic-wrapper" v-if="item.module_list.length > 0">
						<div class="col c4">
							<img :src="item.module_list[0].image_url">
						</div>
						<div class="col c8">
							<div class="topic-right">
								<img :src="item.module_list[1].image_url">
								<div class="row down">
									<img :src="item.module_list[2].image_url">
									<img :src="item.module_list[3].image_url">
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>

		<!--灰色条-->
		<div class="divide"></div>

		<div class="items" id="J_goodsList">
			<!--商品流-->
			<div>
				<a v-for="(item,index) in goodsList" :key="index">
					<div class="goodsOne">
						<div class="cover-image"><img :src="item.img_url" class="image">
						</div>
						<div class="item-info">
							<h1 class="title"><img src="//oss1.lanlanlife.com/f87493c5f309d8b282476c232df6bd4b_26x26.png" class="tabsImg" v-if="item.is_tmall">
								<img  src="//oss3.lanlanlife.com/3f681b35cd2518c925786f7b44e24cf8_26x26.png" class="tabsImg" v-if="item.is_jhs">{{item.title}}
					            </h1>
							<p class="rec">{{item.desc}}</p>
							<div class="count"><span>{{item.is_tmall ?'天猫价':'淘宝价'}}{{item.origin_price}}</span> <span class="alreadyBuy">{{item.sales_num}} 人已购</span></div>
							<div class="coupon">
								<div class="price">
									¥<b>{{item.price}}</b></div>
								<div class="count-label"><strong>{{item.voucher_price}}</strong>元 券
								</div>
							</div>
						</div>
					</div>
				</a>
			</div>

			<div class="last-page">
				<p class="last-page-p">没有更多了~</p>
			</div>
		</div>
	</div>
</template>
<!--<nuxt-link to="/aaa">About page</nuxt-link>-->
<script>
	export default {
		head: {
			title: '首页',
			titleTemplate: '%s - 午休商城'
		},
		async asyncData({ app }) {
			console.log(app)
			const indexData  = await app.$axios.get(`/api/index.json`)
			const goodsList = await app.$axios.get(`/api/goodsList.json`)
			return {
				bannerList: indexData.data.data.banner_list,
				categoryList: indexData.data.data.category_list,
				goodsList:goodsList.data.data.goods_list,
				showCategory:false
			}
		},
	}
</script>

<style scoped>
	@import '~/assets/css/function.scss';
	@import '~/assets/css/index-1.css';
	@import '~/assets/css/index.css';
	.aaabbb{
		width: 1rem;
		height: 1rem;
		width: 1vw;
		height: 1vh;
	}
</style>