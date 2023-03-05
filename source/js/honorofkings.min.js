var honorofkingsVue = null;
var honorofkings_api = $("#honorofkings_api").val() || "/wz";

console.log({
  honorofkings_api,
});

var hostname = location.hostname;
//test
// hostname = "123";

//初始化vue绑定
const initHonorofkingsVue = function () {
  if ($(".honorofkings").length === 0) return;
  honorofkingsVue = new Vue({
    el: "#honorofkings",
    data: {
      show: false,
      roleData: [], //大区
      loginData: {
        hostname: hostname,
        loginType: 1,
        code: 4078,
        equipment: 2,
      },
      viewRole: false,
      roleWx: [], //微信大区
      roleQQ: [], //qq大区
      isLogin: false,
      isLoading: true,
      loading: false,
      queryParams: {
        //分页信息
        start: 0,
        limit: 10,
        hostname: hostname,
      },
      userInfo: {
        name: "一个小可爱", //账号名
        avatar: "//game.gtimg.cn/images/yxzj/web201605/page/per_pic1.jpg", //用户头像
        credit: 0, //信誉积分
        grade: "小青铜", //段位
        gradeImg: "//game.gtimg.cn/images/yxzj/web201605/page/rank15.png", //段位图片
        ladderWinRate: "0%", //排位胜率
        ladderInfo: [
          "全部比赛：0 胜场：0 胜率：0%",
          "排位赛：0 胜场：0 胜率：0%",
        ], //比赛信息
        heroCount: 0, //英雄数量
        skinCount: 0, //皮肤数量
        updateTime: "无更新",
      },
      honorofkingsContents: [],
      isEnd: false, //全部加载
    },
    created() {
      this.show = true;
      // 滚动加载
      window.addEventListener("scroll", () => {
        let $honorofkingsGallery = $("#honorofkings");
        if (
          $honorofkingsGallery.length !== 0 &&
          $(window).scrollTop() + $(window).height() >=
            $honorofkingsGallery.height()
        ) {
          if (this.isEnd) {
            $(".honorofkings").removeClass("loading");
            this.isLoading = false;
          }

          if (this.isLoading || this.isEnd) return;
          this.queryParams.start++;
          this.getMore(this.queryParams);
        }
      });
    },
    mounted() {},
    methods: {
      syncData() {
        if (this.loading) {
          alert("请稍后");
          return;
        }
        //更新数据
        if (
          this.loginData.loginType &&
          this.loginData.equipment &&
          this.loginData.code
        ) {
          let loginData = JSON.parse(JSON.stringify(this.loginData));
          loginData = {
            //登陆参数
            hostname: hostname,
            loginType: Number(loginData.loginType), //wx qq
            code: Number(loginData.code), //大区
            equipment: Number(loginData.equipment), //安卓 ios
          };
          axios
            .post(honorofkings_api + "/getCode", loginData)
            .then((res) => {
              if (res.status == 200 && res.data.code == 10000) {
                console.log("res==", res);
                alert("请在30秒内完成扫码");
                const imgPath = (honorofkings_api + res.data.data.data).replace(
                  "//public",
                  "/"
                );
                console.log({
                  imgPath,
                });
                window.open(imgPath);
              } else {
                console.error(res);
                alert("操作失败");
                this.loading = false;
              }
              this.loading = false;
            })
            .catch((e) => {
              this.loading = false;
              alert("操作失败");
              console.error(e);
            });
        } else {
          alert("请完成选择");
        }
      },

      setRole() {
        if (this.loginData.loginType && this.loginData.equipment) {
          let ck = "weixin";
          let sk = "ios";

          let roleData = this.roleWx;

          if (this.loginData.loginType == 2) {
            ck = "qq";
            roleData = this.roleQQ;
          }

          if (this.loginData.equipment > 2) {
            sk = "android";
          }

          //微信
          this.roleData = roleData.filter(
            (item) => item.ck == ck && item.sk == sk
          );
        }
      },
      toViewRole(view) {
        if (view) {
          $("#modal").css("dispaly", "block");
        } else {
          $("#modal").css("dispaly", "none");
        }
        this.viewRole = view;
      },
      //初始化数据
      async init() {
        $(".noHonorofkings").show();

        //验证admin登陆
        let aa = localStorage.getItem("HALO__Access-Token");
        if (aa) {
          aa = JSON.parse(aa);
          if (aa.value && aa.value.access_token)
            $.ajax({
              url: "/api/admin/attachments",
              type: "GET",
              beforeSend: function (request) {
                request.setRequestHeader(
                  "Admin-Authorization",
                  aa.value.access_token
                );
              },
            })
              .then((res) => {
                this.isLogin = res.status == 200;
                if (this.isLogin) {
                  //加载大区 wx
                  axios
                    .get(honorofkings_api + "/getRole?type=1")
                    .then((res) => {
                      console.log(res);
                      if (res.status == 200 && res.data.code == 10000) {
                        this.roleWx = res.data.data;
                      }
                    });
                  //加载大区 qq
                  axios
                    .get(honorofkings_api + "/getRole?type=2")
                    .then((res) => {
                      if (res.status == 200 && res.data.code == 10000) {
                        this.roleQQ = res.data.data;
                      }
                    });
                }
              })
              .catch((e) => {
                console.error(e);
              });
        }

        axios
          .all([
            this.getRecordData(this.queryParams),
            axios.post(honorofkings_api + "/getUserInfoData", {
              hostname: hostname,
            }),
          ])
          .then((res) => {
            console.log({
              res,
            });
            if (res.length == 2) {
              const recordData = res[0].data;
              const userdData = res[1].data;

              this.setRecordData(recordData);

              //用户信息
              if (userdData.code == 10000) {
                this.userInfo = userdData.data.data;
              }

              $(".honorofkings").show();
            }
          })
          .catch((err) => console.error(err))
          .finally(() => {
            console.log(`finally`);
            $(".honorofkings").removeClass("loading");
            this.isLoading = false;
          });
      },
      /* 获取王者荣耀战绩数据 */
      getRecordData(params) {
        this.isLoading = true;
        $(".honorofkings").addClass("loading");
        return axios.post(honorofkings_api + "/getRecord", params);
      },
      //获取更多
      async getMore(params) {
        this.isLoading = true;
        $(".honorofkings").addClass("loading");
        let recordData = await this.getRecordData(params);
        this.setRecordData(recordData.data);
      },
      //设置战绩显示
      setRecordData(recordData) {
        //战绩
        if (recordData.code == 10000) {
          const honorofkingsContents = recordData.data.data || [];
          if (honorofkingsContents.length != 0) {
            this.isEnd =
              this.honorofkingsContents.length >= recordData.data.total;
            this.honorofkingsContents.push(...honorofkingsContents);
            $(".noHonorofkings").hide();
          } else {
            this.isEnd = true;
          }
          this.isLoading = false;
        } else {
          console.error("获取王者战绩数据失败");
        }
      },
    },
  });
};

window.honorofkingsPjax = function (serialNumber) {
  if ($(".honorofkings").length === 0) return;
  initHonorofkingsVue();
  honorofkingsVue && honorofkingsVue.init();
};

!(function () {
  initHonorofkingsVue();
  !window.pjaxSerialNumber && honorofkingsVue && honorofkingsVue.init();
})();
