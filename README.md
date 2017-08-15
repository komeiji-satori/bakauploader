# bakauploader
一个简单的WebUploader多文件上传组件


```
<script type="text/javascript">
BakaUploader.init({
    addr: 'upload.php',   //上传目标地址
    selector: '#upload',  //绑定的按钮ID
    max_size: 64 * 1024 * 1024,  //最大文件大小(byte)
    filter: ['application/zip'],    //文件类型白名单
    multiple: true,             //允许多文件
    file_count: 2,              	//多文件最大数量
    data: { token: 'A52FA4AF6W4',password:23333333},  //附带数据
    onselect: function(data) {
        console.log(data);        //文件选中成功回调
    },
    onprogress: function(e) {
        console.log(e);	      //上传进度更新回调
    },
    onerror: function(e) {
        console.log(e);	       //发生错误回调
    },
    onsuccess: function(data) {
        console.log(data);	       //上传成功回调
    }
});
</script>
```