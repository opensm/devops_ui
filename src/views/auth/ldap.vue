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
      <el-table-column label="服务器" width="200%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ldap_server }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理账号" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ldap_binddn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号字段" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ldap_login_attribute }}</span>
        </template>
      </el-table-column>
      <el-table-column label="域信息" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ldap_base_dn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="地址" prop="ldap_server">
          <el-input
            v-model="temp.ldap_server"
            class="filter-item"
            placeholder="请填写服务端地址"
          />
        </el-form-item>
        <el-form-item label="管理账号" prop="ldap_binddn">
          <el-input
            v-model="temp.ldap_binddn"
            class="filter-item"
            placeholder="填入管理账号"
          />
        </el-form-item>
        <el-form-item label="管理密码" prop="ldap_bindpass">
          <el-input
            v-model="temp.ldap_bindpass"
            class="filter-item"
            placeholder="填入管理密码"
          />
        </el-form-item>
        <el-form-item label="账号字段" prop="ldap_login_attribute">
          <el-input
            v-model="temp.ldap_login_attribute"
            class="filter-item"
            placeholder="登录匹配的账号字段"
          />
        </el-form-item>
        <el-form-item label="域信息" prop="ldap_base_dn">
          <el-input
            v-model="temp.ldap_base_dn"
            class="filter-item"
            placeholder="域信息,例如：aaa.com或者ou=aaa,cn=com"
          />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input
            v-model="temp.desc"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消</el-button>
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
  getldapList,
  createldap,
  updateldap,
  deleteldap
} from '@/api/ldap'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'ComplexTable',
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
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      showReviewer: false,
      temp: {
        id: undefined,
        ldap_server: '',
        ldap_binddn: '',
        ldap_bindpass: '',
        ldap_login_attribute: '',
        ldap_base_dn: '',
        desc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        ldap_server: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        ldap_binddn: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        ldap_bindpass: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        ldap_login_attribute: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        ldap_base_dn: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getldapList(this.listQuery).then((response) => {
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
      const {prop, order} = data
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
        ldap_server: '',
        ldap_binddn: '',
        ldap_bindpass: '',
        ldap_login_attribute: '',
        ldap_base_dn: '',
        desc: ''
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
          createldap(this.temp).then(response => {
            this.dialogFormVisible = false
            const {message, code} = response
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
          updateldap(tempData.id, tempData).then(response => {
            this.dialogFormVisible = false
            const {message, code} = response
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
      deleteldap(row.id).then(response => {
        const {message, code} = response
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
