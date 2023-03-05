/*
 * @Author: zhanghui rem486@qq.com
 * @Date: 2022-12-22 11:53:20
 * @LastEditors: ActingCute酱 rem486@qq.com
 * @LastEditTime: 2023-03-05 14:31:23
 * @FilePath: \halo-theme-dream\source\js\fan.min.js
 * @Description: 说明
 */
var bilibiliVue = null;
var bilibili_api = $("#bilibili_api").val() || "/bilibili";

console.log({
  bilibili_api,
});

//初始化vue绑定
const initBilibiliVue = function () {
  if ($(".bilibili").length === 0) return;
  bilibiliVue = new Vue({
    el: "#bilibili",
    data: {
      isLoading: true,
      show: false,
      bilibiliContents: [],
      isEnd: false, //全部加载

      queryParams: {
        //分页信息
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
        $(".noBilibili").show();
        this.isLoading = true;
        $(".bilibili").addClass("loading");

        // 滚动加载
        window.addEventListener("scroll", () => {
          let $bilibiliGallery = $("#bilibili");
          if (
            $bilibiliGallery.length !== 0 &&
            $(window).scrollTop() + $(window).height() >=
              $bilibiliGallery.height()
          ) {
            if (this.isEnd) {
              $(".bilibili").removeClass("loading");
              this.isLoading = false;
            }

            if (this.isLoading || this.isEnd) return;
            this.getMore();
          }
        });

        this.getMore();
      },

      getMore() {
        let that = this;
        this.queryParams.start++;
        axios
          .get(
            bilibili_api +
              `/subscribe/${this.queryParams.start}/${this.queryParams.limit}`
          )
          .then(function (res) {
            that.setRecordData(res);
          });
      },

      //设置数据显示
      setRecordData(recordData) {
        console.log({
          recordData,
        });
        if (recordData.data.code == 0) {
          const bilibiliContents = recordData.data.data.list || [];
          if (bilibiliContents.length !== 0) {
            this.isEnd =
              this.bilibiliContents.length >= recordData.data.data.total;
            this.bilibiliContents.push(...bilibiliContents);
            $(".noBilibili").hide();
            $(".bilibili").show();
          } else {
            this.isEnd = true;
          }
        } else {
          console.error("获取番剧数据失败");
        }
        $(".honorofkings").removeClass("loading");
        this.isLoading = false;
      },
    },
  });
};

window.bilibiliPjax = function (serialNumber) {
  if ($(".bilibili").length === 0) return;
  initBilibiliVue();
  bilibiliVue && bilibiliVue.init();
};

!(function () {
  initBilibiliVue();
  !window.pjaxSerialNumber && bilibiliVue && bilibiliVue.init();
})();
