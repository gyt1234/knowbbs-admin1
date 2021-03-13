<template>
  <div>
    <bread father-title='系统管理' son-title='数据统计'></bread>
    <el-card>
      <div class='section'>
        <div>当前登录：{{adminInfo.username}}</div>
        <div>所属角色：{{adminInfo.level === '0'? '超级管理员':'普通管理员'}}</div>
        <div>创建时间：{{adminInfo.create_time}}</div>
      </div>
      <div class='division'/>
      <div class='section flex-section'>
        <div>父板块({{info.count_father}})</div>
        <div>子板块({{info.count_son}})</div>
        <div>帖子({{info.count_content}})</div>
        <div>用户({{info.count_user}})</div>
        <div>管理员({{info.count_manage}})</div>
      </div>
      <div class='division'/>
      <div class='section'>
        <div>服务器操作系统：{{info.os}}</div>
        <div>服务器软件：{{info.server}}</div>
        <div>Mysql版本：{{info.mysql}}</div>
        <div>最大文件上传：{{info.file}}</div>
        <div>内存限制：{{info.memory}}</div>
      </div>
      <div class='division'/>
      <div class='section'>
        <div>程序安装位置（绝对位置）：{{info.path}}</div>
        <div>程序在Web根目录下的位置（首页的url地址）：{{info.url}}</div>
        <div>程序版本：knowbbs V1.0 <a href='https://github.com/gyt1234/knowbbs-admin'>查看最新版本</a></div>
        <div>程序作者：葛雅婷:))</div>
        <div>github链接：<a href='https://github.com/gyt1234/knowbbs-admin'>点击跳转</a></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Bread from '@/components/Bread'
export default {
  name: 'System',
  components: { Bread },
  data() {
    return {
      adminInfo: {
        username: window.sessionStorage.getItem('username'),
        level: window.sessionStorage.getItem('level'),
        create_time: window.sessionStorage.getItem('create_time')
      },
      info: {}
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const { data: res } = await this.$http.get('/data.php')
      this.info = res
    }
  }
}
</script>

<style lang='less' scoped>
::v-deep{
  .el-card__body{
    padding-left: 0;
    padding-right: 0;
  }
}
.section{
  padding-left: 20px;
  padding-right: 20px;
  font-size: 14px;
  color: rgb(96,98,102);
}
.flex-section{
  width: 500px;
  display: flex;
  justify-content: space-between;
  flex: 1;
}
.division{
  height: 0.1px;
  background-color: #cccccc;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
