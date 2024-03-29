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
      <el-table-column label="Harbor配置" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.kubernetes_pull_secret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联k8s认证信息" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.rw_kubernetes_auth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="k8s命名空间" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.kubernetes_namespace }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
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
        label-position="left"
        label-width="180px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="Harbor配置" prop="kubernetes_pull_secret">
          <el-input
            v-model="temp.kubernetes_pull_secret"
            class="filter-item"
            placeholder="Harbor配置"
          />
        </el-form-item>
        <el-form-item label="认证信息" prop="kubernetes_auth">
          <el-select v-model="temp.kubernetes_auth">
            <el-option
              v-for="(k8s) in selectList"
              :key="k8s.id"
              :value="k8s.id"
              :label="k8s.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="命名空间" prop="kubernetes_namespace">
          <el-input
            v-model="temp.kubernetes_namespace"
            class="filter-item"
            placeholder="Kubernetes命名空间"
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
  getKubernetesEnvironmentConfigurationList,
  createKubernetesEnvironmentConfiguration,
  updateKubernetesEnvironmentConfiguration,
  deleteKubernetesEnvironmentConfiguration
} from '@/api/config'
import { getKubernetesList } from '@/api/kubernetes'
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
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      temp: {
        id: undefined,
        kubernetes_pull_secret: '',
        kubernetes_environment_from_Sec: '',
        kubernetes_replica_count: 0,
        kubernetes_auth: '',
        kubernetes_namespace: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'kubernetes环境部署修改',
        create: 'kubernetes环境部署新增'
      },
      rules: {
        kubernetes_pull_secret: [
          { required: true, message: 'harbor关联secret必须填写', trigger: 'blur' }
        ],
        kubernetes_auth: [
          { required: true, message: 'Kubernetes关联集群必须填写', trigger: 'blur' }
        ],
        kubernetes_namespace: [
          { required: true, message: '命名空间 必须填写', trigger: 'blur' }
        ],
        kubernetes_replica_count: [
          { required: true, message: '副本个数 必须填写', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getKubernetes()
  },
  methods: {
    getKubernetes() {
      getKubernetesList().then(response => {
        this.selectList = response.data
      })
    },
    getList() {
      this.listLoading = true
      getKubernetesEnvironmentConfigurationList(this.listQuery).then((response) => {
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
        kubernetes_pull_secret: '',
        kubernetes_environment_from_Sec: '',
        kubernetes_replica_count: 0,
        kubernetes_auth: '',
        kubernetes_namespace: ''
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
          createKubernetesEnvironmentConfiguration(this.temp).then(response => {
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
          updateKubernetesEnvironmentConfiguration(tempData.id, tempData).then(response => {
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
    handleDelete(row) {
      deleteKubernetesEnvironmentConfiguration(row.id).then(response => {
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
.el-input-number {
  width: 100%;
}
</style>
