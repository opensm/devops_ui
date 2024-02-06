<template>
  <div class="app-container">
    <div class="filter-container">
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
      :border="true"
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
      <el-table-column label="helm模板" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.helm_repo_chart }}</span>
        </template>
      </el-table-column>
      <el-table-column label="helm仓库" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.rw_helm_repo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="helm版本" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.helm_repo_chart_version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="workload类型" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.workload_type }}</span>
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
        width="50%"
        label-position="center"
        label-width="120px"
        style="width: 800px; margin-left: 50px"
        center>
        <el-form-item label="helm模板" prop="helm_repo_chart">
          <el-input
            v-model="temp.helm_repo_chart"
            class="filter-item"
            placeholder="helm模板"
          />
        </el-form-item>
        <el-form-item label="helm仓库" prop="helm_repo">
          <el-select v-model="temp.helm_repo" placeholder="helm仓库">
            <el-option
              v-for="(repo, index) in repoList"
              :key="index"
              :value="repo.id"
              :label="repo.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="helm版本" prop="helm_repo_chart_version">
          <el-input
            v-model="temp.helm_repo_chart_version"
            class="filter-item"
            placeholder="helm版本"
          />
        </el-form-item>
        <el-form-item label="workload类型" prop="workload_type">
          <el-select v-model="temp.workload_type">
            <el-option value="deployment" label="无状态（deployment）" />
            <el-option value="statefulset" label="有状态（statefulset）" />
          </el-select>
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
  getKubernetesHelmChartList,
  createKubernetesHelmChart,
  updateKubernetesHelmChart,
  deleteKubernetesHelmChart,
  getKubernetesHelmRepoList
} from '@/api/config'
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
      repoList: [],
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      temp: {
        id: undefined,
        helm_repo: '',
        helm_repo_chart: '',
        helm_repo_chart_version: '',
        workload_type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        helm_repo: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        helm_repo_chart: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        helm_repo_chart_version: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        workload_type: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getHelmRepoList()
  },
  methods: {
    getHelmRepoList() {
      getKubernetesHelmRepoList().then(response => {
        this.repoList = response.data
      })
    },
    getList() {
      this.listLoading = true
      getKubernetesHelmChartList(this.listQuery).then(response => {
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
        helm_repo: '',
        helm_repo_chart: '',
        helm_repo_chart_version: '',
        workload_type: ''
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
          createKubernetesHelmChart(this.temp).then(response => {
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
          updateKubernetesHelmChart(tempData.id, tempData).then(response => {
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
      deleteKubernetesHelmChart(row.id).then(response => {
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
