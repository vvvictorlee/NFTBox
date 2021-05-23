<template>
	<div class="pc-receive-result">
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
						<!-- <div class="second-text3">盲盒私钥</div>
						<div class="second-text4">0x0aade7759446e07ad10cc6456d41e05c80c88bd1</div> -->
					</div>
					<div class="button-container">
						<div class="copy-button" @click.stop="goBack">领取到宝库</div>
					</div>
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
					<div class="button-container">
						<div class="check-button">查看排名</div>
					</div>
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
                imgurl:"image/diamond_box.png",
                tokens: [],
            };
            if(!level) {
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
.pc-receive-result {
	width: 100%;
	min-height: calc(100vh - 20px);
	padding-top: 10px;
	padding-bottom: 10px;
	min-width: 800px;
	background: #232323;
	.receive-result {
		margin: 100px auto;
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
			top: -20px;
			left: 50px;
			width: 350px;
			height: 400px;
			background: url("../../assets/image/x-bg.png") no-repeat;
			background-size: 100% 100%;
		}
		.right-x-bg {
			position: absolute;
			top: -100px;
			right: 0;
			width: 350px;
			height: 400px;
			background: url("../../assets/image/x-bg.png") no-repeat;
			background-size: 100% 100%;
		}
		.result-container {
			margin-top: 30px;
			min-height: 200px;
			padding-bottom: 40px;
			padding-top: 10px;
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
			.first-sammary {
				height: 30px;
				line-height: 30px;
				font-size: 16px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #ffffff;
				text-align: center;
			}
			.content-container {
				padding-top: 10px;
				.box-banner {
					margin: 10px auto;
					height: 136px;
					width: 174px;
					overflow: hidden;
					.img-container {
						height: 136px;
						width: 174px;
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
					margin: 10px auto;
					height: 136px;
					width: 174px;
					display: flex;
					justify-content: center;
					align-items: center;
					.img-container {
						height: 136px;
						width: 174px;
						display: flex;
						justify-content: center;
						align-items: center;
						overflow: hidden;
					}
				}
				.second-part {
					padding-left: 40px;
					padding-right: 40px;
					text-align: center;
					.second-text1 {
						margin-top: 20px;
						font-size: 20px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #02ead0;
					}
					.second-text2 {
						margin-top: 10px;
						font-size: 14px;
						font-family: PingFangSC-Light, PingFang SC;
						font-weight: 300;
						color: #ffffff;
					}
					.second-text3 {
						margin-top: 10px;
						font-size: 14px;
						font-family: PingFangSC-Light, PingFang SC;
						font-weight: 300;
						color: #ffffff;
					}
					.second-text4 {
						margin-top: 10px;
						font-size: 14px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #ffffff;
						word-wrap: break-word;
					}
					.fail-text-container {
						text-align: center;
						.fail-text1 {
							font-size: 20px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #de5347;
						}
						.fail-text2 {
							margin-top: 10px;
							font-size: 12px;
							font-family: PingFangSC-Light, PingFang SC;
							font-weight: 300;
							color: #ffffff;
						}
					}
				}
				.button-container {
					display: flex;
					justify-content: center;
					align-items: center;
					// padding-left: 20px;
					// padding-right: 20px;
					.copy-button {
						min-width: 100px;
						padding-left: 20px;
						padding-right: 20px;
						height: 40px;
						line-height: 40px;
						border: 1px solid #0ecda9;
						margin: 40px auto;
						border-radius: 8px;
						text-align: center;
						font-size: 16px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #0ecda9;
						cursor: pointer;
					}
					.check-button {
						width: 140px;
						height: 40px;
						line-height: 40px;
						border: 1px solid #ffffff;
						margin: 40px auto;
						border-radius: 8px;
						text-align: center;
						font-size: 16px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #ffffff;
						cursor: pointer;
					}
				}
			}
			.tips-area {
				padding-left: 40px;
				padding-right: 40px;
				margin-top: 20px;
				.tips-title {
					height: 24px;
					line-height: 024px;
					font-size: 14px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #ffffff;
					text-align: left;
				}
				ul {
					padding-top: 6px;
					text-align: left;
					li {
						margin-top: 8px;
						font-size: 12px;
						font-family: PingFangSC-Light, PingFang SC;
						font-weight: 300;
						color: #ffffff;
						line-height: 16px;
					}
				}
			}
		}
	}
}
</style>
