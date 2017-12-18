/*
    上拉加载更多 ：判断滚动条是否滚到了底部
*/
export default{
    //文档高度
    getDocumentTop(id) {
	    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
	    if (document.getElementById(id)) {
	        bodyScrollTop = document.getElementById(id).scrollTop;
	    }
	    if (document.documentElement) {
	        documentScrollTop = document.documentElement.scrollTop;
	    }
	    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
	    return scrollTop;
	},
   //可视窗口高度
    getWindowHeight(id) {
	    var windowHeight = 0;
	    if (document.compatMode == "CSS1Compat") {
	        windowHeight = document.documentElement.offsetHeight;
	    } else {
	        windowHeight = document.getElementById(id).offsetHeight;
	    }
	    return windowHeight;
	},

	//滚动条滚动高度
	getScrollHeight(id) {
	    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
	    if (document.getElementById(id)) {
	        bodyScrollHeight = document.getElementById(id).scrollHeight;
	    }
	    if (document.documentElement) {
	        documentScrollHeight = document.documentElement.scrollHeight;
	    }
	    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
	    return scrollHeight;
	}
}