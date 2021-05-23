<template>
	<div class="nft-dialog">
		<van-overlay :show="dialogShow" :lock-scroll="false" @click="dialogShow = false">
			<div class="nft-wrapper" @click.stop>
				<div class="nft-block">
                    <div class="cancle-button" @click.stop="dialogShow = false">
                        <van-icon name="cross" color="#000" size=".4rem" />
                    </div>
                    <div class="block-title">
                        <slot name="dtitle"></slot>
                    </div>
                    <div class="block-content">
                        <slot name="dcontent"></slot>
                    </div>
                </div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
export default {
	name: 'Dialog',
	data() {
		return {
			dialogShow: false,
		}
	},
    methods: {
        //打开弹窗
        openDialog() {
            let that = this;
            that.dialogShow = true;
        },
        //关闭弹窗
        closeDialog() {
            let that = this;
            that.dialogShow = false;
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.nft-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	.nft-block {
		min-height: 3.6rem;
		width: 6rem;
		background: #ffffff;
        border-radius: .12rem;
        border-top: .4rem solid #02EAD0;
        position: relative;
        .cancle-button{
            position: absolute;
            top: -.64rem;
            right: -.24rem;
            width: .5rem;
            height: .5rem;
            background: #FFFFFF;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
	}
}
</style>
