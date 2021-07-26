<template>
	<div class='layout'>
		<div class="layout--top">
			<div class="token-pocket"></div>
			<div class="login-container">
				<div class="login-button" v-if="!isConnected" @click="connectWallet">{{$t('home.test1')}}</div>
				<div class="login-account" v-if="isConnected">
					<div class="icon"></div>
					<div class="account">{{clientAccount | formatAccountMobile}}</div>
				</div>
			</div>
		</div>
		<div class="language-top">
			<div class="language-container">
				<language-mobile></language-mobile>
			</div>
		</div>
		<div class="layout--content">
			<router-view class="child-view"></router-view>
		</div>
		<div class="layout--bottom">
			<div class="nav-item" @click="navSelect('home','Home')">
				<div class="home-icon" :class="[navActive == 'home' ? 'active' : '']"></div>
				<div class="home-text" :class="[navActive == 'home' ? 'active' : '']">{{$t('home.test2')}}</div>
			</div>
			<div class="nav-item" @click="navSelect('sence','Scenes')">
				<div class="sence-icon" :class="[navActive == 'sence' ? 'active' : '']"></div>
				<div class="sence-text" :class="[navActive == 'sence' ? 'active' : '']">{{$t('home.test3')}}</div>
			</div>
			<div class="nav-item" @click="navSelect('my','My')">
				<div class="my-icon" :class="[navActive == 'my' ? 'active' : '']"></div>
				<div class="my-text" :class="[navActive == 'my' ? 'active' : '']">{{$t('home.test4')}}</div>
			</div>

		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import LanguageMobile from './LanguageMobile';
import NftMinxin from '../views/minxin/minxin.vue';
export default {
	data() {
		return {
			isLogin: true,
			navActive: 'home', //home 领取 sence 场景 my我的
		};
	},
	mixins: [NftMinxin],
	components: {
		'language-mobile': LanguageMobile,
	},
	created() {
		// console.log(this.$route.name);
		let routerName = this.$route.name || 'Home';
		const nameMap = {
			'Home': 'home',
			'Scenes': 'sence',
			'My': 'my'
		};
		this.navActive = nameMap[routerName];

		this.connectWallet();
	},
	methods: {
		navSelect(nav, name) {
			if (this.navActive == nav) {
				return;
			}
			if (this.navActive == 'my' && !this.getClientAccount) {
				this.connectWallet();
			}
			this.navActive = nav;
			this.$router.push({
				name: name
			});
		}
	}
}

</script>
<style lang='scss' scoped>
.layout {
	background: linear-gradient(135deg, #2761e7 0%, #95d7ff 100%);
	min-height: 100vh;
	&--top {
		padding-left: 0.34rem;
		padding-right: 0.34rem;
		height: 1.2rem;
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.token-pocket {
			height: 0.49rem;
			width: 1.75rem;
			background: url("../assets/image/token_pocket.png") no-repeat;
			background-size: 100% 100%;
		}
		.login-container {
			.login-button {
				width: 1.7rem;
				height: 0.66rem;
				line-height: 0.66rem;
				background: linear-gradient(90deg, #217af8 0%, #70b2ff 100%);
				box-shadow: 0 0.06rem 0.12rem rgba(112, 178, 255, 0.36);
				border-radius: 0.12rem;
				font-size: 0.32rem;
				font-family: PingFang SC;
				font-weight: 400;
				color: #ffffff;
				text-align: center;
				cursor: pointer;
			}
			.login-account {
				min-width: 2.22rem;
				padding-left: 0.28rem;
				padding-right: 0.28rem;
				height: 0.66rem;
				background: #f9f9fa;
				border-radius: 0.38rem;
				font-size: 0.24rem;
				font-family: PingFang SC;
				font-weight: 400;
				color: #000000;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.icon {
					margin-right: 0.12rem;
					height: 0.26rem;
					width: 0.46rem;
					background: url("../assets/image/hsc_logo1.png") no-repeat;
					background-size: 100% 100%;
				}
			}
		}
	}
	.language-top {
		height: 0.6rem;
		padding: 0.2rem 0.34rem;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.language-container {
			width: 2rem;
			height: 0.6rem;
			border-radius: 0.3rem;
			border: 2px solid rgba(255, 255, 255, 0.2);
		}
	}
	&--content {
		margin: 0 auto;
		width: 7.5rem;
		padding-bottom: 2rem;
	}
	&--bottom {
		position: fixed;
		z-index: 9999;
		left: 0;
		bottom: 0;
		height: 1.2rem;
		width: 100%;
		background: #ffffff;
		box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-around;
		align-items: center;
		.nav-item {
			width: 1rem;
			height: 1rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			.home-icon {
				height: 0.48rem;
				width: 0.48rem;
				background: url("../assets/image/home.png") no-repeat;
				background-size: 100% 100%;
				&.active {
					background: url("../assets/image/home_active.png") no-repeat;
					background-size: 100% 100%;
				}
			}
			.home-text {
				font-size: 0.2rem;
				font-family: PingFang SC;
				font-weight: 400;
				color: #4e4e4e;
				&.active {
					color: #278df5;
				}
			}
			.sence-icon {
				height: 0.48rem;
				width: 0.48rem;
				background: url("../assets/image/sence.png") no-repeat;
				background-size: 100% 100%;
				&.active {
					background: url("../assets/image/sence_active.png")
						no-repeat;
					background-size: 100% 100%;
				}
			}
			.sence-text {
				font-size: 0.2rem;
				font-family: PingFang SC;
				font-weight: 400;
				color: #4e4e4e;
				&.active {
					color: #278df5;
				}
			}
			.my-icon {
				height: 0.48rem;
				width: 0.48rem;
				background: url("../assets/image/my.png") no-repeat;
				background-size: 100% 100%;
				&.active {
					background: url("../assets/image/my_active.png") no-repeat;
					background-size: 100% 100%;
				}
			}
			.my-text {
				font-size: 0.2rem;
				font-family: PingFang SC;
				font-weight: 400;
				color: #4e4e4e;
				&.active {
					color: #278df5;
				}
			}
		}
	}
}
</style>