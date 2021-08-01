<template>
	<div class='my'>
        <loading-tips v-if="loadingTips"></loading-tips>
		<div class="has-container" v-show="hasNft">
			<div class="swiper-card-container">
				<div class="swiper-container mySwiper">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<div class="my-container">
                                <div class="cart-title">{{$t('home.test23')}}</div>
								<div class="my-card"></div>
                                <div class="cart-id" v-show="!!tokenId">No.{{tokenId}}</div>
								<div class="card-button">{{$t('home.test24')}}</div>
							</div>
						</div>
					</div>
					<div class="swiper-pagination"></div>
				</div>
			</div>
			<div class="my-pagination">
				<div class="pagination-left"></div>
				<div class="pagination-right"></div>
			</div>
		</div>
		<div class="nodata-container" v-show="!hasNft">
			<div class="nodata-icon"></div>
			<div class="nodata-text">{{$t('home.test25')}}</div>
		</div>
	</div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
let mySwiper = null;
import { getMyboxes } from '../../http/home';
import NftMinxin from '../minxin/minxin.vue';
export default {
	name: "My",
	data() {
		return {
			hasNft: false,
            tokenId: '',
		};
	},
	mixins: [NftMinxin],
    created() {
        this.loadingTips = true;
    },
	mounted() {
		let that = this;
		//查询我的
		setTimeout(() => {
			that.checkMyNft();
		}, 500);
	},
	methods: {
		//初始化swiper
		initSwiper() {
			let that = this;
			mySwiper = new Swiper('.swiper-container', {
				speed: 300,
				loop: true,
				watchSlidesProgress: true,
				slidesPerView: "auto",
				spaceBetween: 10,
				// on: {
				// 	slideChange: function () {
				// 		that.currentIndex = this.realIndex;
				// 		// console.log('realIndex为--  '+this.realIndex);
				// 	},
				// 	progress: function (swiper) {
				// 		// console.log(swiper.progress);
				// 		that.nowProgress = swiper.progress;
				// 	},
				// },
			});
		},
		//查询我的
		checkMyNft() {
			let that = this;
			if (!that.getClientAccount) {
				that.$Toast('please connect wallet');
				return;
			}
			let requestParams = {
				address: that.getClientAccount,
			};
            that.loadingTips = true;
			getMyboxes(requestParams).then(res => {
				//成功code码 成功: 10000 失败: 例如10001等   10001 没有领取过，10002 领过，被转走    10003  领取被转，接收到其他
				if (res.code == '10000' || res.code == '10003') {
					that.hasNft = true;
                    that.tokenId = res && res.data && res.data.tokenId || '';
					that.$nextTick(() => {
						that.initSwiper();
					});
				} else {
					that.hasNft = false;
				}
                that.loadingTips = false;
			}).catch(err => {
				that.hasNft = false;
                that.loadingTips = false;
			});
		},
	}
}

</script>
<style lang='scss' scoped>
.my {
	padding-top: 0.2rem;
	.has-container {
		min-height: 8rem;
		padding-left: 0.3rem;
		padding-right: 0.3rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.swiper-card-container {
			padding-top: 0.2rem;
			padding-bottom: 0.4rem;
			width: 6rem;
			min-height: 7.8rem;
			display: flex;
			justify-content: center;
			align-items: center;
			.swiper-container {
				width: 100%;
				min-height: 8rem;
				overflow: hidden;
				.swiper-slide {
					min-height: 8rem;
					width: 5.9rem;
					display: flex;
					justify-content: center;
					align-items: center;
					.my-container {
						width: 5.9rem;
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
						.my-card {
							height: 5.72rem;
							width: 4.12rem;
							background: url("../../assets/image/home_card1.png")
								no-repeat;
							background-size: 100% 100%;
						}
						.cart-title {
							margin-bottom: 0.2rem;
							font-size: 0.48rem;
							font-family: PingFang SC;
							font-weight: bold;
							color: #278df5;
						}
                        .cart-id{
                            margin-top: 0.2rem;
							font-size: 0.48rem;
							font-family: PingFang SC;
							font-weight: bold;
							color: #278df5;
                        }
						.card-button {
							margin-top: 0.4rem;
							width: 3.58rem;
							padding-left: 0.3rem;
							padding-right: 0.3rem;
							height: 0.8rem;
							line-height: 0.8rem;
							background: linear-gradient(
								90deg,
								#217af8 0%,
								#449afe 100%
							);
							border-radius: 0.4rem;
							font-size: 0.36rem;
							font-family: PingFang SC;
							font-weight: bold;
							color: #ffffff;
							cursor: pointer;
							text-align: center;
						}
					}
				}
			}
		}
		.my-pagination {
			height: 1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			.pagination-left {
				height: 0.41rem;
				width: 0.23rem;
				cursor: pointer;
				margin-right: 0.6rem;
				background: url("../../assets/image/direction_left.png")
					no-repeat;
				background-size: 100% 100%;
			}
			.pagination-right {
				height: 0.41rem;
				width: 0.23rem;
				cursor: pointer;
				margin-left: 0.6rem;
				background: url("../../assets/image/direction_right.png")
					no-repeat;
				background-size: 100% 100%;
			}
		}
	}
	.nodata-container {
		min-height: 8rem;
		padding-left: 0.3rem;
		padding-right: 0.3rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.nodata-icon {
			height: 1.8rem;
			width: 1.9rem;
			background: url("../../assets/image/no_data.png") no-repeat;
			background-size: 100% 100%;
		}
		.nodata-text {
            margin-top: .32rem;
			font-size: .36rem;
			font-family: PingFang SC;
			font-weight: bold;
			color: #ffffff;
		}
	}
}
</style>