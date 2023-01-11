/*
 * @Author: zhanghui rem486@qq.com
 * @Date: 2022-12-22 11:53:20
 * @LastEditors: zhanghui rem486@qq.com
 * @LastEditTime: 2023-01-11 10:32:53
 * @FilePath: \halo-theme-dream\src\js\fan.js
 * @Description: 说明
 */
var bilibiliVue = null;
var bilibili_api = $('#bilibili_api').val() || '/bilibili';


console.log({
  bilibili_api
});

//初始化vue绑定
const initBilibiliVue = function () {
  if ($('.bilibili').length === 0) return;
  bilibiliVue = new Vue({
    el: '#bilibili',
    data: {
      show: false,
      bilibiliContents: [],
      isEnd: false, //全部加载

      queryParams: { //分页信息
        start: 0,
        limit: 30,
      },
    },
    created() {
      this.show = true;
    },
    mounted() {},
    methods: {
      //初始化数据
      init() {
        console.log('init');

        $('.noBilibili').show();
        this.sLoading = true;
        $('.bilibili').addClass('loading');

        let that = this
        axios.get(bilibili_api + `/1/10`).then(function (res) {
          that.setRecordData(res)
        })
      },

      //设置数据显示
      setRecordData(recordData) {
        console.log({
          recordData
        });
        if (recordData.data.code == 0) {
          const bilibiliContents = recordData.data.data || [];
          if (bilibiliContents.length !== 0) {
            this.isEnd = bilibiliContents.length < this.queryParams.limit;
            this.bilibiliContents = bilibiliContents;
            $('.noBilibili').hide();
            $('.bilibili').show();
          } else {
            this.isEnd = true;
          }
        } else {
          console.error("获取番剧数据失败");
        }
      },
    }
  });
}


window.bilibiliPjax = function (serialNumber) {
  if ($('.bilibili').length === 0) return;
  initBilibiliVue();
  bilibiliVue && bilibiliVue.init();
};

!(function () {
  initBilibiliVue();
  !window.pjaxSerialNumber && bilibiliVue && bilibiliVue.init();
})();