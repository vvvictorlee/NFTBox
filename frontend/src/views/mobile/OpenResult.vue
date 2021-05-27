<template>
	<div class="mobile-open-result">
        <div class="left-x-bg"></div>
		<div class="open-result">
			<div class="result-container" :class="[pageType == 'fail' ? 'fail-border': 'sucess-boder']">
				<div class="first-title sucess-color">{{`${$t('home.test15')} ${$t(getOpenBoxInfo.i18Text)} ${$t('home.test16')}`}}</div>
				<div class="content-container">
					<div class="second-part">
						<div class="second-text1" v-for="(item,index) in getOpenBoxInfo.tokens" :key="index + 'tokens'">
							<span>{{`${item.symbol} ${item.amount}`}}</span>
						</div>
						<!-- <div class="second-text1">829.25 HOO</div>
					<div class="second-text1">0.0000254 BTC</div>
					<div class="second-text1">0.00012 ETH</div> -->
					</div>
				</div>
				<div class="button-container">
					<div class="check-button" @click.stop="goBack">ok</div>
					<div class="copy-button" @click="copyShare">{{$t('home.test17')}}</div>
				</div>
			</div>
		</div>
        <screen-shot ref="screenShot" :tokens="getOpenBoxInfo.tokens" :boxText="$t(getOpenBoxInfo.i18Text)"></screen-shot>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import ScreenShot from '../../components/ScreenShot';
export default {
	name: 'OpenResult',
	data() {
		return {
			pageType: 'sucess',
			// leftTimes: 10, //剩余次数
			publicPath: process.env.BASE_URL,
		}
	},
    components: {
		'screen-shot': ScreenShot,
	},
	computed: {
		...mapGetters({
			getOpenBoxInfo: "getOpenBoxInfo",
		}),
	},
	created() {
		this.pageType = (this.$route.params && this.$route.params.id) || "sucess";
		console.log(this.$route.params.id);
	},
    mounted() {
		
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		},
        copyShare() {
            this.$refs['screenShot'].openDialog();
        },
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mobile-open-result {
	background: #303030;
    padding-top: 1.2rem;
    padding-bottom: 1.2rem;
	min-height: calc(100vh - 2.4rem);
	width: 100%;
    overflow: hidden;
    position: relative;
    .left-x-bg {
		position: absolute;
		top: 0;
		left: 50%;
		width: 3.5rem;
		height: 4rem;
		background: url("../../assets/image/bg-shadow.png") no-repeat;
		background-size: 100% 100%;
        transform: translate(-50%, -30%);
	}
}
.open-result {
	background: #303030;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	.result-container {
        margin: 0 auto;
		width: 6.7rem;
		background: #232323;
		border-radius: 0.12rem;
        padding-top: .6rem;
		&.sucess-boder {
			border-top: 0.06rem solid #02ead0;
		}
		&.fail-border {
			border-top: 0.06rem solid #de5347;
		}
		.first-title {
			height: 0.5rem;
			font-size: 0.36rem;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			text-align: center;
			&.sucess-color {
				color: #02ead0;
			}
			&.fail-color {
				color: #de5347;
			}
		}
		.first-sammary {
			margin-top: 0.2rem;
			height: 0.4rem;
			font-size: 0.28rem;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #ffffff;
			text-align: center;
		}
		.content-container {
			margin-top: 0.6rem;
			max-height: 4rem;
			overflow-y: scroll;
			.second-part {
				padding-left: 0.46rem;
				padding-right: 0.46rem;
				text-align: center;
				.second-text1 {
					margin-top: 0.1rem;
					font-size: 0.4rem;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #02ead0;
				}
			}
		}
		.button-container {
			padding-top: 0.8rem;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-left: 0.4rem;
			padding-right: 0.4rem;
			.copy-button {
				width: 2.4rem;
				height: 0.8rem;
				line-height: 0.8rem;
				border: 1px solid #0ecda9;
				margin: 0.6rem auto;
				border-radius: 0.08rem;
				text-align: center;
				font-size: 0.3rem;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #0ecda9;
				cursor: pointer;
			}
			.check-button {
				width: 2.4rem;
				height: 0.8rem;
				line-height: 0.8rem;
				border: 1px solid #ffffff;
				margin: 0.6rem auto;
				border-radius: 0.08rem;
				text-align: center;
				font-size: 0.34rem;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 500;
				color: #ffffff;
				cursor: pointer;
			}
		}
	}
}
</style>
