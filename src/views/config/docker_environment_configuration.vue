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
      <el-table-column label="docker部署所在主机" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.docker_instances }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ssh所属的KEY" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.rw_docker_ssh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="docker副本数" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.docker_replica_count }}</span>
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
            v-if="row.status != 'deleted'"
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
        <el-form-item label="宿主机" prop="docker_instances">
          <el-input
            v-model="temp.docker_instances"
            class="filter-item"
            placeholder="docker部署所在主机"
          />
        </el-form-item>
        <el-form-item label="ssh所属的KEY" prop="docker_ssh">
          <el-select v-for="ssh in selectList" :key="ssh.id" v-model="temp.docker_ssh">
            <el-option :value="ssh.id" :label="ssh.ssh_name"> {{ ssh.ssh_name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="docker副本数" prop="docker_replica_count">
          <el-input-number
            v-model="temp.docker_replica_count"
            class="filter-item"
            placeholder="docker副本数"
            :min="1"
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
  getDockerEnvironmentConfigurationList,
  createDockerEnvironmentConfiguration,
  updateDockerEnvironmentConfiguration,
  deleteDockerEnvironmentConfiguration
} from '@/api/config'
import waves from '@/directive/waves' // waves directive
import { getSshKeyList } from '@/api/sshkey'
import Pagination from '@/components/Pagination'
import { validateIP } from '@/utils/validate'
export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  directives: { waves },
  data() {
    const validateIPAddress = (rule, value, callback) => {
      const iplist = value.split(',')
      iplist.forEach((item, index) => {
        console.log(item)
        if (!validateIP(item)) {
          callback(new Error('请输入正确的IP地址：' + item))
        }
      })
      callback()
    }
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
      showReviewer: false,
      temp: {
        id: undefined,
        docker_instances: '',
        docker_ssh: '',
        docker_replica_count: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        docker_instances: [
          { required: true, message: '字段必填', trigger: 'blur' },
          { validator: validateIPAddress, trigger: 'blur' }
        ],
        docker_ssh: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        docker_replica_count: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getSSHKey()
  },
  methods: {
    getSSHKey() {
      getSshKeyList().then(response => {
        this.selectList = response.data
      })
    },
    getList() {
      this.listLoading = true
      getDockerEnvironmentConfigurationList(this.listQuery).then((response) => {
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
        docker_instances: '',
        docker_ssh: '',
        docker_replica_count: 0
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
          createDockerEnvironmentConfiguration(this.temp).then(response => {
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
          updateDockerEnvironmentConfiguration(tempData.id, tempData).then(response => {
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
      deleteDockerEnvironmentConfiguration(row.id).then(response => {
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
