// 移动端适配
module.exports = (function(doc, win) {
	//根据平台选择下载。
	let userAgentGlobal = "";
	let userAgentBrowser = "";

	if (navigator.userAgent.match(/(iPhone|iphone|ipad|ipod|iPad|iPod)/i)) {
		userAgentGlobal = "iphone";
	} else if (navigator.userAgent.match(/(Android|android)/i)) {
		userAgentGlobal = "android";
	} else {
		userAgentGlobal = "pc";
	}
    window.userAgentGlobal = userAgentGlobal;
	//判断是否是微信或者qq浏览器打开的。
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/qq\//i) == "qq/") {
		userAgentBrowser = "weixinQQ";
	}
	var docEl = doc.documentElement,
		resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			if (userAgentGlobal == "pc") {
				if (clientWidth < 1920) {
					docEl.style.fontSize = 100 * (clientWidth / 1920) + "px";
				} else {
					docEl.style.fontSize = "100px";
				}
			} else {
				if (clientWidth < 750) {
					docEl.style.fontSize = 100 * (clientWidth / 750) + "px";
				} else {
					docEl.style.fontSize = "100px";
				}
			}
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);