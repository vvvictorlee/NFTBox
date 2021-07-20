<template>
	<div class='sences'>
		<div class="item-label">
			<div class="lable-flag"></div>
			<div class="lable-text">{{$t('home.test16')}}</div>
		</div>
		<div class="swiper-card-container">
			<div class="swiper-container mySwiper">
				<div class="swiper-wrapper">
					<div class="swiper-slide" @click="goSences('https://hsc.gamedao.io/mine/token')">
						<img src="../../../public/image/my_card1.png" alt="">
						<div class="title-container">
							<div class="title-text">GameDAO</div>
							<div class="title-text">{{$t('home.test17')}}</div>
						</div>
					</div>
					<div class="swiper-slide" @click="goSences('https://seekers.xlootcn.com/')">
						<img src="../../../public/image/my_card2.png" alt="">
						<div class="title-container">
							<div class="title-text">NFT</div>
							<div class="title-text">{{$t('home.test18')}}</div>
						</div>
					</div>
					<div class="swiper-slide" @click="goSences('https://hsc.gamedao.io/mine/nft')">
						<img src="../../../public/image/my_card3.png" alt="">
						<div class="title-container">
							<div class="title-text">{{$t('home.test19')}}</div>
							<div class="title-text"></div>
						</div>
					</div>
				</div>
				<div class="swiper-pagination"></div>
			</div>
		</div>
		<div class="item-label">
			<div class="lable-flag"></div>
			<div class="lable-text">{{$t('home.test20')}}</div>
		</div>
		<div class="news-container">
			<div class="news-item" @click="goNews('https://www.chainnews.com/articles/438783568011.htm')">
				<div class="news-item--left">
					<div class="icon">
						<img src="../../../public/image/news_bg1.png" alt="">
					</div>
				</div>
				<div class="news-item--right">
					<div class="right-title">{{$t('home.test21')}}</div>
					<div class="right-date">2021-3-12 12:09</div>
				</div>
			</div>
			<div class="news-item" @click="goNews('https://www.chainnews.com/articles/349746561776.htm')">
				<div class="news-item--left">
					<div class="icon">
						<img src="../../../public/image/news_bg2.png" alt="">
					</div>
				</div>
				<div class="news-item--right">
					<div class="right-title">{{$t('home.test22')}}</div>
					<div class="right-date">2021-3-16 11:20</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
let mySwiper = null;
export default {
	name: "Scenes",
	data() {
		return {
		};
	},
	mounted() {
		let that = this;
		mySwiper = new Swiper('.swiper-container', {
			speed: 300,
			loop: true,
			watchSlidesProgress: true,
			slidesPerView: "auto",
			spaceBetween: 20,
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
	methods: {
		goNews(openUrl) {
			window.open(openUrl, "_blank");
		},
		goSences(openUrl) {
			window.open(openUrl, "_blank");
		},
	}
}

</script>
<style lang='scss' scoped>
.sences {
	padding-left: 0.3rem;
	padding-right: 0.3rem;
	.item-label {
		height: 0.44rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.lable-flag {
			width: 0.08rem;
			height: 0.36rem;
			background: #ffffff;
			border-radius: 0.02rem;
		}
		.lable-text {
			margin-left: 0.18rem;
			font-size: 0.32rem;
			font-family: PingFang SC;
			font-weight: bold;
			color: #ffffff;
		}
	}
	.swiper-card-container {
		padding-top: 0.4rem;
		padding-bottom: 0.4rem;
		height: 4rem;
		display: flex;
		justify-content: center;
		align-items: center;
		.swiper-container {
			width: 100%;
			height: 3.78rem;
			overflow: hidden;
			.swiper-slide {
				height: 3.78rem;
				width: 2.54rem;
				text-align: center;
				font-size: 18px;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				img {
					display: block;
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
				.title-container {
					position: absolute;
					top: 0.2rem;
					left: 0.24rem;
					font-size: 0.32rem;
					font-family: PingFang SC;
					font-weight: 400;
					color: #ffffff;
					text-align: left;
				}
			}
		}
	}
	.news-container {
		padding-top: 0.02rem;
		.news-item {
			margin-top: 0.32rem;
			width: 6.22rem;
			padding: 0.36rem 0.34rem;
			height: 1.96rem;
			background: #ffffff;
			opacity: 1;
			border-radius: 20px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			&--left {
				height: 1.96rem;
				width: 1.96rem;
				.icon {
					height: 1.96rem;
					width: 1.96rem;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						display: block;
						height: 100%;
						width: 100%;
					}
				}
			}
			&--right {
				margin-left: 0.36rem;
				height: 1.96rem;
				width: 3.9rem;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				.right-title {
					width: 3.9rem;
					font-size: 0.28rem;
					font-family: PingFang SC;
					font-weight: 400;
					color: #4e4e4e;
					text-align: left;
				}
				.right-date {
					width: 3.9rem;
					font-size: 0.2rem;
					font-family: PingFang SC;
					font-weight: 400;
					color: #d0d0d0;
					text-align: left;
				}
			}
		}
	}
}
</style>