<template>
	<div class="pc-open-result">
		<div class="open-result">
			<div class="left-x-bg"></div>
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
		<screen-shot ref="screenShot" :tokens="getOpenBoxInfo.tokens"  :boxText="$t(getOpenBoxInfo.i18Text)"></screen-shot>
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
.pc-open-result {
	width: 100%;
	min-height: calc(100vh - 20px);
	padding-top: 10px;
	min-width: 800px;
	background: #232323;
	padding-bottom: 10px;
	position: relative;
	.left-x-bg {
		position: absolute;
		top: 0;
		left: 50%;
		width: 436px;
		height: 560px;
		background: url("../../assets/image/bg-shadow.png") no-repeat;
		background-size: 100% 100%;
        transform: translate(-50%, -40%);
	}
	.open-result {
		margin: 100px auto;
		background: #303030;
		min-height: 200px;
		padding-bottom: 40px;
		width: 600px;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		overflow: hidden;
		border-radius: 12px;
		.result-container {
			margin-top: 40px;
			min-height: 200px;
			padding-bottom: 40px;
			padding-top: 20px;
			overflow: auto;
			width: 500px;
			background: #232323;
			&.sucess-boder {
				border-top: 6px solid #02ead0;
			}
			&.fail-border {
				border-top: 6px solid #de5347;
			}
			.first-title {
				height: 30px;
				line-height: 30px;
				font-size: 20px;
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
			.content-container {
				padding-top: 10px;
				.second-part {
					padding-left: 40px;
					padding-right: 40px;
					text-align: center;
					.second-text1 {
						margin-top: 10px;
						font-size: 18px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #02ead0;
					}
				}
			}
			.button-container {
				padding-top: 40px;
				display: flex;
				justify-content: center;
				align-items: center;
				padding-left: 40px;
				padding-right: 40px;
				.copy-button {
					width: 160px;
					height: 40px;
					margin-left: 20px;
					line-height: 40px;
					border: 1px solid #0ecda9;
					border-radius: 8px;
					text-align: center;
					font-size: 16px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #0ecda9;
					cursor: pointer;
				}
				.check-button {
					width: 160px;
					height: 40px;
					margin-right: 20px;
					line-height: 40px;
					border: 1px solid #ffffff;
					border-radius: 8px;
					text-align: center;
					font-size: 16px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 500;
					color: #ffffff;
					cursor: pointer;
				}
			}
		}
	}
}
</style>
