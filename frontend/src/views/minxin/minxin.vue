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
export default {
	name: 'BoxMinxin',
	data() {
		return {
			publicPath: process.env.BASE_URL,
			current: 0,
			clientAccount: '',
			web3Client: null,
			loadingTips: false,
			bannerConfig: {
				"1": {
					name: this.$t('home.test27'),
					imgurl: 'image/diamond_box.png',
                    i18Text: 'home.test27',
				},
				"2": {
					name: this.$t('home.test28'),
					imgurl: 'image/gold_box.png',
                    i18Text: 'home.test28',
				},
				"3": {
					name: this.$t('home.test29'),
					imgurl: 'image/silver_box.png',
                    i18Text: 'home.test29',
				},
				"4": {
					name: this.$t('home.test30'),
					imgurl: 'image/bronze_box.png',
                    i18Text: 'home.test30',
				},
				"5": {
					name: this.$t('home.test31'),
					imgurl: 'image/platinum_box.png',
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
		}),
		caclCurrent() {
			return this.current;
		},
		isConnected() {
			let flag = !!this.clientAccount;
			return flag;
		},
        hasBoxList() {
            let len = this.getMyboxList.length;
            let flag = len > 0 ? true : false;
            return flag;
        },
	},
	filters: {
		formatAccount(account) {
			if (!account) {
				return '';
			}
			let len = 13;
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
		}),
        formatBannerName(level) {
            console.log(level)
            let that = this;
            if (!level) {
				return '';
			}
            console.log(that.bannerConfig);
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
			if (!that.clientAccount) {
				that.$Toast('please connect wallet');
				return;
			}
			let requestParams = {
				address: that.clientAccount,
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
		//点击领取
		clickReceive() {
			let that = this;
			if (!that.clientAccount) {
				that.$Toast('please connect wallet');
				return;
			}
			let requestParams = {
				address: that.clientAccount,
			};
			that.loadingTips = true;
			handleReceive(requestParams).then(res => {
				console.log(res)
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
            console.log(len)
            if(len == 0) {
                that.$Toast('no box can select');
				return;
            }
			let requestItem = temArr.find((item) => {
				return item.is_active;
			});
			console.log(requestItem);
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
	}
}
</script>