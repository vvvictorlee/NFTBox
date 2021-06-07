<template>
	<div class="mobile-receive-result">
		<div class="left-x-bg"></div>
		<div class="receive-result">
			<div class="result-container" :class="[pageType == 'fail' ? 'fail-border': 'sucess-boder']">
				<div class="first-title" :class="[pageType == 'fail' ? 'fail-color': 'sucess-color']">{{pageType == 'fail' ? $t('home.test18') : $t('home.test19')}}</div>
				<div class="first-sammary">{{`${$t('home.test20')} ${getOpenMessage.last_times} ${$t('home.test21')}`}}</div>
				<div class="content-container" v-if="!(pageType == 'fail')">
					<div class="box-banner">
						<div class="img-container">
							<img v-lazy="publicPath + computedBoxInfo.imgurl" />
						</div>
					</div>
					<div class="second-part">
						<div class="second-text1">{{$t(computedBoxInfo.i18Text) || computedBoxInfo.name}}</div>
						<div class="second-text2">
							<span>{{$t('home.test22')}}</span>
							<span v-for="(ele,index) in (computedBoxInfo.tokens || [])" :key="index + 'tokens'">{{`${index == 0 ? '' : '、'} ${ele.symbol}`}}</span>
						</div>
						<!-- <div class="second-text3">盲盒私钥</div> -->
						<!-- <div class="second-text4">0x0aade7759446e07ad10cc6456d41e05c80c88bd1</div> -->
					</div>
					<div class="button-container double-button">
						<div class="copy-button" @click.stop="goBack">{{$t('home.test23')}}</div>
                        <div class="copy-button" @click.stop="goHooSpot">{{$t('home.test38')}}</div>
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
							<div class="fail-text1">{{$t('home.test24')}}</div>
							<div class="fail-text2">{{$t('home.test25')}}</div>
                            <div class="fail-text2">{{$t('home.test37')}}</div>
						</div>
					</div>
					<div class="button-container double-button">
						<div class="check-button" @click="goWinnerList">{{$t('home.test26')}}</div>
                        <div class="check-button" @click.stop="goHooSpot">{{$t('home.test38')}}</div>
					</div>
				</div>
				<div class="tips-area">
					<div class="tips-title">{{$t('home.test5')}}</div>
					<ul>
						<li>{{$t('home.test6')}}</li>
						<li>{{$t('home.test7')}}</li>
						<li>{{$t('home.test8')}}</li>
						<li>{{$t('home.test9')}}</li>
                        <li>{{$t('home.test39')}}</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import BoxMinxin from '../minxin/minxin';
export default {
	name: 'ReceiveResult',
	data() {
		return {
			pageType: 'sucess',//sucess,fail
			// leftTimes: 10, //剩余次数
			publicPath: process.env.BASE_URL,
		}
	},
    mixins: [BoxMinxin],
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
				i18Text: 'home.test27',
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
        goHooSpot() {
            window.open('https://hoo.co/mobile/tips?lang=en',"_blank");
        },
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mobile-receive-result {
	background: #303030;
	width: 100%;
	padding-top: 1.2rem;
	padding-bottom: 1.2rem;
	height: calc(100vh - 2.4rem);
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
	.receive-result {
		margin: 0 auto;
		background: #303030;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		.result-container {
			margin: 0 auto;
			width: 6.7rem;
			max-height: 9rem;
			overflow-y: scroll;
			background: #232323;
			border-radius: 0.12rem;
			padding-top: 0.6rem;
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
				.button-container {
                    margin: 0.6rem auto;
                    height: 0.8rem;
					line-height: 0.8rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-left: 0.36rem;
				    padding-right: 0.36rem;
                    &.double-button{
                        display: flex;
                        justify-content: space-between !important;
                        align-items: center;
                    }
					.copy-button {
						min-width: 2.8rem;
						max-width: 4.6rem;
						height: 0.8rem;
						line-height: 0.8rem;
						border: 1px solid #0ecda9;
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
						border-radius: 0.08rem;
						text-align: center;
						font-size: 0.3rem;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #ffffff;
						cursor: pointer;
					}
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
}
</style>
