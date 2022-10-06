var honorofkingsVue = null;
var honorofkings_api = $('#honorofkings_api').val() || 'https://haibarai.com/timi';

axios.defaults.baseURL = honorofkings_api;

console.log({
  honorofkings_api
});

//初始化vue绑定
const initHonorofkingsVue = function () {
  if ($('.honorofkings').length === 0) return;
  honorofkingsVue = new Vue({
    el: '#honorofkings',
    data: {
      roleWx: [], //微信大区
      roleQQ: [], //qq大区
      isLogin: false,
      isLoading: true,
      queryParams: { //分页信息
        start: 0,
        limit: 15,
      },
      userInfo: {
        name: '一个小可爱', //账号名
        avatar: '//game.gtimg.cn/images/yxzj/web201605/page/per_pic1.jpg', //用户头像
        credit: 0, //信誉积分
        grade: '小青铜', //段位
        gradeImg: '//game.gtimg.cn/images/yxzj/web201605/page/rank15.png', //段位图片
        ladderWinRate: '0%', //排位胜率
        ladderInfo: [
          "全部比赛：0 胜场：0 胜率：0%",
          "排位赛：0 胜场：3317 胜率：0%"
        ], //比赛信息
        heroCount: 0, //英雄数量
        skinCount: 0, //皮肤数量
        updateTime: "无更新"
      },
      honorofkingsContents: [],
      isEnd: false //全部加载
    },
    created() {},
    mounted() {},
    methods: {
      //初始化数据
      init() {
        console.log('init');

        //验证admin登陆
        let aa = localStorage.getItem('HALO__Access-Token')
        if (aa) {
          aa = JSON.parse(aa);
          if (aa.value && aa.value.access_token)
            $.ajax({
              url: '/api/admin/attachments',
              type: 'GET',
              beforeSend: function (request) {
                request.setRequestHeader("Admin-Authorization", aa.value.access_token);
              },
            }).then(res => {
              this.isLogin = res.status == 200;
              if (this.isLogin) {
                //加载大区 wx
                axios.get('/wz/getRole?type=1').then(res => {
                  console.log(res);
                  if (res.status == 200 && res.data.Code == 10000) {
                    this.roleWx = res.data.Data;
                  }
                })
                //加载大区 qq
                axios.get('/wz/getRole?type=2').then(res => {
                  if (res.status == 200 && res.data.Code == 10000) {
                    this.roleQQ = res.data.Data;
                  }
                })
              }
            }).catch(e => {
              console.error(e);
            })
        }

        $('.noHonorofkings').show();
        this.sLoading = true;
        $('.honorofkings').addClass('loading');

        const getUserInfo = axios.get('/user/info');

        axios.all(
            [this.getRecordData(this.queryParams), getUserInfo]
          ).then((res) => {
            console.log({
              res
            });
            if (res.length == 2) {
              const recordData = res[0];
              const userdData = res[1];

              this.setRecordData(recordData)

              //用户信息
              if (userdData.data.Code == 10000) {
                this.userInfo = userdData.data.Data
              }

              $(".honorofkings").show();
            }
          })
          .catch((err) => console.error(err))
          .finally(() => {
            console.log(`finally`)
            $('.honorofkings').removeClass('loading');
            this.isLoading = false;
          });
      },
      /* 获取王者荣耀战绩数据 */
      getRecordData(params) {
        return axios.get('/record/get', {
          params
        });
      },
      //获取更多
      async getMore(params) {
        let recordData = await this.getRecordData(params)
        this.setRecordData(recordData)
      },
      //设置战绩显示
      setRecordData(recordData) {
        //战绩
        if (recordData.data.Code == 10000) {
          const honorofkingsContents = recordData.data.Data.data || [];
          if (honorofkingsContents.length !== 0) {
            this.isEnd = honorofkingsContents.length < this.queryParams.limit;
            this.honorofkingsContents = honorofkingsContents;
            $('.noHonorofkings').hide();
          } else {
            this.isEnd = true;
          }
        } else {
          console.error("获取王者战绩数据失败");
        }
      },
    }
  });
}


window.honorofkingsPjax = function (serialNumber) {
  if ($('.honorofkings').length === 0) return;
  initHonorofkingsVue();
  honorofkingsVue && honorofkingsVue.init();
};

!(function () {
  initHonorofkingsVue();
  !window.pjaxSerialNumber && honorofkingsVue && honorofkingsVue.init();
})();