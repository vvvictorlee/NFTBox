<template>
	<div class="pc-home">
		<loading-tip v-show="loadingTips"></loading-tip>
		<div class="language-top">
			<div class="language-container">
				<language-pc></language-pc>
			</div>
		</div>
		<div class="home">
			<div class="right-x-bg"></div>
			<div class="left-x-bg"></div>
			<div class="hsc-logo"></div>
			<div class="pc-banner-container">
				<div class="banner_title" @click="sendTransaction">
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
								<span>{{$t('home.test1')}}</span>
								<span v-for="(ele,index) in (getBannerList[caclCurrent] && getBannerList[caclCurrent].tokens || [])" :key="index + 'tokens'">{{`${index == 0 ? '' : '、'} ${ele.symbol}`}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="account-container">
				<div class="account-addr-container">
					<div class="account-addr" v-if="clientAccount">{{clientAccount | formatAccount}}</div>
					<div class="account-addr" v-if="!clientAccount" @click="connectWallet">Connect</div>
				</div>
                <div class="account-tips">{{`Balance: ${clientBalance} ${balanceTokenName}`}}</div>
			</div>
			<div class="button-container">
				<div class="check-button">{{$t('home.test2')}}</div>
				<div class="caim-button" @click="receiveNftBox">{{$t('home.test3')}}</div>
				<div class="open-button" @click="clickMyBoxes">{{$t('home.test4')}}</div>
			</div>
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
								{{clientAccount | formatAccount}}
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
						<div class="box-container"  v-if="hasBoxList">
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
import BoxDialog from './BoxDialog';
import MultInput from './MultInput';
// const Web3 = require('web3');
// import MetaMaskOnboarding from '@metamask/onboarding';
import BoxMinxin from '../minxin/minxin';
import LanguagePc from '../../components/LanguagePc';
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
		'language-pc': LanguagePc,
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
			let signData = that.transfer('0xf794916AE805AD50dBcDd544d2DB0116C0E31557', '0x187E9C0A52742604690eD1647E130e7616146b08', '0.01');
			signData.then(res => { console.log(res) });
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pc-home {
	width: 100%;
	min-width: 800px;
	padding-top: 20px;
	padding-bottom: 140px;
	background: #232323;
	.language-top {
		height: 34px;
		width: 100%;
		position: relative;
		cursor: pointer;
		.language-container {
			position: absolute;
			top: 0;
			right: 20px;
			z-index: 999;
			width: 120px;
			height: 34px;
			border-radius: 20px;
			border: 2px solid rgba(255, 255, 255, 0.2);
		}
	}
	.home {
		min-height: 600px;
		padding-top: 40px;
		margin: 20px auto 0 auto;
		width: 655px;
		background: #303030;
		position: relative;
		border-radius: 4px;
		.left-x-bg {
			position: absolute;
			top: 40px;
			left: 0;
			width: 350px;
			height: 350px;
			background: url("../../assets/image/x-bg.png") no-repeat;
			background-size: 100% 100%;
		}
		.right-x-bg {
			position: absolute;
			top: 0;
			right: 0;
			width: 350px;
			height: 350px;
			background: url("../../assets/image/x-bg.png") no-repeat;
			background-size: 100% 100%;
		}
	}
}

.hsc-logo {
	margin-left: 20px;
	height: 23px;
	width: 264px;
	background: url("../../assets/image/logo.png") no-repeat;
	background-size: 100% 100%;
}
.pc-banner-container {
	min-height: 240px;
	padding: 40px 40px 20px 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	.banner_title {
		height: 190px;
		width: 250px;
		background: url("../../assets/image/banner_title.png") no-repeat;
		background-size: 100% 100%;
		.banner-flag {
			position: absolute;
			top: -40px;
			right: 20px;
			height: 87px;
			width: 84px;
			background: url("../../assets/image/banner_flag.png") no-repeat;
			background-size: 100% 100%;
		}
	}
	.swapper-container {
		height: 200px;
		width: 300px;
		position: relative;
		.right-flag {
			position: absolute;
			bottom: -40px;
			right: -40px;
			height: 102px;
			width: 102px;
			background: url("../../assets/image/right_icon.png") no-repeat;
			background-size: 100% 100%;
		}
		.swapper-content {
			height: 250px;
			width: 300px;
			position: relative;
			.right-text {
				position: absolute;
				bottom: -20px;
				right: 0;
				text-align: right;
				padding-right: 10px;
				color: #ffffff;
			}
		}
	}
}
.account-container {
	margin-top: 40px;
	padding-left: 40px;
	padding-right: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-family: PingFangSC-Regular, PingFang SC;
	font-size: 18px;
	font-weight: 500;
	.account-addr-container {
		cursor: pointer;
		padding-left: 20px;
		padding-right: 20px;
        width: 240px;
		height: 40px;
		border-radius: 20px;
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
        width: 240px;
        padding-left: 20px;
		padding-right: 20px;
		height: 40px;
        line-height: 40px;
		border-radius: 20px;
        background-color: #05f6ea;
		transition: background-color 0.2s ease 0s, opacity 0.2s ease 0s;
        overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.swipe-img-item {
	height: 200px;
	width: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		display: block;
		height: 180px;
		width: 180px;
	}
}
.button-container {
	height: 100px;
	padding-left: 40px;
	padding-right: 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-align: center;
	.check-button {
		height: 40px;
		line-height: 40px;
		width: 140px;
		border: 1px solid #ffffff;
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #ffffff;
		cursor: pointer;
	}
	.caim-button {
		height: 40px;
		line-height: 40px;
		width: 140px;
		border: 1px solid #0ecda9;
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #0ecda9;
		cursor: pointer;
	}
	.open-button {
		width: 240px;
		height: 40px;
		line-height: 40px;
		background: linear-gradient(270deg, #05f6ea 0%, #02ead0 100%);
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #232323;
		text-align: center;
		cursor: pointer;
	}
}

.tips-area {
	padding: 40px;
	.tips-title {
		height: 22px;
		line-height: 22px;
		font-size: 24px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #ffffff;
		text-align: left;
	}
	ul {
		padding-top: 20px;
		text-align: left;
		li {
			margin-top: 10px;
			font-size: 12px;
			font-family: PingFangSC-Light, PingFang SC;
			font-weight: 300;
			color: #ffffff;
			line-height: 14px;
		}
	}
}
.receive-nft-box {
	padding: 30px 20px 20px 20px;
	.receive-title {
		font-size: 18px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 500;
		color: #232323;
		text-align: left;
	}
	.receive-addr {
		margin-top: 18px;
		height: 40px;
		line-height: 40px;
		border: 1px solid #c1c1c1;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 10px;
		padding-right: 10px;
		&:hover {
			border: 1px solid #02ead0 !important;
		}
		.addr-lable {
			width: 80px;
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #c1c1c1;
		}
		.addr-input {
			width: 320px;
			height: 40px;
			font-size: 18px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #232323;
			input {
				height: 40px;
				width: 300px;
				background: none;
				outline: none;
				border: 0;
				font-size: 18px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #232323;
				cursor: default;
			}
		}
	}
	.addr-submit-button {
		margin-top: 40px;
		height: 40px;
		line-height: 40px;
		background: #02ead0;
		font-size: 24px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #232323;
		text-align: center;
		border-radius: 10px;
		cursor: pointer;
	}
}
.open-nft-title {
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	border-radius: 12px;
	.right-icon {
		width: 3px;
		height: 15px;
		background: #0ecda9;
		margin-right: 20px;
	}
	.title-text {
		font-size: 15px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 500;
		color: #ffffff;
	}
}
.open-nft-box {
	padding: 20px 40px 40px 40px;
	.box-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		width: 520px;
		max-height: 360px;
		overflow-y: auto;
		.box-item-container {
			margin-bottom: 20px;
			margin-left: 40px;
			&:nth-child(3n + 1) {
				margin-left: 0 !important;
			}
			.box-item {
				width: 140px;
				height: 157px;
				border-radius: 14px;
				background: #222626;
				border: 2px solid #222626;
				cursor: pointer;
				overflow: hidden;
				&:hover {
					border: 2px solid #0ecda9;
				}
				&.active-item {
					border: 2px solid #0ecda9;
				}
				.img-container {
					margin: 20px auto;
					height: 86px;
					width: 110px;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						display: block;
						height: 85px;
						width: 85px;
					}
				}
				.img-name {
					height: 28px;
					line-height: 28px;
					font-size: 15px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #05f6e8;
				}
			}
		}
	}
	.nodata-container {
		width: 520px;
		min-height: 200px;
		.no-data-icon {
			width: 88px;
			height: 76px;
			margin: 80px auto 40px auto;
			background: url("../../assets/image/no-data-new.svg")
				no-repeat;
			background-size: 100% 100%;
		}
        .no-data-text{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 500;
            color: #ccc;
        }
	}
	.open-submit-button {
		margin-top: 34px;
		height: 50px;
		line-height: 50px;
		background: #02ead0;
		font-size: 18px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #232323;
		text-align: center;
		border-radius: 8px;
		cursor: pointer;
	}
}
</style>
