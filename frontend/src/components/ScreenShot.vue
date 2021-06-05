<template>
	<div class="nft-dialog">
		<van-overlay :show="dialogShow" :lock-scroll="false" @click="dialogShow = false">
			<div class="nft-wrapper">
				<div class="nft-block">
					<!-- <div class="cancle-button" @click.stop="dialogShow = false">
						<van-icon name="cross" color="#000" size="18" />
					</div> -->
					<div id="screen-shot" class="screen-shot-container">
						<div class="block-content">
							<div class="home">
								<!-- <div class="right-x-bg"></div>
								<div class="left-x-bg"></div> -->
								<div class="hsc-logo"></div>
								<div :class="computedBannerLogo">
									<div class="banner-flag"></div>
								</div>
								<div class="swapper-container">
									<div class="right-flag"></div>
									<div class="swapper-content">
										<div class="swipe-img-item">
											<img :src="publicPath + 'image/gold_box.png'" />
										</div>
									</div>
								</div>
								<div class="open-tips">{{`${$t('home.test32')} ${boxText} ${$t('home.test33')}`}}</div>
								<div class="tokens-container">
									<div class="second-text1" v-for="(item,index) in tokens" :key="index + 'tokens'">
										<span>{{`${item.symbol} ${item.amount}`}}</span>
									</div>
								</div>
							</div>
							<div class="bottom-tips">
								<div class="tips-text">{{$t('home.test34')}}</div>
								<div class="tips-text">WWW.HOOSMARTCHAIN.COM</div>
							</div>
						</div>
					</div>
					<div class="copy-pic-button" @click.stop="screenShot">{{copyText}}</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
