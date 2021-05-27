<template>
	<div class="mobile-home">
		<loading-tip v-show="loadingTips"></loading-tip>
		<div class="language-top">
			<div class="language-container">
				<language-mobile></language-mobile>
			</div>
		</div>
		<div class="home">
			<div class="right-x-bg"></div>
			<div class="left-x-bg"></div>
			<div class="hsc-logo"></div>
			<div class="banner_title">
				<div class="banner-flag"></div>
			</div>
			<div class="swapper-container">
				<div class="right-flag"></div>
				<div class="swapper-content">
					<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" @change="onChange">
						<van-swipe-item v-for="(item,index) in getBannerList" :key="index + 'swipitem'">
							<div class="swipe-img-item">
								<img v-lazy="publicPath + item.imgurl" />
							</div>
						</van-swipe-item>
					</van-swipe>
					<div class="right-text">
						<div class="right-title">{{$t((getBannerList[caclCurrent] && getBannerList[caclCurrent].i18Text)) || (getBannerList[caclCurrent] && getBannerList[caclCurrent].name)}}</div>
						<div class="right-summary">
							<div class="summary-text1">{{$t('home.test1')}}</div>
							<div class="summary-text2">
								<span v-for="(ele,index) in (getBannerList[caclCurrent] && getBannerList[caclCurrent].tokens || [])" :key="index + 'tokens'">{{`${index == 0 ? '' : '、'} ${ele.symbol}`}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="account-container">
				<div class="account-addr-container">
					<div class="account-addr" v-if="clientAccount">{{clientAccount | formatAccountMobile}}</div>
					<div class="account-addr" v-if="!clientAccount" @click="connectWallet">Connect</div>
				</div>
				<div class="account-tips">{{`Balance: ${clientBalance} ${balanceTokenName}`}}</div>
			</div>
			<div class="button-container">
				<div class="check-button">{{$t('home.test2')}}</div>
				<div class="caim-button" @click="receiveNftBox">{{$t('home.test3')}}</div>
			</div>
			<div class="open-button" @click="clickMyBoxes">{{$t('home.test4')}}</div>
			<div class="tips-area">
				<div class="tips-title">{{$t('home.test5')}}</div>
				<ul>
					<li>{{$t('home.test6')}}</li>
					<li>{{$t('home.test7')}}</li>
					<li>{{$t('home.test8')}}</li>
					<li>{{$t('home.test9')}}</li>
				</ul>
			</div>
			<!-- 领取盲盒 -->
			<nft-dialog ref="receiveDailog">
				<template slot="dcontent">
					<div class="receive-nft-box">
						<div class="receive-title">{{$t('home.test10')}}</div>
						<div class="receive-addr">
							<div class="addr-input">
								<!-- <input type="text" v-model="inputAddr"> -->
								{{clientAccount | formatAccountMobile}}
							</div>
							<div class="addr-lable">{{$t('home.test11')}}</div>
						</div>
						<div class="addr-submit-button" @click="receiveSubmit">{{$t('home.test12')}}</div>
					</div>
				</template>
			</nft-dialog>
			<!-- 我的宝库 -->
			<box-dialog ref="openDailog">
				<template slot="dtitle">
					<div class="open-nft-title">
						<div class="right-icon"></div>
						<div class="title-text">{{$t('home.test13')}}</div>
					</div>
				</template>
				<template slot="dcontent">
					<div class="open-nft-box">
						<div class="box-container" v-if="hasBoxList">
							<div class="box-item-container" v-for="(item,index) in getMyboxList" :key="index + 'myboxs'">
								<div class="box-item" :class="[item.is_active ? 'active-item' : '']" @click.stop="selectBox(item,index)">
									<div class="img-container">
										<img v-lazy="publicPath + item.imgurl" />
									</div>
									<div class="img-name">{{$t(item.i18Text)}}</div>
								</div>
							</div>
						</div>
						<div class="nodata-container" v-if="!hasBoxList">
							<div class="no-data-icon"></div>
							<div class="no-data-text">no data...</div>
						</div>
						<div class="open-submit-button" @click="openSubmit">{{$t('home.test14')}}</div>
					</div>
				</template>
			</box-dialog>
		</div>
	</div>
</template>

<script>
import NftDialog from './NftDialog';
import MultInput from './MultInput';
import BoxDialog from './BoxDialog';
// import MetaMaskOnboarding from '@metamask/onboarding';
import BoxMinxin from '../minxin/minxin';
import LanguageMobile from '../../components/LanguageMobile';
export default {
	name: 'Home',
	data() {
		return {
			inputAddr: '',
			//单抽 single 多抽 multiple
			openActiveTab: 'single',
			//私钥列表
			privateKeyList: [],
			//私钥列表长度
			privateKeyLenght: 1,
		}
	},
	mixins: [BoxMinxin],
	components: {
		'nft-dialog': NftDialog,
		'mult-input': MultInput,
		'box-dialog': BoxDialog,
		'language-mobile': LanguageMobile,
	},
	created() {
		this.initBannerList();
	},
	mounted() {
		this.connectWallet();
	},
	methods: {
		//领取盲盒
		receiveNftBox() {
			let that = this;
			if (!that.isConnected) {
				that.$Toast('please connect wallet');
				return;
			}
			that.$refs['receiveDailog'].openDialog();
		},
		//我的盲盒
		clickMyBoxes() {
			let that = this;
			if (!that.isConnected) {
				that.$Toast('please connect wallet');
				return;
			}
			//获取我的盲盒list
			that.handleMyBoxes();
			//打开弹窗
			that.$refs['openDailog'].openDialog();
		},
		//切换tab
		exchangeTab(type) {
			let that = this;
			if (that.openActiveTab == type) {
				return;
			}
			that.openActiveTab = type;
			//清楚输入框数据
			if (that.openActiveTab == 'single') {
				that.clearInputText('single');
			} else {
				that.clearInputText('multiple');
			}

		},
		//清楚输入框数据
		clearInputText(type) {
			let that = this;
			if (type == 'single') {
				that.$refs['privateKeySingle'] && that.$refs['privateKeySingle'].clearInputText();
			} else {
				for (let i = 0; i < that.privateKeyLenght; i++) {
					let refsName = 'privateKeyMult' + i;
					// console.log(refsName);
					that.$refs[refsName] && that.$refs[refsName][0] && that.$refs[refsName][0].clearInputText();
				}
			}
		},
		//增加输入框
		addInput() {
			if (this.privateKeyLenght == 10) {
				return;
			}
			this.privateKeyLenght++;
		},

		//领取盲盒
		receiveSubmit() {
			let that = this;
			that.clickReceive();
		},
		// ********************** 链上操作 *********************** //
		async transfer(fromAccount, to, value) {
			let that = this;
			let unsigned = {
				from: fromAccount,
				to: to,
				value: that.web3Client.utils.numberToHex(that.web3Client.utils.toWei(value, 'ether')),
			}

			let signed = await that.web3Client.eth.sendTransaction(unsigned);
			return signed
		},

		sendTransaction() {
			let that = this;
			console.log(that.clientAccount);
			let signData = that.transfer('0xf7949...E805AD50....d544d2DB0116C0E31557', '0x187E9C0A52742...690eD1647E130e...16146b08', '0.01');
			signData.then(res => { console.log(res) });
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mobile-home {
	padding-top: 0.4rem;
	background: #232323;
	min-height: 100vh;
	width: 100%;
	.language-top {
		margin: 0 auto;
		height: 0.6rem;
		width: 7.5rem;
		position: relative;
		cursor: pointer;
		.language-container {
			position: absolute;
			top: 0;
			right: 0.4rem;
			z-index: 999;
			width: 2rem;
			height: 0.6rem;
			border-radius: 0.3rem;
			border: 2px solid rgba(255, 255, 255, 0.2);
		}
	}
	.home {
		margin: 0 auto;
		padding-top: 0.8rem;
		width: 7.5rem;
		position: relative;
		.left-x-bg {
			position: absolute;
			top: 4.78rem;
			left: 0;
			width: 3.5rem;
			height: 7.64rem;
			background: url("../../assets/image/x-bg.png") no-repeat;
			background-size: 100% 100%;
		}
		.right-x-bg {
			position: absolute;
			top: 0;
			right: 0;
			width: 3.5rem;
			height: 7.64rem;
			background: url("../../assets/image/x-bg.png") no-repeat;
			background-size: 100% 100%;
		}
	}
}

.hsc-logo {
	height: 0.46rem;
	width: 5.28rem;
	margin: 0 auto;
	background: url("../../assets/image/logo.png") no-repeat;
	background-size: 100% 100%;
}
.banner_title {
	height: 3.86rem;
	width: 5rem;
	margin: 0.4rem 1.74rem 0 0.76rem;
	background: url("../../assets/image/banner_title.png") no-repeat;
	background-size: 100% 100%;
	position: relative;
}
.banner-flag {
	position: absolute;
	bottom: 0.2rem;
	right: -3rem;
	height: 1.75rem;
	width: 1.68rem;
	margin: 0.4rem 1.74rem 0 0.76rem;
	background: url("../../assets/image/banner_flag.png") no-repeat;
	background-size: 100% 100%;
}
.swapper-container {
	height: 5rem;
	width: 7.5rem;
	position: relative;
	.right-flag {
		position: absolute;
		bottom: 0.8rem;
		right: 0;
		height: 2.04rem;
		width: 2.04rem;
		background: url("../../assets/image/right_icon.png") no-repeat;
		background-size: 100% 100%;
	}
	.swapper-content {
		height: 5rem;
		width: 7.5rem;
		position: relative;
		.right-text {
			position: absolute;
			bottom: -0.4rem;
			right: 0;
			text-align: right;
			padding-right: 0.6rem;
			color: #ffffff;
			.right-summary {
				margin-top: 0.2rem;
				.summary-text2 {
					margin-top: 0.1rem;
				}
			}
		}
	}
}
.account-container {
	// padding-left: 0.76rem;
	// padding-right: 0.76rem;
	// width: 4.48rem;
	margin: 0.8rem auto 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	font-family: PingFangSC-Regular, PingFang SC;
	font-size: 0.3rem;
	font-weight: 600;
	.account-addr-container {
		cursor: pointer;
		padding-left: 0.4rem;
		padding-right: 0.4rem;
		width: 4rem;
		height: 0.8rem;
		border-radius: 0.4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #000;
		background-color: #05f6ea;
		transition: background-color 0.2s ease 0s, opacity 0.2s ease 0s;
		.account-addr {
			margin-left: 0;
		}
	}
	.account-tips {
		margin-top: 0.2rem;
		height: 0.8rem;
		width: 4rem;
		padding-left: 0.4rem;
		padding-right: 0.4rem;
		line-height: 0.8rem;
		border-radius: 0.4rem;
		background-color: #05f6ea;
		transition: background-color 0.2s ease 0s, opacity 0.2s ease 0s;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.swipe-img-item {
	height: 4.5rem;
	width: 7.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		display: block;
		height: 3.8rem;
		width: 3.8rem;
		margin-right: 1rem;
	}
}
.custom-indicator {
	position: absolute;
	right: 1rem;
	bottom: 0.1rem;
	font-size: 0.12rem;
	color: #ffffff;
	background: rgba(0, 0, 0, 0.1);
}
.button-container {
	height: 1.8rem;
	padding-left: 0.76rem;
	padding-right: 0.76rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-align: center;
	.check-button {
		height: 1rem;
		line-height: 1rem;
		width: 2.8rem;
		border: 1px solid #ffffff;
		font-size: 0.3rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #ffffff;
		cursor: pointer;
	}
	.caim-button {
		height: 1rem;
		line-height: 1rem;
		width: 2.8rem;
		border: 1px solid #0ecda9;
		font-size: 0.3rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #0ecda9;
		cursor: pointer;
	}
}
.open-button {
	margin: 0 auto;
	width: 6rem;
	height: 1rem;
	line-height: 1rem;
	background: linear-gradient(270deg, #05f6ea 0%, #02ead0 100%);
	font-size: 0.3rem;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #232323;
	text-align: center;
	cursor: pointer;
}
.tips-area {
	padding-left: 0.76rem;
	padding-right: 0.76rem;
	padding-bottom: 0.76rem;
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
.receive-nft-box {
	padding: 0.6rem 0.4rem 0.4rem 0.4rem;
	.receive-title {
		font-size: 0.3rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #232323;
		text-align: left;
	}
	.receive-addr {
		margin-top: 0.36rem;
		height: 0.8rem;
		border: 1px solid #c1c1c1;
		border-radius: 0.1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 0.2rem;
		padding-right: 0.2rem;
		&:hover {
			border: 1px solid #02ead0 !important;
		}
		.addr-lable {
			min-width: 0.56rem;
			height: 0.4rem;
			font-size: 0.28rem;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #c1c1c1;
		}
		.addr-input {
			width: 4rem;
			height: 0.64rem;
			line-height: 0.64rem;
			font-size: 0.28rem;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #232323;
			input {
				height: 0.64rem;
				line-height: 0.64rem;
				width: 4rem;
				background: none;
				outline: none;
				border: 0;
				font-size: 0.28rem;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 600;
				color: #232323;
				cursor: default;
			}
		}
	}
	.addr-submit-button {
		margin-top: 0.34rem;
		width: 5.2rem;
		height: 0.8rem;
		line-height: 0.8rem;
		background: #02ead0;
		font-size: 0.3rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #232323;
		text-align: center;
		border-radius: 0.1rem;
	}
}
.open-nft-title {
	height: 1.2rem;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	border-radius: 0.12rem;
	.right-icon {
		width: 0.06rem;
		height: 0.3rem;
		background: #0ecda9;
		margin-right: 0.3rem;
	}
	.title-text {
		font-size: 0.36rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 600;
		color: #02ead0;
	}
}
.open-nft-box {
	padding: 0.2rem 0.4rem 0.6rem 0.4rem;
	.box-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		width: 5.2rem;
		height: 6.4rem;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		.box-item-container {
			margin-bottom: 0.2rem;
			margin-left: 0.3rem;
			&:nth-child(2n + 1) {
				margin-left: 0 !important;
			}
			.box-item {
				width: 2.4rem;
				min-height: 2rem;
				padding-top: 0.2rem;
				padding-bottom: 0.2rem;
				border-radius: 14px;
				background: #222626;
				border: 0.02rem solid #222626;
				cursor: pointer;
				overflow: hidden;
				&:hover {
					border: 0.02rem solid #0ecda9;
				}
				&.active-item {
					border: 0.02rem solid #0ecda9;
				}
				.img-container {
					margin: 0 auto;
					height: 2rem;
					width: 2.2rem;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						display: block;
						height: 1.9rem;
						width: 1.9rem;
					}
				}
				.img-name {
					margin-top: 0.18rem;
					height: 0.4rem;
					line-height: 0.4rem;
					font-size: 0.3rem;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #05f6e8;
				}
			}
		}
	}
	.nodata-container {
		width: 5.2rem;
		min-height: 2.4rem;
		.no-data-icon {
			width: 1.4rem;
			height: 1.2rem;
			margin: 0.4rem auto 0.3rem auto;
			background: url("../../assets/image/no-data-new.svg") no-repeat;
			background-size: 100% 100%;
		}
		.no-data-text {
			font-size: 0.3rem;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 600;
			color: #ccc;
		}
	}
	.open-submit-button {
		margin-top: 0.4rem;
		width: 5.2rem;
		height: 0.8rem;
		line-height: 0.8rem;
		background: #02ead0;
		font-size: 0.3rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #232323;
		text-align: center;
		border-radius: 0.1rem;
	}
}
</style>
