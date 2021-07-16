<template>
	<div class="loading-tip">
		<div class="loading-icon-container">
			<div class="object object_four"></div>
			<div class="object object_three"></div>
			<div class="object object_two"></div>
			<div class="object object_one"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LoadingTips',
}
</script>
<style lang='scss' scoped>
.loading-tip {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(26, 27, 31, 1);
	opacity: 0.8;
	z-index: 10000;
	.loading-icon-container {
		height: 1.6rem;
		width: 1.6rem;
		background-color: transparent;
		position: relative;
		.object {
			position: absolute;
			-moz-border-radius: 50% 50% 50% 50%;
			-webkit-border-radius: 50% 50% 50% 50%;
			border-radius: 50% 50% 50% 50%;
			border-left: 0.1rem solid #22dda2;
			border-right: 0.1rem solid #22dda2;
			border-top: 0.1rem solid transparent;
			border-bottom: 0.1rem solid transparent;
			-webkit-animation: animate 2s infinite;
			animation: animate 2s infinite;
			&.object_one {
				left: 0.55rem;
				top: 0.55rem;
				width: 0.3rem;
				height: 0.3rem;
			}
			&.object_two {
				left: 0.35rem;
				top: 0.35rem;
				width: 0.7rem;
				height: 0.7rem;
				-webkit-animation-delay: 0.1s;
				animation-delay: 0.1s;
			}
			&.object_three {
				left: 0.15rem;
				top: 0.15rem;
				width: 1.1rem;
				height: 1.1rem;
				-webkit-animation-delay: 0.2s;
				animation-delay: 0.2s;
			}
			&.object_four {
				left: 0;
				top: 0;
				width: 1.4rem;
				height: 1.4rem;
				-webkit-animation-delay: 0.3s;
				animation-delay: 0.3s;
			}
		}
	}
}

@-webkit-keyframes animate {
	50% {
		-ms-transform: rotate(180deg);
		-webkit-transform: rotate(180deg);
		transform: rotate(180deg);
	}
	100% {
		-ms-transform: rotate(0deg);
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
}

@keyframes animate {
	50% {
		-ms-transform: rotate(180deg);
		-webkit-transform: rotate(180deg);
		transform: rotate(180deg);
	}
	100% {
		-ms-transform: rotate(0deg);
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
}
</style>