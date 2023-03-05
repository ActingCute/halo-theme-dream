<#include "template/layout.ftl">
  <@layout title="追番 - ${blog_title!}" canonical="/s/fan">

    <style>
      .noBilibili {
        display: none;
      }

      .imgBox {
        margin: 0 auto;
        display: none
      }
      

      .imgItem {
        display: inline-block;
        width: 25%;
        aspect-ratio: 3/4;
        margin: 0 auto;
        position: relative;
        padding:5px
      }

      #bilibili .imgItem1::before {
        content: "";
        position: absolute;
/*        background-color: paleturquoise; var(--width)*/
        background: linear-gradient(
            to right,
            paleturquoise 0%,
            paleturquoise var(--width),
            pink var(--width),
            pink 100%
          );
        width: 100%;  
        height: 0.5rem;
         width: 100%;
        bottom: 0px;
        left: 0;
        bottom:0px;
      }

      .imgItem1 {
        height: 100%;
        background-color: #eee;
        position: relative;

        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }

      .isEnd {
        text-align: center;
        padding: 1rem;
      }

      @keyframes maskframes {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }

      .descText {
        position: absolute;
        left: 0%;
        right: 0%;
        top: 0%;
        bottom: 0%;
        opacity: 0;

        margin:5px;

        color: #eee;
        background-color: rgb(31, 30, 30, 0.7);

        display: table-cell;
        vertical-align: bottom;
      }

      .descText1 {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .descText2 {
        position: absolute;
        bottom: 0;
      }

      .descText:hover {
        animation: maskframes 300ms ease-in;
        animation-fill-mode: forwards;
      }

      .des {
        width: 98%;
        padding-bottom: 10px;
        margin: 0 auto;
        text-align: left;
      }

      .watched_progress_text {
        background-color: pink;
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333;
        position: relative;
      }

      .watched_progress {
        position: absolute;
        left: 0;
        background-color: paleturquoise;
        height: 100%;
        bottom: 0px
      }

      .watched_progress_text1 {
       }

      @media (max-width: 750px) {
        .imgItem {
          width: 33%;
        }
      }

      @media (max-width: 600px) {
        .imgItem {
          width: 50%;
        }
      }

      @media (max-width: 400px) {
        .imgItem {
          width: 100%;
        }
      }
    </style>

    <div class="imgBox bilibili card" id="bilibili" v-show="show">
      <div class="imgItem" :style="{ '--width': (item.watched_progress*100)+'%' }" v-for="(item,index) in bilibiliContents" :key="index+'bilibiliContents'">
        <div class="imgItem1" v-bind:style="{ backgroundImage: 'url(' + item.img + ')' }"></div>
        <div class="descText">
          <div class="descText1">
            <div class="descText2">
              <div class="des" @click="window.open(item.link)">{{item.des}}</div>
              <div class="watched_progress_text">
                <div class="watched_progress_text1">{{item.watched_progress_text}}</div>
                <div class="watched_progress" :style="{width:(item.watched_progress*100)+'%'}">
                </div>
            </div>
          </div>

        </div>
        </div>

      </div>
    <div class="isEnd" v-show="isEnd">数据已经全部加载完了啦~</div>
    </div>

    <div class="card card-empty noBilibili">
      <i class="fa fa-inbox"></i>
      这家伙居然不追番，回<a href="${context!}">主页</a>看看吧
    </div>

    <input style="display:none" id="bilibili_api" value="${settings.bilibili_api!}" />
  </@layout>