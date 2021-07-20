/*
 * @ 混入
 * @Date: 2021-05-20 13:38:28 
 * @Last Modified time: 2021-05-20 13:38:53
*/
<template>
	<div class="box-minxin"></div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
const Web3 = require('web3');
import { switchToHSC, switchToTestHSC } from '../config/index';
import LoadingTips from '../../components/LoadingTips.vue';
export default {
	name: 'BoxMinxin',
	data() {
		return {
			publicPath: process.env.BASE_URL,
			clientAccount: '',
			clientBalance: 0,
			web3Client: null,
			chainId: 170,
            loadingTips: false,
		}
	},
	components: {
		'loading-tips': LoadingTips,
	},
	computed: {
		...mapGetters({
            getLocaleLang: "getLocaleLang",
            getClientAccount: "getClientAccount",
		}),
		isConnected() {
			let flag = !!this.clientAccount;
			return flag;
		},
        isChinese(){
            let flag = this.getLocaleLang == 'zh-hans' ? true : false;
            return flag;
        },
	},
	filters: {
		formatAccount(account) {
			if (!account) {
				return '';
			}
			let len = 10;
			return `${account.substring(0, len)}...${account.substring(42 - len)}`
		},
		formatAccountMobile(account) {
			if (!account) {
				return '';
			}
			let len = 6;
			return `${account.substring(0, len)}...${account.substring(42 - len)}`
		},
	},
	methods: {
         ...mapActions({
			setClientAccount: "setClientAccount",
		}),

		// ********************** 连接链上操作 *********************** //

		async connectWallet() {
			let that = this;
			let web3Provider = "";
			// console.log(window.ethereum);
			if (window.ethereum) {
				web3Provider = window.ethereum;
				try {
					// 请求用户授权
					await window.ethereum.enable().then(accounts => {
						// console.log('---metamask----', accounts);
					});
				} catch (error) {
					// 用户不授权时
					console.error("User denied account access");
					that.$Toast("User denied account access");
				}
			} else if (window.web3) {   // 老版 MetaMask Legacy dapp browsers...
				web3Provider = window.web3.currentProvider;
			} else {
				// web3Provider = new Web3.providers.HttpProvider('https://http-mainnet.hoosmartchain.com');
			}
			let web3Client = new Web3(web3Provider);
			// console.log('----web3Obj----', web3Client);
			that.web3Client = web3Client;

			//获取主网id
			that.getChainId();

			//获取账户和余额
			that.getAccount();

			window.ethereum.on('accountsChanged', function (accounts) {
				// Time to reload your interface with accounts[0]!
				// console.log('---accountsChanged-----');
				that.getAccount();
			});
			let currentChainId = null
			// console.log('---isconnected-----', window.ethereum.isConnected())

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
		//获取账户
		async getAccount() {
			let that = this;
			if (!that.web3Client) {
				return;
			}
			// console.log(switchToHSC);
            let chainId = await that.web3Client.eth.getChainId();
			await that.web3Client.eth.getAccounts((error, result) => {
				if (!error) {
					// console.log(result);
					that.clientAccount = result[0];
					window.ethereum.request({
						method: "wallet_addEthereumChain",
						params: [switchToHSC, that.clientAccount]
					}).then(res => {
                        // console.log(res);
                        if(!(chainId == 170 || chainId == 70)) {
                            window.location.reload();
                        }
                        // window.location.reload();
                    }).catch((error) => console.log(error.message));
                    that.setClientAccount(that.clientAccount);
				} else {
					console.log(error);
				}
			});
			that.getBalance();
		},
		//获取账户余额
		async getBalance() {
			let that = this;
			if (!that.clientAccount || !that.web3Client) {
				return;
			}
			let balance = await that.web3Client.eth.getBalance(that.clientAccount);
			let initBalance = that.web3Client.utils.fromWei(balance);
			that.clientBalance = parseFloat(initBalance).toFixed(4);
			console.log('---number balance---', initBalance);
		},

		async getChainId() {
			let that = this;
			if (!that.web3Client) {
				return;
			}
			let chainId = await that.web3Client.eth.getChainId()
			console.log(`chain id: ${chainId}`)
			that.chainId = chainId;
		},

	}
}
</script>