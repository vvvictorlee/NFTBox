<template>
	<div class="pc-home">
        <loading-tip v-show="loadingTips"></loading-tip>
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
							<div class="right-title">{{getBannerList[caclCurrent] && getBannerList[caclCurrent].name || ''}}</div>
							<div class="right-summary">
								<span>可开出代币：</span>
								<span v-for="(ele,index) in (getBannerList[caclCurrent] && getBannerList[caclCurrent].tokens || [])" :key="index + 'tokens'">{{`${index == 0 ? '' : '、'} ${ele.symbol}`}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="account-container">
				<!-- <div class="account-tips">{{`Account: `}}</div> -->
				<div class="account-addr-container">
					<div class="account-addr">{{clientAccount | formatAccount}}</div>
                    <!-- <div class="account-addr">Connect</div> -->
				</div>
			</div>
			<div class="button-container">
				<div class="check-button">查看获奖名单</div>
				<div class="caim-button" @click="receiveNftBox">领取盲盒</div>
				<div class="open-button" @click="clickMyBoxes">我的宝库</div>
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
			<!-- 领取盲盒 -->
			<nft-dialog ref="receiveDailog">
				<template slot="dcontent">
					<div class="receive-nft-box">
						<div class="receive-title">您的地址，领取盲盒：</div>
						<div class="receive-addr">
							<div class="addr-input">
								<!-- <input type="text" v-model="inputAddr"> -->
								{{clientAccount | formatAccount}}
							</div>
							<div class="addr-lable">粘贴</div>
						</div>
						<div class="addr-submit-button" @click="receiveSubmit">提交</div>
					</div>
				</template>
			</nft-dialog>
			<!-- 我的宝库 -->
			<box-dialog ref="openDailog">
				<template slot="dtitle">
					<div class="open-nft-title">
						<div class="right-icon"></div>
						<div class="title-text">我的宝库</div>
					</div>
				</template>
				<template slot="dcontent">
					<div class="open-nft-box">
						<div class="box-container">
							<div class="box-item-container" v-for="(item,index) in getMyboxList" :key="index + 'myboxs'">
								<div class="box-item" :class="[item.is_active ? 'active-item' : '']" @click.stop="selectBox(item,index)">
									<div class="img-container">
										<img v-lazy="publicPath + item.imgurl" />
									</div>
									<div class="img-name">{{item.name}}</div>
								</div>
							</div>
						</div>
						<div class="open-submit-button" @click="openSubmit">立即开启</div>
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
const Web3 = require('web3');
// import MetaMaskOnboarding from '@metamask/onboarding';

import BoxMinxin from '../minxin/minxin';
import LoadingTip from '../../components/LoadingTip.vue';
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
		'box-dialog': BoxDialog
	},
	created() {
		this.setBannerList();
	},
	async mounted() {
		let that = this;

		// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
		// console.log('----account----', web3.eth.accounts)

		let web3Provider = "";
		console.log(window.ethereum);
		if (window.ethereum) {
			web3Provider = window.ethereum;
			try {
				// 请求用户授权
				await window.ethereum.enable().then(accounts => {
					console.log('---metamask----', accounts);
				});
			} catch (error) {
				// 用户不授权时
				console.error("User denied account access")
			}
		} else if (window.web3) {   // 老版 MetaMask Legacy dapp browsers...
			web3Provider = window.web3.currentProvider;
		} else {
			web3Provider = new Web3.providers.HttpProvider('https://http-mainnet.hoosmartchain.com');
		}
		// web3Provider = new Web3.providers.HttpProvider('https://http-mainnet.hoosmartchain.com');
		let web3Client = new Web3(web3Provider);
		console.log('----web3Obj----', web3Client);
		that.web3Client = web3Client;

		await web3Client.eth.getAccounts((error, result) => {
			if (!error) {
				console.log(result);
				that.clientAccount = result[0];
			} else {
				console.log(error);
			}
		});

		// console.log(that.clientAccount);
		let accounts = await web3Client.eth.getAccounts();
		console.log('---defaultAccount---', accounts);

		let balance = await web3Client.eth.getBalance(that.clientAccount);
		let initBalance = web3Client.utils.fromWei(balance);
		console.log('---number balance---', initBalance);
		// console.log(balance.toNumber());

		window.ethereum.on('accountsChanged', function (accounts) {
			// Time to reload your interface with accounts[0]!
			console.log('---accountsChanged-----');
		});
		let currentChainId = null
		console.log('---isconnected-----', window.ethereum.isConnected())

		window.ethereum.on('chainChanged', (chainId) => {
			// Handle the new chain.
			// Correctly handling chain changes can be complicated.
			// We recommend reloading the page unless you have good reason not to.
			window.location.reload();
		});

		// window.ethereum.request({
		// 	method: 'wallet_requestPermissions',
		// 	params: [{ eth_accounts: {} }],
		// }).then((permissions) => {
		// 	const accountsPermission = permissions.find(
		// 		(permission) => permission.parentCapability === 'eth_accounts'
		// 	);
		// 	if (accountsPermission) {
		// 		console.log('eth_accounts permission successfully requested!');
		// 	}
		// }).catch((error) => {
		// 	if (error.code === 4001) {
		// 		// EIP-1193 userRejectedRequest error
		// 		console.log('Permissions needed to continue.');
		// 	} else {
		// 		console.error(error);
		// 	}
		// });

		// let tempdata = await ethereum.request({ method: 'eth_requestAccounts' });
		// console.log(tempdata);

		// window.ethereum.request({
		// 	method: 'wallet_requestPermissions',
		// 	params: [{ eth_accounts: {} }],
		// }).then((permissions) => {
		// 	const accountsPermission = permissions.find(
		// 		(permission) => permission.parentCapability === 'eth_accounts'
		// 	);
		// 	if (accountsPermission) {
		// 		console.log('eth_accounts permission successfully requested!');
		// 	}
		// }).catch((error) => {
		// 	if (error.code === 4001) {
		// 		// EIP-1193 userRejectedRequest error
		// 		console.log('Permissions needed to continue.');
		// 	} else {
		// 		console.error(error);
		// 	}
		// });

		// first argument is web3.sha3("xyz")
		// let result = web3.eth.sign('0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49',that.clientAccount,function(signTxt){
		//     console.log(signTxt);
		// });

		//console.log(web3Client.utils.utf8ToHex("Hello world"));
		//web3Client.eth.sign("Hello world", that.clientAccount).then(console.log);

	},
	methods: {
		//领取盲盒
		receiveNftBox() {
			let that = this;
			that.$refs['receiveDailog'].openDialog();
		},
		//我的盲盒
		clickMyBoxes() {
			let that = this;
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
		async getChainId() {
			const web3 = new Web3('https://http-mainnet.hoosmartchain.com')
			let chainId = await web3.eth.getChainId()
			console.log(`chain id: ${chainId}`)
			return chainId
		},
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
	padding-top: 100px;
	padding-bottom: 140px;
	background: #232323;
	.home {
		min-height: 600px;
		padding-top: 40px;
		margin: 0 auto;
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
    margin-left: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	font-family: inherit;
	font-size: 18px;
	font-weight: 500;
	.account-tips {
		font-size: 28px;
	}
    .account-addr-container {
        cursor: pointer;
        padding-left: 20px;
	    padding-right: 20px;
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
}
.swipe-img-item {
	height: 200px;
	width: 300px;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		display: block;
		height: 190px;
		width: 244px;
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
		max-height: 540px;
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
						height: 100%;
						width: 100%;
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
	.open-submit-button {
		margin-top: 34px;
		height: 60px;
		line-height: 60px;
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
