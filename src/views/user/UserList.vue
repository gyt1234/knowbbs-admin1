<template>
  <div>
    <bread father-title='用户管理' son-title='用户列表'></bread>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户名称" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 管理员列表区域 -->
      <el-table
        :data="userList"
        stripe
        header-align='center'
        fit
        border
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="注册时间" prop='create_time'></el-table-column>
        <el-table-column label="上次登录时间" prop="last_time">
          <template slot-scope='scope'>
            <span>{{scope.row.last_time? scope.row.last_time: '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope='scope'>
            <!-- 详情按钮 -->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <i class='el-icon-tickets icons' @click='showDialog(scope.row.id)'></i>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <i class='el-icon-delete icons' @click="deleteUserById(scope.row.id)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 8, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="allNum"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 查看用户详情的的对话框 -->
    <el-dialog title="用户详情" :visible.sync="showDialogVisible" width="30%">
      <el-row :gutter='20'>
        <el-col :span='8' class='viewClass'>用户名：</el-col>
        <el-col :span='14'>{{editForm.name}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='8' class='viewClass'>注册时间：</el-col>
        <el-col :span='14'>{{editForm.create_time}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='8' class='viewClass'>上次登录时间：</el-col>
        <el-col :span='14'>{{editForm.last_time? editForm.last_time: '--'}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='8' class='viewClass'>头像：</el-col>
<!--        <el-col :span='17'>{{editForm.last_time}}</el-col>-->
      </el-row>
      <span slot="footer" class="dialog-footer">
       <el-button @click="showDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bread from '@/components/Bread'
export default {
  name: 'UserList',
  components: { Bread },
  data() {
    return {
      // 获取帖子列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前的页数
        pagesize: 8 // 当前每页显示多少条数据
      },
      // 所有的帖子数
      allNum: 0,
      // 查询参数
      // 用户列表数据
      userList: [],
      // 控制用户详情弹框的显示与隐藏
      showDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 当前查看的的用户id
      viewUserId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('/user.php', { params: this.queryInfo })
      this.userList = res
      const { data: res1 } = await this.$http.get('/num_user.php', { params: this.queryInfo })
      this.allNum = Number(res1.count)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 展示用户详情的对话框
    async showDialog (userId) {
      const { data: res } = await this.$http.get('/user_query.php', { params: { id: userId } })
      this.editForm = res
      this.showDialogVisible = true
    },
    // 根据id 删除对应的用户信息
    async deleteUserById (userId) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除 则返回值为字符串 confirm
      // 如果取消删除 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消了删除！')
      }
      const { data: res } = await this.$http.get('/user_delete.php', { params: { id: userId } })
      if (res.code !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    }
  }
}
</script>
<style lang='less' scoped>
.viewClass{
  font-weight: bold;
  text-align: right;
  height: 25px;
}
</style>
