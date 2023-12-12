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
      <el-table-column label="用户名" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效" width="auto" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.is_active">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登录" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.last_login }}</span>
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
            type="success"
            @click="handlePassword(row)"
          >
            修改密码
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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="temp.username"
            :disabled="dialogStatus === 'update'"
            class="filter-item"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="temp.name"
            class="filter-item"
            placeholder="姓名"
          />
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            v-model="temp.mobile"
            class="filter-item"
            placeholder="电话"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="temp.email"
            class="filter-item"
            placeholder="邮箱"
          />
        </el-form-item>
        <el-form-item label="有效" prop="is_active">
          <el-switch
            v-model="temp.is_active"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="超级用户" prop="is_superuser">
          <el-switch
            v-model="temp.is_superuser"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item v-if="!temp.is_superuser" label="关联角色" prop="roles">
          <el-select
            v-model="temp.roles"
            class="filter-item"
            placeholder="关联角色"
            size="medium"
          >
            <el-option
              v-for="item in roleSelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
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
    <el-dialog title="修改密码" :visible.sync="dialogPasswordFormVisible">
      <el-form
        ref="dataPassForm"
        :rules="passwordRules"
        :model="change"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="change.password"
            class="filter-item"
            placeholder="新密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPasswordFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="updatePassword()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  AdminPasswdUser
} from '@/api/user'
import { checkPassword, checkPhone, checkSpecialKey, checkEmail } from '@/utils/validate'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { enSecret } from '@/utils/secret'
import store from '@/store'
import { getRoleList } from '@/api/role'

export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  directives: { waves },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!checkSpecialKey(value)) {
        callback(new Error('请不要填入特殊字符'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!checkPhone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不够，需要超过8位'))
      } else if (!checkPassword(value)) {
        callback(new Error('密码填写错误，请填写6-20位，不包含中文至少包含一位数字字符和大小写字母'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!checkEmail(value)) {
        callback(new Error('请填写正确的邮箱地址'))
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
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      roleSelect: [],
      change: {
        password: ''
      },
      temp: {
        id: undefined,
        username: '',
        name: '',
        mobile: '',
        email: '',
        is_active: false,
        is_superuser: false,
        roles: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPasswordFormVisible: false,
      textMap: {
        update: '修改',
        create: '新增'
      },
      passwordRules: {
        password: [
          { required: true, message: '新密码必须填写', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '请填入用户名' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'blur' },
          { validator: validateUsername, message: '请不要填入特殊字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请填入姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '请填入正确的电话号码' },
          { validator: validatePhone, message: '请填入正确的电话号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址需要填写', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        is_active: [
          { required: true, message: '请填入是否有效', trigger: 'blur' }
        ],
        is_superuser: [
          { required: true, message: '需要选择超级用户？', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '需要关联关联角色', trigger: 'blur' }
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
    this.getRoles()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUsers(this.listQuery).then((response) => {
        this.list = response.data
        this.total = response.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getRoles() {
      getRoleList().then(response => {
        this.roleSelect = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handlePassword(row) {
      this.temp = Object.assign({}, row)
      this.dialogPasswordFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataPassForm'].clearValidate()
      })
    },
    updatePassword() {
      this.$refs['dataPassForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const tmp = this.change
          this.change.password = enSecret(this.change.password, store.getters.publickey)
          AdminPasswdUser(tempData.id, this.change).then(response => {
            this.dialogPasswordFormVisible = false
            const { message, code } = response
            this.$notify({
              title: '成功',
              message: `修改成功： ${message},代码：${code}`,
              type: 'success',
              duration: 2000
            })
            this.change.password = ''
          }).catch(() => {
            this.change = tmp
            this.loading = false
          })
        }
      })
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
        username: '',
        name: '',
        mobile: '',
        email: '',
        is_active: false,
        is_superuser: false
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
          createUser(this.temp).then(response => {
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
          updateUser(tempData.id, tempData).then(response => {
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
      deleteUser(row.id).then(response => {
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
