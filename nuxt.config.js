module.exports = {
	/*
	 ** Headers of the page
	 */
	head: {
		title: 'nuxt-app',
		meta: [{
				charset: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no'
			},
			//    { hid: 'description', name: 'description', content: 'Nuxt.js project' }
		],
		script: [{
				src: 'https://g.alicdn.com/mtb/??lib-flexible/0.3.2/flexible_css.js,lib-flexible/0.3.2/flexible.js'
			},
			{
				src: 'http://act.taofen8.com/js/lib/plugins/jquery-2.1.4.min.js'
			},
			{
				src: 'http://act.taofen8.com/js/lib/tf8_utils.js'
			},
			{
				src: 'http://act.taofen8.com/js/lib/tf8_common.js'
			},
			{
				src: 'http://act.taofen8.com/js/lib/tf8_env.js'
			},
			{
				src: 'http://act.taofen8.com/js/lib/plugins/clipboard.min.js'
			},
			{
				src: 'http://act.taofen8.com/js/lib/plugins/fastclick.js'
			},
		],
		link: [{
			rel: 'icon',
			type: 'image/x-icon',
			href: '/favicon.ico'
		}]
	},
	css: ['~assets/css/base.css'],
	/*
	 ** Customize the progress bar color
	 */
	loading: {
		color: '#3B8070'
	},
	/*
	 ** Build configuration
	 */
	build: {
		vendor: ['axios'],
		/*
		 ** Run ESLint on save
		 */
		//  extend (config, { isDev, isClient }) {
		//    if (isDev && isClient) {
		//      config.module.rules.push({
		//        enforce: 'pre',
		//        test: /\.(js|vue)$/,
		//        loader: 'eslint-loader',
		//        exclude: /(node_modules)/
		//      })
		//    }
		//  }
	},
	axios: {
		baseURL: 'http://vueh5.xueshanshan.top',
		credentials: false,
		proxyHeaders: false
	},
	modules: ['@nuxtjs/pwa', '@nuxtjs/axios'],
	plugins: ['~/plugins/filters.js']
}