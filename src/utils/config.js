export default{
    //商品图片路径
    image_base_url:process.env.NODE_ENV === 'development'?'http://test.ippit.cn/MerchPhoto/':'/MerchPhoto/',
    //api请求路径
    api_url:process.env.NODE_ENV === 'development'?'http://test.ippit.cn/bkmall':'/bkmall',
    
    //session过期链接
    session_url:'http://test.ippit.cn/WXServer/wx/10975840/memext/getUserid/redirect?redirect_url=http%3A//test.ippit.cn/bkmall/security/wx-openid/%3Faction%3D',
    
    person_center_link:'http://test.ippit.cn/WXServer/wx/10975840/memb/redirect',

    coupon_link:'http://test.ippit.cn/WXServer/wx/10975840/favor/myCouponList',
    //拼接主图
    image_url:function(item){
        return this.image_base_url+item.item_id+'/'+item.thumbnail_photo;
    },
    //拼接二级分类图片
    categoryImgUrl:function(id){
        if(process.env.NODE_ENV === 'development'){
            return 'http://test.ippit.cn/MerchPhoto/itemCategoryPhoto/'+id+'.jpg';
        }else{
            return '/MerchPhoto/itemCategoryPhoto/'+id+'.jpg'; 
        }
    },
    //轮播图图片地址
    bannerImgUrl:function(img){
        if(process.env.NODE_ENV === 'development'){
            return 'http://test.ippit.cn/MerchPhoto/carouselPhotos/10975840/'+img;
        }else{
            return '/MerchPhoto/carouselPhotos/10975840/'+img; 
        }
    },
    //获取机构号
    getIssuer:function(){
        var url=location.href;
        var key='/WXServer/wx/';
        var start=url.indexOf(key);
        if(start==-1){
          return '';
        }
        start=start+key.length;
        var user=url.substr(start,8);
        return user||'';
    }
}