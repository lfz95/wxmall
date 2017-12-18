/*
    popstate兼容问题说明：
        当网页加载时,各浏览器对popstate事件是否触发有不同的表现,Chrome 和 Safari会触发popstate事件,
        而Firefox不会.即便进入了那些非pushState和replaceState方法作用过的(比如http://example.com/example.html)
        没有state对象关联的那些网页, popstate事件也仍然会被触发.
    参考文章：https://www.waitig.com/%E5%A6%82%E4%BD%95%E7%9B%91%E5%90%ACandroid%E6%89%8B%E6%9C%BA%E7%89%A9%E7%90%86%E8%BF%94%E5%9B%9E%E9%94%AE.html
*/
export default{
    ls:function(e){
        // console.log(e);//根据自己的需求实现自己的功能  
    },
    goback(isback=false,callback){
        this.ls=function(e){ 
                // console.log(e);//根据自己的需求实现自己的功能  
                if(isback){     //避免加载时触发popstate事件
                    isback=false;
                    callback();
                }
                
        };
        window.addEventListener("popstate", this.ls, false);  
    },
    removeListener(){
        window.removeEventListener("popstate",this.ls,false);
    }
}