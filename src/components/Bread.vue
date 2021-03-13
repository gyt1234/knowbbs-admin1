<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{fatherTitle}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{sonTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'Bread',
  props: {
    fatherTitle: String,
    sonTitle: String
  }
}
</script>

<style lang='less' scoped></style>
