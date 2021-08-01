<template>
	<div class="home">
		<loading-tips v-if="loadingTips"></loading-tips>
		<div class="home-container">
			<div class="home-card"></div>
			<div class="card-title">
				<div class="title-text">{{$t('home.test5')}}</div>
				<div class="title-flag-container" v-if="isChinese">
					<div class="flag-up">
						<div class="icon"></div>
						<div class="text">{{$t('home.test6')}}</div>
					</div>
					<div class="flag-down">
						<div class="text">{{$t('home.test7')}}</div>
					</div>
				</div>
			</div>
			<div class="card-status-container">
				<div class="card-status">{{overFlag ? $t('home.test8') : $t('home.test9')}}</div>
			</div>
			<div class="tips-container">
				<div class="tips-text">{{$t('home.test10')}}</div>
			</div>
			<div class="receive-button" @click="clickThrottleReceive">{{$t('home.test11')}}</div>
		</div>
		<div class="join-guide" @click="goGuid">{{$t('home.test26')}}</div>
	</div>
</template>

<script>
import { handleCheck, handleReceive, getGtParams } from '../../http/home';
import NftMinxin from '../minxin/minxin.vue';
export default {
	name: 'Home',
	mixins: [NftMinxin],
	data() {
		return {
			overFlag: false, //30万是否领完
            throttleTimer: null, //timer
		}
	},
	created() {
		this.checkOver();
	},
	methods: {
		goGuid() {
			let openUrl = 'https://www.wolai.com/hoosmartchain/7LkfYZ3LvwN6Pruffk12st?theme=light';
			window.open(openUrl, "_blank");
		},
		//查询是否领取完
		checkOver() {
			let that = this;
			handleCheck().then(res => {
				// console.log(res);
				that.overFlag = res && res.data && res.data.flag;
				// that.overFlag = true;
			}).catch(err => {
				console.log(err);
			});
		},
        //防抖点击按钮
        clickThrottleReceive() {
            let that = this;
            if(that.throttleTimer) {
                return;
            }
            that.throttleTimer = setTimeout(() => {
                that.throttleTimer = null;
                window.clearTimeout(that.throttleTimer);
            },10000);
            that.clickReceive();
        },
		//点击领取按钮
		clickReceive() {
			let that = this;
			that.gtVerify().then(res => {
				if (!res.status && res.code == 10002) {
					return;
				}
				that.requestReceive();
			}).catch(err => {

			});
		},

		//请求后端领取
		requestReceive() {
			let that = this;
			// console.log(that.getClientAccount);
			if (!that.getClientAccount) {
				that.$Toast('please connect wallet');
				return;
			}
			let requestParams = {
				address: that.getClientAccount,
                ip: window.returnCitySN['cip'],
			};
			that.loadingTips = true;
			handleReceive(requestParams).then(res => {
				that.loadingTips = false;
				if (res.code == '10000') {
					that.$Toast(that.$t('home.test12'));
				} else if (res.code == '10001') {
					that.$Toast(that.$t('home.test13'));
				} else if (res.code == '10002') {
					that.$Toast(that.$t('home.test14'));
				} else {
					that.$Toast(that.$t('home.test15'));
				}
			}).catch(err => {
				that.loadingTips = false;
				that.$Toast(that.$t('home.test15'));
			});
		},

		//极验处理
		gtVerify() {
			let that = this;
			const langObj = {
				'zh-hans': "zh-cn",
				'en': "en",
				'ko': "ko"
			}
			return new Promise((resolve, reject) => {
				getGtParams().then(res => {
					console.log(res);
					let data = res || '';
					//级验参数
					let codeParams = {
						product: 'bind',
						https: false,
						success: data.success || '',
						// offline: true,
						gt: data.gt || '',
						challenge: data.challenge || '',
						new_captcha: data.new_captcha || '',
						lang: langObj[that.getLocaleLang],
						width: '4rem'
					};
					window.initGeetest(codeParams, function (captchaObj) {
						console.log(captchaObj);
						captchaObj.onReady(function () {
							captchaObj.verify(); //显示验证码
						}).onSuccess(function () {
							//通过校验
							let data = {
								status: true,
								code: 10001
							}
							resolve(data);

						}).onError(function (err) {
							console.log(err);
						})
						captchaObj.onClose(function () {
							//关闭
							let data = {
								status: false,
								code: 10002
							}
							resolve(data);
						});
					});
				}).catch(err => {
					console.log(err)
				});
			});
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home {
	min-height: 8rem;
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	padding-top: 0.2rem;
	.home-container {
		width: 5.9rem;
		min-height: 8rem;
		padding-top: 0.78rem;
		padding-bottom: 0.64rem;
		background: #ffffff;
		border: 0.04rem solid #278df5;
		box-shadow: 0 0.2rem 0.4rem rgba(39, 141, 245, 0.3);
		border-radius: 0.4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		.home-card {
			height: 5.72rem;
			width: 4.12rem;
			background: url("../../assets/image/home_card1.png") no-repeat;
			background-size: 100% 100%;
		}
		.card-title {
			margin-top: 0.26rem;
			width: 4.12rem;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			.title-text {
				font-size: 0.4rem;
				font-family: PingFang SC;
				font-weight: bold;
				color: #278df5;
				text-align: left;
			}
			.title-flag-container {
				margin-left: 0.12rem;
				display: flex;
				// flex-direction: column;
				align-items: center;
				justify-content: center;
				.flag-up {
					min-width: 0.6rem;
					padding-left: 0.12rem;
					padding-right: 0.12rem;
					height: 0.34rem;
					background: linear-gradient(
						270deg,
						#217af8 0%,
						#449afe 100%
					);
					border-radius: 0.06rem;
					margin-bottom: 0.04rem;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					.icon {
						height: 0.18rem;
						width: 0.13rem;
						background: url("../../assets/image/flash_icon.png")
							no-repeat;
						background-size: 100% 100%;
						margin-right: 0.06rem;
					}
					.text {
						font-size: 0.2rem;
						font-family: PingFang SC;
						font-weight: 400;
						color: #ffffff;
					}
				}
				.flag-down {
					margin-left: 0.14rem;
					min-width: 0.6rem;
					padding-left: 0.12rem;
					padding-right: 0.12rem;
					height: 0.34rem;
					background: #f7ae2f;
					border-radius: 0.06rem;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					.text {
						font-size: 0.2rem;
						font-family: PingFang SC;
						font-weight: 400;
						color: #ffffff;
					}
				}
			}
		}
		.card-status-container {
			margin-top: 0.18rem;
			width: 4.12rem;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			.card-status {
				min-width: 0.6rem;
				padding-left: 0.12rem;
				padding-right: 0.12rem;
				height: 0.34rem;
				line-height: 0.34rem;
				background: #e2fff1;
				border: 1px solid #3ddc8d;
				border-radius: 0.06rem;
				font-size: 0.2rem;
				font-family: PingFang SC;
				font-weight: 400;
				color: #3ddc8d;
			}
		}
		.tips-container {
			margin-top: 0.2rem;
			width: 4.12rem;
			padding: 0.2rem;
			min-height: 0.8rem;
			background: #f9f9fa;
			border-radius: 0.2rem;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			justify-content: flex-start;
			.tips-text {
				width: 4.12rem;
				text-align: left;
				font-size: 0.2rem;
				font-family: PingFang SC;
				font-weight: 400;
				color: #4e4e4e;
			}
			.tips-more {
				min-width: 0.38rem;
				padding-left: 0.12rem;
				padding-right: 0.12rem;
				height: 0.34rem;
				background: #e2f1ff;
				border: 0.01rem solid #278df5;
				border-radius: 0.06rem;
				font-size: 0.2rem;
				font-family: PingFang SC;
				font-weight: 400;
				color: #278df5;
			}
		}
		.receive-button {
			margin-top: 0.3rem;
			width: 3.58rem;
			padding-left: 0.3rem;
			padding-right: 0.3rem;
			height: 0.8rem;
			line-height: 0.8rem;
			background: linear-gradient(90deg, #217af8 0%, #449afe 100%);
			border-radius: 0.4rem;
			font-size: 0.36rem;
			font-family: PingFang SC;
			font-weight: bold;
			color: #ffffff;
			cursor: pointer;
			text-align: center;
		}
	}
	.join-guide {
		padding-top: 0.4rem;
		height: 0.4rem;
		line-height: 0.4rem;
		color: #ffffff;
		cursor: pointer;
		text-align: center;
		// text-decoration: underline;
	}
}
</style>
