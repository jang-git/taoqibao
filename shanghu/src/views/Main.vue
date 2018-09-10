<style lang="less">
@import './main.less';
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <!-- <scroll-bar ref="scrollBar"> -->
                <shrinkable-menu
                    :shrink="shrink"
                    @on-change="handleSubmenuChange"
                    :theme="menuTheme"
                    :before-push="beforePush"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                    <div slot="top" class="logo-con">
                        <img v-show="!shrink"  src="../images/logo.png" key="max-logo" />
                        <img v-show="shrink" src="../images/logo-min.jpg" key="min-logo" />
                    </div>
                </shrinkable-menu>
            <!-- </scroll-bar> -->
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <lock-screen></lock-screen>
                    <message-tip v-model="mesCount"></message-tip>
                    <theme-switch></theme-switch>

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;">商家</Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <!-- <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div> -->
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <!-- <keep-alive :include="cachePage"> -->
                    <router-view></router-view>
                <!-- </keep-alive> -->
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import util from '@/libs/util';

import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu';
import tagsPageOpened from './main-components/tags-page-opened';
import breadcrumbNav from './main-components/breadcrumb-nav';
import fullScreen from './main-components/fullscreen';
import lockScreen from './main-components/lockscreen/lockscreen';
import messageTip from './main-components/message-tip';
import themeSwitch from './main-components/theme-switch/theme-switch';
import scrollBar from './my-components/scroll-bar/vue-scroller-bars';

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip,
    themeSwitch,
    scrollBar,
  },
  data() {
    return {
      shrink: false,
      userName: '',
      mesCount: 3,
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
    };
  },
  methods: {
    init() {
      const pathArr = util.setCurrentPath(this, this.$route.name);
      // console.log(pathArr);
      if (pathArr.length >= 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name);
      }
      this.userName = Cookies.get('uname');
      const messageCount = 3;
      this.messageCount = messageCount.toString();
      // this.checkTag(this.$route.name);
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleClickUserDropdown(name) {
      if (name === 'ownSpace') {
        util.openNewPage(this, 'ownspace_index');
        this.$router.push({
          name: 'ownspace_index',
        });
      } else if (name === 'loginout') {
        // 退出登录
        this.$store.commit('logout', this);
        this.$store.commit('clearOpenedSubmenu');
        this.$router.push({
          name: 'login',
        });
      }
    },
    checkTag(name) {
      const openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
        return false;
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {},
        );
      }
    },
    handleSubmenuChange(val) {
      console.log(val);
    },
    beforePush(name) {
      if (name === 'accesstest_index') {
        return false;
      } else {
        return true;
      }
    },
    fullscreenChange(isFullScreen) {
      console.log(isFullScreen);
    },
    scrollBarResize() {
      // this.$refs.scrollBar.resize();
    },
  },
  watch: {
    $route(to) {
      this.$store.commit('setCurrentPageName', to.name);
      const pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    },
    openedSubmenuArr() {
      setTimeout(() => {
        this.scrollBarResize();
      }, 300);
    },
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.scrollBarResize);
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatorPath() {
      return '';
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
  },
};
</script>
