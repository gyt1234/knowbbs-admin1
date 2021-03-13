<template>
  <div>
    <bread father-title='帖子管理' son-title='帖子列表'></bread>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入标题关键词" v-model="queryInfo.query" clearable @clear="getContentList">
            <el-button slot="append" icon="el-icon-search" @click="getContentList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 帖子列表区域 -->
      <el-table
        :data="contentList"
        stripe
        header-align='center'
        fit
        border
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属板块" prop="module_name" width='100' show-overflow-tooltip></el-table-column>
        <el-table-column label="发帖用户" prop="user_name" show-overflow-tooltip width='100'></el-table-column>
        <el-table-column label="浏览数" prop="times" width='80'></el-table-column>
        <el-table-column label="评论数" prop="comments" width='80'></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width='150'></el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope='scope'>
            <!-- 详情按钮 -->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <i class='el-icon-tickets icons' @click='showDialog(scope.row.id)'></i>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <i class='el-icon-delete icons' @click="deleteContentById(scope.row.id)"></i>
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
    <!-- 查看帖子详情的的对话框 -->
    <el-dialog title="帖子详情" :visible.sync="showDialogVisible" width="30%">
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>标题：</el-col>
        <el-col :span='14'>{{editForm.title}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>所属板块：</el-col>
        <el-col :span='14'>{{editForm.module_name}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>发帖用户：</el-col>
        <el-col :span='14'>{{editForm.user_name}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>浏览数：</el-col>
        <el-col :span='14'>{{editForm.times}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>评论数：</el-col>
        <el-col :span='14'>{{editForm.comments}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>创建时间：</el-col>
        <el-col :span='17'>{{editForm.create_time}}</el-col>
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
  name: 'ContentList',
  components: { Bread },
  data() {
    return {
      // 获取帖子列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前的页数
        pagesize: 7 // 当前每页显示多少条数据
      },
      // 帖子列表数据
      contentList: [],
      // 控制详情弹框的显示与隐藏
      showDialogVisible: false,
      // 查询到的帖子信息对象
      editForm: {},
      // 所有的帖子数
      allNum: 0
    }
  },
  created() {
    this.getContentList()
  },
  methods: {
    // 获取帖子列表
    async getContentList() {
      const { data: res } = await this.$http.get('/content.php', { params: this.queryInfo })
      this.contentList = res
      const { data: res1 } = await this.$http.get('/num_content.php', { params: this.queryInfo })
      this.allNum = Number(res1.count)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getContentList()
    },
    // 监听 页码 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getContentList()
    },
    // 展示帖子详情的对话框
    async showDialog (contentId) {
      const { data: res } = await this.$http.get('/content_query.php', { params: { id: contentId } })
      this.editForm = res
      this.showDialogVisible = true
    },
    // 根据id 删除对应的帖子信息
    async deleteContentById (contentId) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该帖子, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除 则返回值为字符串 confirm
      // 如果取消删除 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消了删除！')
      }
      const { data: res } = await this.$http.get('/content_delete.php', { params: { id: contentId } })
      if (res.code !== 200) {
        return this.$message.error('删除帖子失败！')
      }
      this.$message.success('删除帖子成功！')
      this.getContentList()
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
