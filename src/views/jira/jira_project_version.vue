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
      <el-table-column label="项目" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.raw_jira_project }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本id" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.project_version_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否归档" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.archived }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否发版" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.released }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始日期" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.start_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发版日期" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.release_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际开始日期" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.user_start_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际发版日期" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.users_release_date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="400px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <router-link :to="'issue/'+row.id">
            <el-button type="primary" size="mini" style="margin-right: 10px">
              问题清单
            </el-button>
          </router-link>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="Jira项目" prop="jira_project">
          <el-select v-model="temp.jira_project">
            <el-option
              v-for="(project, index) in selectList"
              :key="index"
              :value="project.id"
              :label="project.project_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="name">
          <el-input
            v-model="temp.name"
            placeholder="版本号"
          />
        </el-form-item>
        <el-form-item label="是否归档" prop="archived">
          <el-switch
            v-model="temp.archived"
            placeholder="通知参数"
          />
        </el-form-item>
        <el-form-item label="是否发布" prop="released">
          <el-switch
            v-model="temp.released"
            class="filter-item"
            placeholder="通知参数"
          />
        </el-form-item>
        <el-form-item label="开始日期" prop="start_date">
          <el-date-picker
            type="datetime"
            value-format="yyyy-MM-DDTHH:mm:ssZ"
            v-model="temp.start_date"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item label="发布日期" prop="release_date">
          <el-date-picker
            type="datetime"
            value-format="yyyy-MM-DDTHH:mm:ssZ"
            v-model="temp.release_date"
            class="filter-item"
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
  getJiraProjectVersions,
  createJiraProjectVersion,
  updateJiraProjectVersion,
  deleteJiraProjectVersion,
  getJiraProjects
} from '@/api/jira'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
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
      selectList: [],
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      temp: {
        id: undefined,
        jira_project: '',
        archived: false,
        released: false,
        start_date: '',
        release_date: '',
        user_start_date: '',
        users_release_date: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        jira_project: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        archived: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        released: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        start_date: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        release_date: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getJiraProjectsList()
  },
  methods: {
    getJiraProjectsList() {
      getJiraProjects().then(response => {
        this.selectList = response.data
      })
    },
    getList() {
      this.listLoading = true
      getJiraProjectVersions(this.listQuery).then((response) => {
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
        jira_project: '',
        project_version_id: '',
        archived: false,
        released: false,
        start_date: '',
        release_date: ''
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
          createJiraProjectVersion(this.temp).then(response => {
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
          updateJiraProjectVersion(tempData.id, tempData).then(response => {
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
      deleteJiraProjectVersion(row.id).then(response => {
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
<style>
.el-select {
  width: 100%;
}
</style>
