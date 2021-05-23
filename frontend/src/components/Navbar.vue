<template>
	<div class="">
		<b-navbar toggleable="lg" type="dark" variant="info">
			<b-navbar-brand href="/">
                <img src="../assets/image/logo.d08957bb.svg" />
            </b-navbar-brand>
			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
			<b-collapse id="nav-collapse" is-nav>
				<b-navbar-nav>
					<!-- <b-nav-item href="/open">Open</b-nav-item>
					<b-nav-item href="#" disabled>Disabled</b-nav-item> -->
				</b-navbar-nav>
				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-item-dropdown text="Lang" right>
						<b-dropdown-item>EN</b-dropdown-item>
						<b-dropdown-item>简体中文</b-dropdown-item>
						<b-dropdown-item>韩文</b-dropdown-item>
					</b-nav-item-dropdown>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>
	</div>
</template>

<script>
export default {
	name: 'Navbar',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
