<template>
	<div class="receive-result">
		<div class="right-x-bg"></div>
		<div class="left-x-bg"></div>
		<div class="result-container" :class="[pageType == 'fail' ? 'fail-border': 'sucess-boder']">
			<div class="first-title" :class="[pageType == 'fail' ? 'fail-color': 'sucess-color']">{{pageType == 'fail' ? '领取失败' : '领取成功'}}</div>
			<div class="first-sammary">{{`您还剩${getOpenMessage.last_times}次机会`}}</div>
			<div class="content-container" v-if="!(pageType == 'fail')">
				<div class="box-banner">
					<div class="img-container">
						<img v-lazy="publicPath + computedBoxInfo.imgurl" />
					</div>
				</div>
				<div class="second-part">
					<div class="second-text1">{{computedBoxInfo.name}}</div>
					<div class="second-text2">
						<span>可开出代币：</span>
						<span v-for="(ele,index) in (computedBoxInfo.tokens || [])" :key="index + 'tokens'">{{`${index == 0 ? '' : '、'} ${ele.symbol}`}}</span>
					</div>
					<!-- <div class="second-text3">盲盒私钥</div> -->
					<!-- <div class="second-text4">0x0aade7759446e07ad10cc6456d41e05c80c88bd1</div> -->
				</div>
				<div class="copy-button" @click.stop="goBack">领取到宝库</div>
			</div>
			<div class="content-container" v-if="(pageType == 'fail')">
				<div class="fail-flag">
					<div class="img-container">
						<van-empty image="error" description="" />
					</div>
				</div>
				<div class="second-part">
					<div class="fail-text-container">
						<div class="fail-text1">很遗憾，您未能获得盲盒</div>
						<div class="fail-text2">可能已领取完或没有领取资格</div>
					</div>
				</div>
				<div class="check-button">查看排名</div>
			</div>
			<div class="tips-area">
				<div class="tips-title">温馨提示</div>
				<ul>
					<li>1.盲盒等级为：钻石、白金、黄金、白银、青铜，每个等级对应不同的活动代币种类及数量.</li>
					<li>2.只有在获奖名单中的用户地址，才可以领取到盲盒.</li>
					<li>3.盲盒需要手动打开，获取其中奖励.</li>
					<li>4.该活动是在HSC上完成的活动，最终解释权归HSC所有.</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
	name: 'ReceiveResult',
	data() {
		return {
			pageType: 'sucess',//sucess,fail
			// leftTimes: 10, //剩余次数
			publicPath: process.env.BASE_URL,
		}
	},
	computed: {
		...mapGetters({
			getOpenMessage: "getOpenMessage",
			getBannerList: "getBannerList",
		}),
		computedBoxInfo() {
			let that = this;
			let level = that.getOpenMessage && that.getOpenMessage.level || '';
			let boxInfo = {
				name: '',
				imgurl: "image/diamond_box.png",
				tokens: [],
			};
			if (!level) {
				return boxInfo;
			} else {
				let tempObj = that.getBannerList.find((item) => {
					return item.level == level;
				})
				// console.log(tempObj);
				return tempObj;
			}
		},
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
.receive-result {
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
			.box-banner {
				margin: 0.4rem auto;
				height: 2.72rem;
				width: 3.48rem;
				.img-container {
					height: 2.72rem;
				    width: 3.48rem;
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: hidden;
					img {
						display: block;
						height: 100%;
						width: 100%;
					}
				}
			}
			.fail-flag {
				margin: 0.4rem auto;
				height: 2.72rem;
				width: 3.48rem;
				display: flex;
				justify-content: center;
				align-items: center;
				.img-container {
					height: 2rem;
					width: 2rem;
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: hidden;
				}
			}
			.second-part {
				padding-left: 0.46rem;
				padding-right: 0.46rem;
				text-align: left;
				.second-text1 {
					margin-top: 0.4rem;
					font-size: 0.4rem;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #02ead0;
				}
				.second-text2 {
					margin-top: 0.04rem;
					font-size: 0.24rem;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: #ffffff;
				}
				.second-text3 {
					margin-top: 0.3rem;
					font-size: 0.24rem;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: #ffffff;
				}
				.second-text4 {
					margin-top: 0.04rem;
					font-size: 0.24rem;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #ffffff;
					word-wrap: break-word;
				}
				.fail-text-container {
					text-align: center;
					.fail-text1 {
						font-size: 0.4rem;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #de5347;
					}
					.fail-text2 {
						margin-top: 0.12rem;
						font-size: 0.24rem;
						font-family: PingFangSC-Light, PingFang SC;
						font-weight: 300;
						color: #ffffff;
					}
				}
			}
			.copy-button {
				width: 2.8rem;
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
				width: 2.8rem;
				height: 0.8rem;
				line-height: 0.8rem;
				border: 1px solid #ffffff;
				margin: 0.6rem auto;
				border-radius: 0.08rem;
				text-align: center;
				font-size: 0.3rem;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #ffffff;
				cursor: pointer;
			}
		}
		.tips-area {
			padding-left: 0.36rem;
			padding-right: 0.36rem;
			padding-bottom: 0.6rem;
			margin-top: 0.6rem;
			.tips-title {
				height: 0.22rem;
				line-height: 0.22rem;
				font-size: 0.24rem;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #ffffff;
				text-align: left;
			}
			ul {
				padding-top: 0.2rem;
				text-align: left;
				li {
					margin-top: 0.1rem;
					font-size: 0.24rem;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: #ffffff;
					line-height: 0.36rem;
				}
			}
		}
	}
}
</style>
