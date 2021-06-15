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
import { getBanners, handleReceive, getMyboxes, openBox } from '../../http/home';
import LoadingTip from '../../components/LoadingTip.vue';
const Web3 = require('web3');
import { switchToHSC, switchToTestHSC } from '../config/index';
export default {
	name: 'BoxMinxin',
	data() {
		return {
			publicPath: process.env.BASE_URL,
			current: 0,
			clientAccount: '',
            accountAddress: '', //用户链上地址
            loginAddress: '',
			clientBalance: 0,
			web3Client: null,
			chainId: 170,
			loadingTips: false,
			bannerConfig: {
				"1": {
					name: this.$t('home.test27'),
					imgurl: 'image/diamond_box.png?v=3',
					i18Text: 'home.test27',
				},
				"2": {
					name: this.$t('home.test28'),
					imgurl: 'image/gold_box.png?v=3',
					i18Text: 'home.test28',
				},
				"3": {
					name: this.$t('home.test29'),
					imgurl: 'image/silver_box.png?v=3',
					i18Text: 'home.test29',
				},
				"4": {
					name: this.$t('home.test30'),
					imgurl: 'image/bronze_box.png?v=3',
					i18Text: 'home.test30',
				},
				"5": {
					name: this.$t('home.test31'),
					imgurl: 'image/platinum_box.png?v=3',
					i18Text: 'home.test31',
				},
			},
		}
	},
	components: {
		'loading-tip': LoadingTip,
	},
	computed: {
		...mapGetters({
			getBannerList: "getBannerList",
			getMyboxList: "getMyboxList",
            getLocaleLang: "getLocaleLang",
            getHscAddress: "getHscAddress",
		}),
		caclCurrent() {
			return this.current;
		},
		isConnected() {
			let flag = !!this.getHscAddress;
			return flag;
		},
		hasBoxList() {
			let len = this.getMyboxList.length;
			let flag = len > 0 ? true : false;
			return flag;
		},
		balanceTokenName() {
			let tokenName = '';
			tokenName = ((this.chainId == 70) || (this.chainId == 170)) ? 'HOO' : '';
			return tokenName;
		},
        computedBannerLogo() {
            let lang = this.getLocaleLang || 'en';
            let bannerClass = `banner-title-${lang}`;
            return bannerClass;
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
			let len = 10;
			return `${account.substring(0, len)}...${account.substring(42 - len)}`
		},
	},
	methods: {
		...mapActions({
			setBannerList: "setBannerList",
			setOpenMessage: "setOpenMessage",
			setMyboxList: "setMyboxList",
			setOpenBoxInfo: "setOpenBoxInfo",
            setHscAddress: "setHscAddress",
		}),
		formatBannerName(level) {
			// console.log(level)
			let that = this;
			if (!level) {
				return '';
			}
			// console.log(that.bannerConfig);
			let findItem = that.bannerConfig[level] || {};
			let name = findItem && findItem['name'] || '';
			return name;
		},
		onChange(index) {
			this.current = index;
			// console.log(index);
		},
		//初始化banner列表
		initBannerList() {
			let that = this;
			getBanners().then(res => {
				// console.log(res);
				if (res.code == '10000') {
					let records = res.data && res.data.records || [];
					let len = records.length;
					if (len > 0) {
						records.forEach((element, index) => {
							let level = element.level || '';
							// console.log(level);
							if (!!level) {
								let findItem = that.bannerConfig[level] || {};
								let tempObj = Object.assign({}, element, findItem);
								// console.log(tempObj);
								records.splice(index, 1, tempObj);
							}
						});
					}
					that.setBannerList(records);
				}
			});
		},
		//获取我的盲盒列表
		handleMyBoxes() {
			let that = this;
			if (!that.isConnected) {
				that.$Toast('please connect wallet');
				return;
			}
			let requestParams = {
				address: that.getHscAddress,
			};
			that.loadingTips = true;
			//获取我的盲盒list
			getMyboxes(requestParams).then(res => {
				// console.log(res);
				that.loadingTips = false;
				let records = res.data && res.data.records || [];
				let len = records.length;
				if (len > 0) {
					records.forEach((element, index) => {
						let level = element.level || '';
						// console.log(level);
						if (!!level) {
							let findItem = that.getBannerList.find(item => {
								return item.level == level;
							});
							// console.log(findItem);
							let tempObj = Object.assign({ is_active: false }, element, findItem);
							// console.log(tempObj);
							records.splice(index, 1, tempObj);
						}
						// element.is_active = false;
					});
				}
				that.setMyboxList(records);
			}).catch(err => {
				that.loadingTips = false;
				let errorRecords = [];
				that.setMyboxList(errorRecords);
			});
		},
		//选中一个盲盒
		selectBox(item, index) {
			let that = this;
			let tempArr = that.getMyboxList;
			tempArr.forEach((value, key) => {
				if (key == index) {
					value.is_active = !value.is_active;
				} else {
					value.is_active = false;
				}
			});
			that.setMyboxList(tempArr);
		},
        //查看获奖名单
        goWinnerList() {
            let that = this;
            let lang = this.getLocaleLang || 'en';
            let openUrl = 'https://eapy.com/zh_cn/activity/list';
            if(lang == 'zh-hans') {
                openUrl = 'https://eapy.com/zh_cn/activity/list';
            } else {
                openUrl = 'https://eapy.com/en/activity/list';
            }
            window.open(openUrl,"_blank");
        },
		//点击领取
		clickReceive() {
			let that = this;
			if (!that.isConnected) {
				that.$Toast('please connect wallet');
				return;
			}
			let requestParams = {
				address: that.getHscAddress,
			};
			that.loadingTips = true;
			handleReceive(requestParams).then(res => {
				// console.log(res)
				if (res.code == '10000') {
					that.loadingTips = false;
					let openMessage = {
						level: res.data && res.data.level || '',
						last_times: res.data && res.data.last_times || '0',
					};
					that.setOpenMessage(openMessage);
					that.$router.push({
						name: "ReceiveResult",
						params: {
							id: 'sucess'
						}
					});
				} else {
					that.loadingTips = false;
					let openMessage = {
						level: res.data && res.data.level || '',
						last_times: res.data && res.data.last_times || '0',
					};
					that.setOpenMessage(openMessage);
					that.$router.push({
						name: "ReceiveResult",
						params: {
							id: 'fail'
						}
					});
				}
			}).catch(err => {
				that.loadingTips = false;
			});
		},
		//提交打开盲盒
		openSubmit() {
			let that = this;
			let temArr = that.getMyboxList || [];
			let len = temArr.length;
			// console.log(len)
			if (len == 0) {
				that.$Toast('no box can select');
				return;
			}
			let requestItem = temArr.find((item) => {
				return item.is_active;
			});
			// console.log(requestItem);
			let boxAddress = requestItem && requestItem.boxAddress || '';
			if (!boxAddress) {
				that.$Toast('please select one box');
				return;
			}
			let requestParams = {
				address: boxAddress,
			};
			that.loadingTips = true;
			openBox(requestParams).then(res => {
				// console.log(res)
				let openBoxInfo = {
					name: '',
					level: '',
					i18Text: 'home.test27',
					tokens: [],
				};
				if (res.code == '10000') {
					that.loadingTips = false;
					let tokens = res && res.data || [];
					openBoxInfo = {
						name: requestItem && requestItem.name || '',
						level: requestItem && requestItem.level || '',
						i18Text: requestItem && requestItem.i18Text || '',
						tokens: tokens,
					};
					that.setOpenBoxInfo(openBoxInfo);
					that.$router.push({
						name: "OpenResult",
						params: {
							id: 'sucess'
						}
					});
				} else {
					that.loadingTips = false;
					openBoxInfo = {
						name: '',
						level: '',
						i18Text: '',
						tokens: [],
					};
					that.setOpenBoxInfo(openBoxInfo);
					that.$router.push({
						name: "OpenResult",
						params: {
							id: 'fail'
						}
					});
				}
			}).catch(err => {
				that.loadingTips = false;
			});
		},

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