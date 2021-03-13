<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
<!--        <p>知也</p>-->
        <span>知也论坛后台管理系统</span>
      </div>
      <div>
        <span class='name-title'>欢迎您，{{username}}！</span>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color='rgba(48,65,86, 1)'
          text-color="#fff"
          active-text-color="#409FFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="2+''">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj['2']"></i>
              <!-- 文本 -->
              <span>管理员管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/managelist'" @click="saveNavState('/managelist')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>管理员列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu :index="3+''">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj['3']"></i>
              <!-- 文本 -->
              <span>板块管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/fatherlist'" @click="saveNavState('/fatherlist')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>父板块列表</span>
              </template>
            </el-menu-item>
            <el-menu-item :index="'/sonlist'" @click="saveNavState('/sonlist')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>子板块列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu :index="4+''">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj['4']"></i>
              <!-- 文本 -->
              <span>帖子管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/contentlist'" @click="saveNavState('/contentlist')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>帖子列表</span>
              </template>
            </el-menu-item>

          </el-submenu>
          <el-submenu :index="5+''">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj['5']"></i>
              <!-- 文本 -->
              <span>用户管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/userlist'" @click="saveNavState('/userlist')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>用户列表</span>
              </template>
            </el-menu-item>

          </el-submenu>
          <el-submenu :index="1+''">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj['1']"></i>
              <!-- 文本 -->
              <span>系统管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/system'" @click="saveNavState('/system')">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>数据统计</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      iconsObj: {
        1: 'iconfont icon-baobiao',
        2: 'iconfont icon-tijikongjian',
        3: 'iconfont icon-shangpin',
        4: 'iconfont icon-danju',
        5: 'iconfont icon-user'
      },
      // 是否折叠菜单栏
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      // 管理员名称
      username: window.sessionStorage.getItem('username')
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
    this.isLogin()
  },
  methods: {
    // 判断管理员是否登录
    async isLogin() {
      if (!window.sessionStorage.getItem('username')) {
        this.$router.push('/login')
      }
    },
    async logout() {
      await this.$http.get('/logout.php')
      this.$router.push('/login')
    },
    // 点击按钮 切换菜单的折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: rgba(48,65,86, 1);
  display: flex;
  justify-content: space-between;
  padding-left:10px;
  align-items:center;
  color: #fff;
  font-size: 20px;

  > div{
    display: flex;
    align-items: center;

    p{
      font-family: '华文隶书';
      font-size: 45px;
    }

    span{
      margin-left: 20px;
    }
  }
  .name-title{
    font-size: 16px;
  }
}
.el-aside{
  background-color: rgba(48,65,86, 1);
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right:10px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height:24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor:pointer;
}
::v-deep{
  .el-submenu .el-menu-item{
    background-color: rgba(31,45,61,1) !important;
  }
  .el-submenu__title:hover{
    background-color: rgba(0,21,40,1) !important;
  }
  .el-menu-item:hover{
    background-color: rgba(0,21,40,1) !important;
  }
}
</style>