import domtoimage from 'dom-to-image';
import BoxMinxin from '../views/minxin/minxin';
export default {
	name: 'Dialog',
	props: {
		tokens: {
			type: Array,
			default() {
				return []
			}
		},
		boxText: {
			type: String,
			default: 'home.test27',
		},
	},
	mixins: [BoxMinxin],
	data() {
		return {
			dialogShow: false,
			publicPath: process.env.BASE_URL,
			userAgentGlobal: '',
		}
	},
    computed: {
        copyText() {
            let buttonText = this.$t('home.test35');
            buttonText = (this.userAgentGlobal == 'pc' && navigator.clipboard && navigator.clipboard.write) ? this.$t('home.test35') : this.$t('home.test36');
            return buttonText;
        },
    },
    created() {
        let that = this;
		if (navigator.userAgent.match(/(iPhone|iphone|ipad|ipod|iPad|iPod)/i)) {
			that.userAgentGlobal = "iphone";
		} else if (navigator.userAgent.match(/(Android|android)/i)) {
			that.userAgentGlobal = "android";
		} else {
			that.userAgentGlobal = "pc";
		}
		console.log(userAgentGlobal);
		// this.copyText = userAgentGlobal == 'pc' ? this.$t('home.test35') : this.$t('home.test36');
		// console.log(this.copyText);
    },
	mounted() {
        
	},
	methods: {
		//打开弹窗
		openDialog() {
			let that = this;
			that.dialogShow = true;
		},
		//关闭弹窗
		closeDialog() {
			let that = this;
			that.dialogShow = false;
		},
		screenShot() {
			let that = this;
			let node = document.getElementById('screen-shot');
			if (navigator.clipboard && that.userAgentGlobal == 'pc') {
				domtoimage.toBlob(node, {
					height: 770,
					width: 335
				}).then(async function (blob) {
					try {
						await navigator.clipboard.write([
							// eslint-disable-next-line no-undef
							new ClipboardItem({
								[blob.type]: blob,
							}),
						]);
						that.$Toast('Copied');
                        that.closeDialog();
					} catch (error) {
						that.$Toast(error);
                        that.closeDialog();
					}
				}).catch(function (error) {
					console.error('oops, something went wrong!', error);
                    that.closeDialog();
				});
			} else {
                that.$Toast('Use other methods to take screenshots');
                // that.closeDialog();
			}
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.nft-wrapper {
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	-ms-transform: scale(0.94, 0.94); /* IE 9 */
	-webkit-transform: scale(0.94, 0.94); /* Safari */
	transform: scale(0.94, 0.94); /* 标准语法 */
	@media (max-width: 1600px) {
		-ms-transform: scale(0.8, 0.74); /* IE 9 */
		-webkit-transform: scale(0.8, 0.74); /* Safari */
		transform: scale(0.8, 0.74); /* 标准语法 */
	}
	@media (max-width: 700px) {
		-ms-transform: scale(0.8, 0.64); /* IE 9 */
		-webkit-transform: scale(0.8, 0.64); /* Safari */
		transform: scale(0.8, 0.64); /* 标准语法 */
	}
	.nft-block {
		// min-height: 400px;
		// width: 335px;
		// background: #303030;
		position: relative;
		.cancle-button {
			position: absolute;
			top: -14px;
			right: -14px;
			width: 28px;
			height: 28px;
			background: #ccc;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}
		.screen-shot-container {
			width: 335px;
			.block-content {
				width: 335px;
				background: #303030;
				.home {
					margin: 0 auto;
					padding-top: 20px;
					width: 335px;
					position: relative;
					.left-x-bg {
						position: absolute;
						top: 140px;
						left: 0;
						width: 178px;
						height: 360px;
						background: url("../assets/image/x-bg.png") no-repeat;
						background-size: 100% 100%;
					}
					.right-x-bg {
						position: absolute;
						top: -40px;
						right: 0;
						width: 178px;
						height: 360px;
						background: url("../assets/image/x-bg.png") no-repeat;
						background-size: 100% 100%;
					}
				}
			}
		}
	}
}
.hsc-logo {
	// position: absolute;
	// top: 20px;
	// left: 40px;
	height: 23px;
	width: 260px;
	margin: 0 auto;
	background: url("../assets/image/logo.png") no-repeat;
	background-size: 100% 100%;
}
.banner-title-zh-hans {
	height: 190px;
	width: 250px;
	margin: 40px 80px 0 36px;
	background: url("../assets/image/banner_title.png") no-repeat;
	background-size: 100% 100%;
	position: relative;
}
.banner-title-ko {
	height: 190px;
	width: 250px;
	margin: 40px 80px 0 36px;
	background: url("../assets/image/banner_title_ko.png") no-repeat;
	background-size: 100% 100%;
	position: relative;
}
.banner-title-en {
	height: 190px;
	width: 250px;
	margin: 40px 80px 0 36px;
	background: url("../assets/image/banner_title_en.png") no-repeat;
	background-size: 100% 100%;
	position: relative;
}
.banner-flag {
	position: absolute;
	bottom: 0px;
	right: -40px;
	height: 101px;
	width: 101px;
	background: url("../assets/image/banner_flag.png") no-repeat;
	background-size: 100% 100%;
}
.swapper-container {
	margin-top: 10px;
	height: 200px;
	width: 335px;
	position: relative;
	.right-flag {
		position: absolute;
		bottom: 0;
		right: 0;
		height: 101px;
		width: 101px;
		background: url("../assets/image/right_icon.png") no-repeat;
		background-size: 100% 100%;
	}
}
.swipe-img-item {
	height: 200px;
	width: 335px;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		display: block;
		height: 170px;
		width: 170px;
		margin-right: 100px;
	}
}
.open-tips {
	// padding-top: 10px;
	padding-left: 20px;
	text-align: left;
	font-size: 16px;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #ffffff;
}
.tokens-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	padding-left: 20px;
	padding-right: 20px;
	padding-bottom: 20px;
	.second-text1 {
		margin-top: 10px;
		font-size: 18px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #02ead0;
	}
}
.bottom-tips {
	z-index: 9999;
	width: 335px;
	height: 74px;
	background: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.tips-text {
		font-size: 12px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #232323;
	}
}
.copy-pic-button {
	margin: 20px auto 0 auto;
	min-width: 100px;
	padding-left: 20px;
	padding-right: 20px;
	height: 40px;
	line-height: 40px;
	border: 1px solid #0ecda9;
	font-size: 14px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #0ecda9;
	cursor: pointer;
}
</style>
