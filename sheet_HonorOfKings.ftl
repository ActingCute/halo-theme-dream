<#include "template/layout.ftl">
  <@layout title="王者荣耀 - ${blog_title!}" canonical="/s/HonorOfKings">

    <#-- 搬运王者的样式 -->

      <link rel="stylesheet" type="text/css" href="https://pvp.qq.com/web201605/css/hisrecord-css.css">

      <style>
        /*调整布局  */
        .his_info_m {
          padding-left: 8px !important;
        }

        .his_head_l {
          width: 5.38rem !important;
          height: 5.38rem !important;
        }

        .his_last_game {
          width: 100% !important;
        }

        .cur {
          cursor: pointer;
        }

        .column-left {
          top: 0 !important;
          /*不知道为啥会多一个top*/
        }

        .his_info_m {
          position: relative;
        }

        .his_info_mvp1 {
          position: absolute;
          top: 20px;
        }

        .honorofkingsContents .avatar {
          width: 5rem;
          transition: all 2s;
          padding: 4px;
          background: var(--light-b);
          margin: 2em auto 0.5em auto;
        }

        .honorofkingsContents {
          padding: 1rem;
        }

        @media screen and (max-width: 1700px) {

          .his_info_equipment {
            position: relative;
            margin-left: 10px;

          }


          .his_last_game {
            height: 220px;
          }

          .his_info_dan {
            width: 7rem;
            height: 7.5rem;
            position: absolute;
            right: 0;
          }


        }




        @media screen and (max-width: 418px) {

          .his_info_equipment {
            width: 100%;
            padding-right: 10px;
          }

          .his_last_game {
            padding: 0
          }
        }

        @media screen and (max-width: 375px) {

          .hisdata {
            display: none;
          }

          .his_head_l {
            padding: 0;
          }

          .his_info_equipment {
            margin-left: 0;
          }

          .his_info_m {
            position: absolute;
            right: 0;
          }

        }

        @media screen and (max-width: 354px) {

          .his_info_m_maptxt {
            display: none;
          }

          .his_info_m p {
            position: absolute;
            right: 10px;
          }
        }

        @media screen and (max-width: 1415px) {

          .his_info_dan {
            display: none;
          }
        }


        @media screen and (max-width: 1214px) and (min-width: 855px) {

          .his_info_dan {
            display: block;
          }
        }

        @media screen and (max-width: 855px) and (min-width: 770px) {

          .his_info_dan {
            display: none;
          }
        }

        @media screen and (max-width: 769px) and (min-width: 567px) {

          .his_info_dan {
            display: block;
          }
        }


        @media screen and (max-width: 1415px) {

          .honorofkingsUserBox:nth-child(2) {
            display: none !important;
          }
        }

        .honorofkings {
          display: none;
        }

        .honorofkingsUserInfo {
          display: flex;
          padding-bottom: 1.5rem;
        }

        .honorofkingsUserInfo .honorofkingsUserBox {
          flex: 1;
        }

        .honorofkingsUserInfo .honorofkingsUserBox .honorofkingsUserItemBox {
          display: flex;
          text-align: center;
          margin-top: 1rem;
        }

        .honorofkingsUserInfo .honorofkingsUserBox .honorofkingsUserItemBox .honorofkingsUserItem {
          flex: 1;
        }

        .honorofkingsUserInfo .honorofkingsUserBox .honorofkingsUserItemBox .honorofkingsUserItem .honorofkingsUserItemValue {
          color: blue;
          margin-top: 0.5rem;
          font-size: 1.5rem;

        }

        .honorofkingsUserInfo .honorofkingsUserBox .honorofkingsUserItemBox .honorofkingsUserItem .honorofkingsUserItemTitle {
          font-size: .9rem;
        }

        .honorofkingsUserInfo .honorofkingsUserBox .honorofkingsUserName {
          font-size: 1.2rem;
          text-align: center;
          margin-top: 1rem;
        }

        .honorofkingsContentsItem{
          position:relative;
        }

        /*弹窗*/
        .modal {}
      </style>
      <div class="honorofkings" id="honorofkings">

        <#-- 个人信息 -->
          <div class="card honorofkingsUserInfo widget is-not-hidden" id="profile">
            <div class="honorofkingsUserBox">
              <figure class="image">
                <img class="avatar" :src="userInfo.avatar" :alt="userInfo.name">
              </figure>
              <p class="honorofkingsUserName">
                <span v-show="!viewRole"> {{userInfo.name}}</span>
                <span v-if="isLogin">
                  <span class="cur" style="color:blue" v-show="!viewRole" @click="toViewRole(true)">切换大区</span>
                   <span id="modal" style="display:none" class="modal" v-show="viewRole">
                    <select number v-model="loginData.loginType" @change="setRole">
                      <option value="0">平台</option>
                      <option value="1">微信</option>
                      <option value="2">QQ</option>
                    </select>

                    <select number v-model="loginData.equipment" @change="setRole">
                      <option value="0">渠道</option>
                      <option value="1" v-show="loginData.loginType == 1">安卓</option>
                      <option value="2" v-show="loginData.loginType == 1">IOS</option>
                    </select>


                    <select number v-model="loginData.code" @change="setRole">
                      <option value="0">大区</option>
                      <option :value="item.v" v-for="(item,index) in roleData" :key="index+'roleData'">
                        {{item.t}}
                      </option>
                    </select>
                  </span>

                  <span class="cur" style="color:red" @click="syncData">更新</span>
                </span></p>
              <div class="honorofkingsUserItemBox">
                <div class="honorofkingsUserItem">
                  <div class="honorofkingsUserItemTitle">英雄</div>
                  <div class="honorofkingsUserItemValue">{{userInfo.heroCount}} </div>
                </div>
                <div class="honorofkingsUserItem">
                  <div class="honorofkingsUserItemTitle">皮肤</div>
                  <div class="honorofkingsUserItemValue">{{userInfo.skinCount}} </div>
                </div>
                <div class="honorofkingsUserItem">
                  <div class="honorofkingsUserItemTitle">段位</div>
                  <div class="honorofkingsUserItemValue">{{userInfo.grade}} </div>
                </div>
              </div>
            </div>
            <div class="honorofkingsUserBox">
              <figure class="image">
                <img class="avatar" :src="userInfo.gradeImg" :alt="userInfo.grade">
              </figure>
              <p class="honorofkingsUserName">{{userInfo.grade}}</p>
              <div class="honorofkingsUserItemBox" v-if="userInfo.ladderInfo && userInfo.ladderInfo.length == 2">
                <div class="honorofkingsUserItem">
                  <div class="honorofkingsUserItemTitle">
                    全部比赛({{userInfo.ladderInfo[0].substring( userInfo.ladderInfo[0].indexOf("全部比赛：") + 5, userInfo.ladderInfo[0].indexOf("/胜场"))}})
                  </div>
                  <#-- <div class="honorofkingsUserItemValue">
                    {{userInfo.ladderInfo[0].substring( userInfo.ladderInfo[0].indexOf("/胜场")+1, userInfo.ladderInfo[0].indexOf("/胜率"))}}
                </div> -->
                <div class="honorofkingsUserItemValue">
                  {{userInfo.ladderInfo[0].substring( userInfo.ladderInfo[0].indexOf("/胜率")+1, userInfo.ladderInfo[0].indexOf("%"))}}%
                </div>
              </div>
              <div class="honorofkingsUserItem">
                <div class="honorofkingsUserItemTitle">
                  排位赛({{userInfo.ladderInfo[1].substring( userInfo.ladderInfo[1].indexOf("排位赛：") + 4, userInfo.ladderInfo[1].indexOf("/胜场"))}})
                </div>
                <#-- <div class="honorofkingsUserItemValue">
                  {{userInfo.ladderInfo[1].substring( userInfo.ladderInfo[1].indexOf("/胜场")+1, userInfo.ladderInfo[1].indexOf("/胜率"))}}
              </div> -->
              <div class="honorofkingsUserItemValue">
                {{userInfo.ladderInfo[1].substring( userInfo.ladderInfo[1].indexOf("/胜率")+1, userInfo.ladderInfo[1].indexOf("%"))}}%
              </div>
            </div>
            <div class="honorofkingsUserItem">
              <div class="honorofkingsUserItemTitle">信誉积分</div>
              <div class="honorofkingsUserItemValue">{{userInfo.credit}} </div>
            </div>
          </div>
      </div>
      </div>
      <#--历史战绩 -->
        <div class="card honorofkingsContents">
          <div class="honorofkingsContentsItem" v-for="(item,index) in honorofkingsContents" :key="index+'data'">
              <#--  <img v-if="item.mvpImg.length" class="his_info_mvp1" width="40" src="//game.gtimg.cn/images/yxzj/web201605/page/icon_MVP.png">  -->
            <div class="his_last_game" id="his_last_game10_1" style="">
              <div class="his_last_linfo">
                <div class="his_head_l">
                  <img class="his_headimg" width="70" height="70" :src="item.hero" alt="">
                </div>
                <div class="his_info_m">
                  <p>
                    <span class="his_info_m_txt "
                      :class="{'_faltxt':item.result != '胜利','_suctxt':item.result == '胜利'}">胜利</span>
                    <span class="his_info_m_maptxt">{{item.type}}</span>
                    <span class="his_info_m_timetxt">时长:<span class="gameduration">{{item.useTime}}</span>分钟</span>
                  </p>

                  <div style="width:250px;height: 25px;background-position:0 0;overflow: hidden;">
                    <img class="hisdata" :src="item.kda" alt="">
                  </div>
                </div>
                <img class="his_info_dan" width="50" height="60" :src="item.gameLevel">
                <div class="his_info_equipment">
                  <p>
                    <span class="equipment_txt">最终出装</span>
                    <span class="equipment_time">{{item.gameTime}}</span>
                  </p>
                  <p class="equipment_imglist">
                    <img width="50" height="50" :src="src" v-for="(src,srcIndex) in item.equipmentImglist"
                      :key="srcIndex+'img'">
                </div>

              </div>
            </div>
          </div>

        </div>
        </div>
        <div class=" card card-empty noHonorofkings">
          <i class="fa fa-inbox"></i>
          还没有王者战绩呢，回<a href="${context!}">主页</a>看看吧
        </div>
        <input style="display:none" id="honorofkings_api" value="${settings.honorofkings_api!}" />
  </@layout>