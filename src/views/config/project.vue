<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="Title"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        style="margin-left: 10px"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="git仓库地址" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.git_server }}</span>
        </template>
      </el-table-column>
      <el-table-column label="git当前CommitId" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.git_current_commit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Git推送时间" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.git_commit_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="400px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleModifyStatus(row, 'published')"
          >
            同步备份
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="center"
        label-width="200px"
        style="width: 600px; margin-left: 50px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="temp.name"
            class="filter-item"
            placeholder="名称"
          />
        </el-form-item>
        <el-form-item label="配置保存地址(GitLab)" prop="git_server">
          <el-input
            v-model="temp.git_server"
            class="filter-item"
            placeholder="仓库地址"
          />
        </el-form-item>
        <el-form-item label="配置保存地址Token" prop="git_token">
          <el-input
            v-model="temp.git_token"
            type="password"
            class="filter-item"
            placeholder="配置保存地址Token"
          />
        </el-form-item>
        <el-form-item label="harbor域名" prop="harbor_domain">
          <el-input
            v-model="temp.harbor_domain"
            class="filter-item"
            placeholder="harbor域名"
          />
        </el-form-item>
        <el-form-item label="harbor用户名" prop="harbor_username">
          <el-input
            v-model="temp.harbor_username"
            class="filter-item"
            placeholder="harbor用户名"
          />
        </el-form-item>
        <el-form-item label="harbor密码" prop="harbor_password">
          <el-input
            v-model="temp.harbor_password"
            class="filter-item"
            placeholder="harbor密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProjectList,
  createProject,
  updateProject,
  deleteProject
} from '@/api/project'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { enSecret } from '@/utils/secret'
import store from '@/store'
export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        git_server: '',
        git_token: '',
        harbor_domain: '',
        harbor_username: '',
        harbor_password: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        name: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        git_server: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        git_token: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        harbor_domain: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        harbor_username: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        harbor_password: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'publickey'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProjectList(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        git_server: '',
        git_token: '',
        harbor_domain: '',
        harbor_username: '',
        harbor_password: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.git_token = enSecret(this.temp.git_token, store.getters.publickey)
          this.temp.harbor_password = enSecret(this.temp.harbor_password, store.getters.publickey)
          createProject(this.temp).then(response => {
            this.dialogFormVisible = false
            const { message, code } = response
            this.$notify({
              title: '成功',
              message: `创建成功: ${message},代码：${code}`,
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.git_token = enSecret(tempData.git_token, store.getters.publickey)
          tempData.harbor_password = enSecret(tempData.harbor_password, store.getters.publickey)
          updateProject(tempData.id, tempData).then(response => {
            this.dialogFormVisible = false
            const { message, code } = response
            this.$notify({
              title: '成功',
              message: `修改成功： ${message},代码：${code}`,
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteProject(row.id).then(response => {
        const { message, code } = response
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: `删除成功:${message},代码：${code}`,
          type: 'success',
          duration: 2000
        })
        this.handleFilter()
      })
      this.list.splice(index, 1)
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
