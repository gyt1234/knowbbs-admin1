<template>
  <div>
    <bread father-title='板块管理' son-title='子板块列表'></bread>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入子板块名称" v-model="queryInfo.query" clearable @clear="getSonList">
            <el-button slot="append" icon="el-icon-search" @click="getSonList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click='addDialog'>新增子板块</el-button>
        </el-col>
      </el-row>
      <!-- 子板块列表区域 -->
      <el-table
        :data="sonList"
        stripe
        header-align='center'
        fit
        border
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="名称" prop="module_name" width='130' show-overflow-tooltip></el-table-column>
        <el-table-column label="所属父板块" prop="father_module_name" width='130' show-overflow-tooltip></el-table-column>
        <el-table-column label="描述" prop="info" show-overflow-tooltip></el-table-column>
        <el-table-column label="版主" prop="username" width='130' show-overflow-tooltip></el-table-column>
        <el-table-column label="排序" prop="sort" width='80'></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width='150'></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope='scope'>
            <!-- 详情按钮 -->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <i class='el-icon-tickets icons' @click='showDialog(scope.row.id)'></i>
            </el-tooltip>
            <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <i class='el-icon-edit-outline icons' @click='showEditDialog(scope.row.id)'></i>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <i class='el-icon-delete icons' @click="deleteSonById(scope.row.id)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[7, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="allNum"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 新增子板块的对话框 -->
    <el-dialog title="新增子板块" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px">
        <el-form-item label="名称" prop="module_name">
          <el-input v-model="addForm.module_name"></el-input>
        </el-form-item>
        <el-form-item label="所属父板块" prop="father_module_id">
          <el-select v-model="addForm.father_module_id" placeholder="请选择所属父板块" clearable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.module_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版主" prop="user_id">
          <el-select v-model="addForm.user_id" placeholder="请选择一个版主" clearable>
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="info">
          <el-input type='textarea' rows='2' v-model="addForm.info"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="addForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSon">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑子板块的对话框 -->
    <el-dialog title="编辑子板块" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="名称" prop='module_name'>
          <el-input v-model="editForm.module_name"></el-input>
        </el-form-item>
        <el-form-item label="所属父板块" prop="father_module_id">
          <el-select v-model="editForm.father_module_id" placeholder="请选择所属父板块" clearable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.module_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版主" prop="user_id">
          <el-select v-model="editForm.user_id" placeholder="请选择版主" clearable>
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="info">
          <el-input type='textarea' rows='2' v-model="editForm.info"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="editForm.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
       <el-button @click="editDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="editSon">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看子板块详情的的对话框 -->
    <el-dialog title="子板块详情" :visible.sync="showDialogVisible" width="30%">
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>名称：</el-col>
        <el-col :span='14'>{{editForm.module_name}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>所属父板块：</el-col>
        <el-col :span='14'>{{editForm.father_module_name}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>版主：</el-col>
        <el-col :span='14'>{{editForm.name}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>描述：</el-col>
        <el-col :span='14'>{{editForm.info}}</el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='7' class='viewClass'>排序：</el-col>
        <el-col :span='14'>{{editForm.sort}}</el-col>
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
  name: 'SonList',
  components: { Bread },
  data() {
    return {
      // 获取帖子列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前的页数
        pagesize: 7 // 当前每页显示多少条数据
      },
      // 所有的帖子数
      allNum: 0,
      // 子板块列表数据
      sonList: [],
      // 控制新增弹框显示与隐藏
      addDialogVisible: false,
      // 控制编辑弹框显示与隐藏
      editDialogVisible: false,
      // 控制详情弹框的显示与隐藏
      showDialogVisible: false,
      // 父板块下拉框
      options: [],
      // 版主下拉框
      options1: [],
      // 新增子板块的表单数据
      addForm: {
        module_name: '',
        father_module_id: '',
        user_id: '',
        info: '',
        sort: 0
      },
      // 查询到的子板块信息对象
      editForm: {},
      // 新增表单的验证规则对象
      addFormrules: {
        module_name: [
          { required: true, message: '请输入子板块名称', trigger: 'blur' },
          { min: 1, max: 20, message: '名称的长度在 1-20 之间', trigger: 'blur' }
        ],
        father_module_id: [
          { required: true, message: '请选择一个父板块', trigger: 'blur' }
        ],
        user_id: [
          { required: true, message: '请选择版主', trigger: 'blur' }
        ],
        info: [
          { required: true, message: '请输入子板块描述', trigger: 'blur' },
          { min: 3, max: 30, message: '描述信息的长度在 3-30 之间', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入子板块排序', trigger: 'blur' },
          { type: 'number', message: '排序必须为数字' }
        ]
      },
      // 编辑验证规则对象
      editFormRules: {
        module_name: [
          { required: true, message: '请输入子板块名称', trigger: 'blur' },
          { min: 1, max: 20, message: '名称的长度在 1-20 之间', trigger: 'blur' }
        ],
        father_module_id: [
          { required: true, message: '请选择所属父板块', trigger: 'blur' }
        ],
        user_id: [
          { required: true, message: '请选择版主', trigger: 'blur' }
        ],
        info: [
          { required: true, message: '请输入子板块描述', trigger: 'blur' },
          { min: 3, max: 30, message: '描述信息的长度在 3-30 之间', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入子板块排序', trigger: 'blur' },
          { type: 'number', message: '排序必1须为数字' }
        ]
      },
      // 当前编辑的子板块id
      editSonId: ''
    }
  },
  created() {
    this.getSonList()
  },
  methods: {
    // 获取所有的父板块
    async getFatherList() {
      const { data: res } = await this.$http.get('/father.php')
      this.options = res
    },
    // 获取所有的用户
    async getUser() {
      const { data: res } = await this.$http.get('/user.php')
      this.options1 = res
    },
    // 获取子板块列表
    async getSonList() {
      const { data: res } = await this.$http.get('/son.php', { params: this.queryInfo })
      this.sonList = res
      const { data: res1 } = await this.$http.get('/num_content.php', { params: this.queryInfo })
      this.allNum = Number(res1.count)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getSonList()
    },
    // 监听 页码 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getSonList()
    },
    // 新增子板块弹窗
    addDialog() {
      this.getFatherList()
      this.getUser()
      this.addDialogVisible = true
    },
    // 监听新增子板块对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 新增子板块
    addSon() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加子板块的网络请求
        const { data: res } = await this.$http.post('/son_add.php', this.addForm)
        if (res.code !== 200) {
          this.$message.error('新增子板块失败!')
        }
        this.$message.success('新增子板块成功!')
        // 隐藏添加子板块的对话框
        this.addDialogVisible = false
        // 重新获取子板块列表数据
        this.getSonList()
      })
    },
    // 展示编辑子板块的对话框
    async showEditDialog (sonId) {
      this.getFatherList()
      this.getUser()
      const { data: res } = await this.$http.get('/son_query.php', { params: { id: sonId } })
      this.editForm = res
      this.editForm.sort = Number(this.editForm.sort)
      this.editDialogVisible = true
      this.editSonId = sonId
    },
    // 监听修改子板块对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑子板块
    editSon() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起编辑子板块的网络请求
        this.editForm.id = this.editSonId
        const { data: res } = await this.$http.post('/son_update.php', this.editForm)
        if (res.code !== 200) {
          this.$message.error('编辑子板块失败!')
        }
        this.$message.success('编辑子板块成功!')
        // 隐藏编辑子板块的对话框
        this.editDialogVisible = false
        // 重新获取子板块列表数据
        this.getSonList()
      })
    },
    // 展示子板块详情的对话框
    async showDialog (sonId) {
      const { data: res } = await this.$http.get('/son_query.php', { params: { id: sonId } })
      this.editForm = res
      this.showDialogVisible = true
    },
    // 根据id 删除对应的子板块信息
    async deleteSonById (sonId) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该子板块, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确认删除 则返回值为字符串 confirm
      // 如果取消删除 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消了删除！')
      }
      const { data: res } = await this.$http.get('/son_delete.php', { params: { id: sonId } })
      if (res.code !== 200) {
        return this.$message.error('删除子板块失败！')
      }
      this.$message.success('删除子板块成功！')
      this.getSonList()
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
::v-deep{
  .el-select{
    width: 270px;
  }
  .el-pagination__sizes{
    width: 110px;
  }
}
</style>
