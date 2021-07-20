<template>
	<div id="app">
		<!-- 路由匹配到的组件将渲染在这里 -->
		<router-view v-wechat-title="$route.meta.title"></router-view>
	</div>
</template>

<script>
export default {
	name: 'App',
}
</script>

<style lang="scss" scoped>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
