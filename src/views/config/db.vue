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
      <el-table-column label="数据库类型" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.db_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.rw_project }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属环境" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.rw_environment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="  备注" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.desc }}</span>
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
        <el-form-item label="项目" prop="project">
          <el-select v-model="temp.project">
            <el-option
              v-for="(item,index) in projectSelectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属环境" prop="environment">
          <el-select v-model="temp.environment">
            <el-option
              v-for="(item,index) in envSelectList"
              :key="index"
              :label="item.environment"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库类型" prop="db_type">
          <el-select v-model="temp.db_type">
            <el-option value="mysql" label="MySQL" />
            <el-option value="mongodb" label="MongoDB" />
            <el-option value="clickhouse" label="ClickHouse" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="temp.address"
            class="filter-item"
            placeholder="连接地址IP:Port"
          />
        </el-form-item>
        <el-form-item label="用户" prop="username">
          <el-input
            v-model="temp.username"
            class="filter-item"
            placeholder="用户"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="temp.password"
            class="filter-item"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input
            v-model="temp.desc"
            type="textarea"
            class="filter-item"
            placeholder="备注"
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
  getDBList,
  createDB,
  updateDB,
  deleteDB
} from '@/api/config'
import { getProjectList } from '@/api/project'
import { getEnvironmentList } from '@/api/environment'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { enSecret } from '@/utils/secret'
import store from '@/store'
import { mapGetters } from 'vuex'
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
      projectSelectList: [],
      envSelectList: [],
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      temp: {
        id: undefined,
        project: '',
        db_type: '',
        environment: '',
        address: '',
        password: '',
        username: '',
        desc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        project: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        environment: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        db_type: [
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
    this.getEnvironmentList()
    this.getProject()
  },
  methods: {
    getEnvironmentList() {
      getEnvironmentList().then(response => {
        this.envSelectList = response.data
      })
    },
    getProject() {
      getProjectList().then((response) => {
        this.projectSelectList = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      getDBList(this.listQuery).then((response) => {
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
        db_type: '',
        project: '',
        environment: '',
        address: '',
        password: '',
        username: '',
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
          this.temp.password = enSecret(this.temp.password, store.getters.publickey)
          createDB(this.temp).then(response => {
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
          tempData.password = enSecret(tempData.password, store.getters.publickey)
          updateDB(tempData.id, tempData).then(response => {
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
      deleteDB(row.id).then(response => {
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
