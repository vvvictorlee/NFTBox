<template>
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
.open-result {
	background: #303030;
	min-height: 100vh;
	width: 7.5rem;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	.left-x-bg {
		position: absolute;
		top: -1rem;
		left: 0;
		width: 3.5rem;
		height: 7.64rem;
		background: url("../../assets/image/x-bg.png") no-repeat;
		background-size: 100% 100%;
	}
	.right-x-bg {
		position: absolute;
		top: -2rem;
		right: 0;
		width: 3.5rem;
		height: 7.64rem;
		background: url("../../assets/image/x-bg.png") no-repeat;
		background-size: 100% 100%;
	}
	.result-container {
		padding-top: 0.72rem;
		// position: absolute;
		// top: 0.8rem;
		// left: 0.4rem;
		max-height: 9rem;
		overflow: auto;
		width: 6.7rem;
		background: #232323;
		border-radius: 0.12rem;
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
			padding-top: 0.6rem;
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
