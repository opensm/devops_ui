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
        Search
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
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
      <el-table-column label="名称" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
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

    <pagination
      v-show="total > 0"
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
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="temp.name"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="temp.address"
            class="filter-item"
            placeholder="地址信息"
          />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="temp.username"
            class="filter-item"
            placeholder="Please put the token"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="temp.password"
            type="password"
            class="filter-item"
            placeholder="Please put the password"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getJiras,
  createJira,
  updateJira,
  deleteJira
} from '@/api/jira'
import { enSecret } from '@/utils/secret'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import store from "@/store"; // secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: { Pagination },
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
        name: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        address: '',
        username: '',
        password: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        name: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'publickey'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      getJiras(this.listQuery).then((response) => {
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
        name: '',
        address: '',
        username: '',
        password: ''
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
          try {
            this.temp.password = enSecret(this.temp.password, store.getters.publickey)
            createJira(this.temp).then(response => {
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
          } catch (error) {
            console.log(error)
            this.temp.password = ''
            this.$notify({
              title: 'Warning',
              message: 'Current ca is not currently valid',
              type: 'warning',
              duration: 2000
            })
          }
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
          try {
            this.temp.password = enSecret(this.temp.password, store.getters.publickey)
            updateJira(this.temp.id,this.temp).then(() => {
              const index = this.list.findIndex((v) => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          } catch (error) {
            console.log(error)
            this.temp.password = ''
            this.$notify({
              title: 'Warning',
              message: 'Current token is not currently valid',
              type: 'warning',
              duration: 2000
            })
          }
          this.handleFilter()
        }
      })
    },
    handleDelete(row, index) {
      deleteJira(row.id).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
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
