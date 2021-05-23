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
import { handleReceive, getMyboxes, openBox } from '../../http/home';
import LoadingTip from '../../components/LoadingTip.vue';
export default {
    name: 'BoxMinxin',
    data () {
        return {
            publicPath: process.env.BASE_URL,
            current: 0,
            clientAccount: '',
			web3Client: null,
            loadingTips: false,
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
        onChange(index) {
			this.current = index;
			// console.log(index);
		},
        //获取我的盲盒列表
        handleMyBoxes(){
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

					that.setMyboxList(records);
				}
			}).catch(err => {
                that.loadingTips = false;
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
			let requestItem = that.getMyboxList.find((item) => {
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
					tokens: [],
				};
				if (res.code == '10000') {
                    that.loadingTips = false;
					let tokens = res && res.data || [];
					openBoxInfo = {
						name: requestItem && requestItem.name || '',
						level: requestItem && requestItem.level || '',
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