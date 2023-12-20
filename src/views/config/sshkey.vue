<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.ssh_name"
        placeholder="名称"
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
      <el-table-column label="ssh名称" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ssh_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认证方式" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ssh_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ssh_username }}</span>
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
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="ssh名称" prop="ssh_name">
          <el-input
            v-model="temp.ssh_name"
            class="filter-item"
            placeholder="ssh名称"
          />
        </el-form-item>
        <el-form-item label="认证方式" prop="ssh_type">
          <el-radio-group v-model="temp.ssh_type">
            <el-radio-button label="password" />
            <el-radio-button label="publickey" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户" prop="ssh_username">
          <el-input
            v-model="temp.ssh_username"
            class="filter-item"
            placeholder="用户"
          />
        </el-form-item>
        <el-form-item v-if="temp.ssh_type === 'password'" label="密码" prop="ssh_password">
          <el-input
            v-model="temp.ssh_password"
            class="filter-item"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item v-if="temp.ssh_type === 'publickey'" prop="ssh_public_key" label="SSH公钥">
          <el-input
            v-model="temp.ssh_public_key"
            class="filter-item"
            placeholder="SSH公钥"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 100}"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()"> 取消 </el-button>
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
  getSshKeyList,
  createSshKey,
  updateSshKey,
  deleteSshKey
} from '@/api/sshkey'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { checkSpecialKey } from '@/utils/validate'
export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  directives: { waves },
  data() {
    const validateSpecialKey = (rule, value, callback) => {
      if (!checkSpecialKey(value)) {
        callback(new Error('请不要填入特殊字符'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        ssh_name: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        ssh_name: '',
        ssh_type: 'password',
        ssh_username: '',
        ssh_password: '',
        ssh_public_key: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        ssh_name: [
          { required: true, message: '请填写配置名称', trigger: 'blur' },
          { validator: validateSpecialKey, message: '请不要填写特殊字符', trigger: 'blur' }
        ],
        ssh_type: [
          { required: true, message: '请填写配置类型', trigger: 'blur' }
        ],
        ssh_username: [
          { required: true, message: 'SSH用户名必须填写 is required', trigger: 'blur' },
          { validator: validateSpecialKey, message: '请不要填写特殊字符', trigger: 'blur' }
        ],
        ssh_password: [
          { required: true, message: 'SSH密码必须填写', trigger: 'blur' }
        ],
        ssh_public_key: [
          { required: true, message: 'SSH公钥必须填写', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    closeDialog() {
      this.dialogFormVisible = false
      this.resetTemp()
    },
    getList() {
      this.listLoading = true
      getSshKeyList(this.listQuery).then((response) => {
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
        ssh_name: '',
        ssh_type: 'password',
        ssh_username: '',
        ssh_password: '',
        ssh_public_key: ''
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSshKey(this.temp).then(response => {
            this.dialogFormVisible = false
            const { message, code } = response
            this.$notify({
              title: '成功',
              message: `创建成功: ${message},代码：${code}`,
              type: 'success',
              duration: 2000
            })
            this.resetTemp()
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
          updateSshKey(tempData.id, tempData).then(response => {
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
      deleteSshKey(row.id).then(response => {
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
.el-radio-group {
  width: 100%;
}
</style>
