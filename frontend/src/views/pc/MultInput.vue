<template>
	<div class="mult-input-container">
		<div class="input-container">
			<div class="input-content">
				<input type="text" v-model="inputText">
			</div>
			<div class="input-lable">粘贴</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MultInput',
	data() {
		return {
			inputText: '',
		}
	},
    methods: {
        //清楚输入框数据
		clearInputText() {
            this.inputText = "";
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mult-input-container {
	.input-container {
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
		.input-lable {
			width: 0.56rem;
			height: 0.4rem;
			font-size: 0.28rem;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #c1c1c1;
		}
		.input-content {
			width: 4rem;
			height: 0.64rem;
			input {
				height: 0.64rem;
				width: 4rem;
				background: none;
				outline: none;
				border: 0;
				font-size: 0.28rem;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #232323;
				cursor: default;
			}
		}
	}
}
</style>
