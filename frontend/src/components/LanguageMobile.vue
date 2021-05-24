/*
 * @Date: 2020-05-20 14:26:04 
 * @Last Modified time: 2020-05-20 14:26:04 
*/

<template>
    <div class="language-select">
        <div class="title-container" @click="handleLangChoice" v-clickoutside="handleClose">
            <div class="title-text">{{computedLangText}}</div>
            <div class="title-icon" :class="[languageShow ? 'icon-active' : '']"></div>
        </div>
        <div class="select-container" :class="[languageShow ? 'select-show' : '']">
            <div class="item" :class="[getLocaleLang == 'zh-hans' ? 'active-item ' : '']" @click="handleLanguage('zh-hans')">简体中文</div>
            <div class="item" :class="[getLocaleLang == 'en' ? 'active-item ' : '']" @click="handleLanguage('en')">English</div>
            <div class="item" :class="[getLocaleLang == 'ko' ? 'active-item ' : '']" @click="handleLanguage('ko')">한국어</div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import clickoutside from '../utils/clickoutside';
export default {
    name: 'languageSelect',
    data () {
        return {
            languageShow: false,
        }
    },
    //插入指令
    directives: { clickoutside },
    computed: {
        ...mapGetters({
            getLocaleLang: "getLocaleLang",
        }),
        computedLang () {
            let tempLang = this.getLocaleLang;
            return tempLang;
        },
        computedLangText () {
            let selectLangText = '简体中文';
            let type = this.computedLang;
            if (type == 'en') {
                selectLangText = 'English';
            } else if (type == 'ko') {
                selectLangText = '한국어';
            } else {
                selectLangText = '简体中文';
            }
            return selectLangText;
        },
    },
    methods: {
        ...mapActions({
            setLocaleLang: "setLocaleLang",
        }),
        //点击空白处隐藏
        handleClose () {
            this.languageShow = false;
        },
        //选则语言
        handleLangChoice () {
            this.languageShow = !this.languageShow;
        },
        //选中语言
        handleLanguage (type) {
            if (type == 'en') {
                this.$i18n.locale = 'en';
                this.setLocaleLang('en');
            } else if (type == 'ko') {
                this.$i18n.locale = 'ko';
                this.setLocaleLang('ko');
            } else {
                this.$i18n.locale = 'zh-hans';
                this.setLocaleLang('zh-hans');
            }
            this.languageShow = false;
        },
    },
}
</script>
<style lang="scss" scoped>
.language-select {
	height: 100%;
	width: 100%;
	font-size: 0.26rem;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: rgba(255, 255, 255, 1);
	position: relative;
	.title-container {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.title-text {
			margin-right: 0.05rem;
		}
		.title-icon {
			margin-left: 0.05rem;
			height: 0.16rem;
			width: 0.26rem;
			background: url("../assets/image/down-direction.png") no-repeat;
			background-size: 100% 100%;
			transition: transform 0.3s;
			-ms-transition: -ms-transform 0.3s;
			-webkit-transition: -webkit-transform 0.3s;
			&.icon-active {
				transform: rotate(-180deg);
				-ms-transform: rotate(-180deg);
				-webkit-transform: rotate(-180deg);
			}
		}
	}
	.select-container {
		position: absolute;
		top: 0.68rem;
		width: 101%;
		height: 0;
		overflow-y: hidden;
		background: rgba(255, 255, 255, 1);
		border-radius: 0.08rem;
		-webkit-transition: height 0.3s; /* For Safari 3.1 to 6.0 */
		transition: height 0.3s;
		box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 0, 0, 0.2);
		.item {
			text-align: center;
			height: 0.88rem;
			line-height: 0.88rem;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 0, 0, 0.6);
			font-size: 0.24rem;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: rgba(90, 99, 109, 1);
			text-shadow: 0 0.04rem 0.08rem rgba(0, 0, 0, 0.1);
			&.active-item {
				color: rgba(2, 234, 208, 1);
			}
		}
	}
	.select-show {
		// -webkit-transition: height 0.3s; /* For Safari 3.1 to 6.0 */
		// transition: height 0.3s;
		height: 2.64rem;
	}
}
</style>
