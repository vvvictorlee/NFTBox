<template>
	<div class="pc-open-result">
		<div class="open-result">
			<div class="right-x-bg"></div>
			<div class="left-x-bg"></div>
			<div class="result-container" :class="[pageType == 'fail' ? 'fail-border': 'sucess-boder']">
				<div class="first-title sucess-color">{{`恭喜您成功打开${getOpenBoxInfo.name}获得`}}</div>
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
					<div class="copy-button">截图分享</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
	name: 'OpenResult',
	data() {
		return {
			pageType: 'sucess',
			// leftTimes: 10, //剩余次数
            publicPath: process.env.BASE_URL,
		}
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
    methods: {
        goBack() {
            this.$router.go(-1);
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
	.open-result {
		margin: 200px auto;
		background: #303030;
		min-height: 200px;
		padding-bottom: 40px;
		width: 600px;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		overflow: hidden;
		border-radius: 12px;
		.left-x-bg {
			position: absolute;
			top: -60px;
			left: 0;
			width: 350px;
			height: 340px;
			background: url("../../assets/image/x-bg.png") no-repeat;
			background-size: 100% 100%;
		}
		.right-x-bg {
			position: absolute;
			top: -100px;
			right: 0;
			width: 350px;
			height: 340px;
			background: url("../../assets/image/x-bg.png") no-repeat;
			background-size: 100% 100%;
		}
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
				justify-content: space-between;
				align-items: center;
				padding-left: 40px;
				padding-right: 40px;
				.copy-button {
					width: 160px;
					height: 40px;
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
