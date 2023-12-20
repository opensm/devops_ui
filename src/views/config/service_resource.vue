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
      <el-table-column label="需要CPU(m)" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.request_cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需要Memory(MB)" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.request_memory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="限制CPU(m)" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.limit_cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="限制Memory(GB)" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.limit_memory }}</span>
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
        label-width="140px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="需要CPU(m)" prop="request_cpu">
          <el-input-number
            v-model="temp.request_cpu"
            class="filter-item"
            placeholder="需要CPU"
            :min="50"
          />
        </el-form-item>
        <el-form-item label="需要Memory(MB)" prop="request_memory">
          <el-input-number
            v-model="temp.request_memory"
            class="filter-item"
            placeholder="需要Memory"
            :min="50"
          />
        </el-form-item>
        <el-form-item label="限制CPU(m)" prop="limit_cpu">
          <el-input-number
            v-model="temp.limit_cpu"
            class="filter-item"
            placeholder="限制CPU"
            :min="50"
          />
        </el-form-item>
        <el-form-item label="限制Memory(MB)" prop="limit_memory">
          <el-input-number
            v-model="temp.limit_memory"
            class="filter-item"
            placeholder="限制Memory"
            :min="50"
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
  getServiceResourceList,
  createServiceResource,
  updateServiceResource,
  deleteServiceResource
} from '@/api/service'
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
      showReviewer: false,
      temp: {
        id: undefined,
        request_cpu: 0,
        request_memory: 0,
        limit_cpu: 0,
        limit_memory: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '服务资源依赖修改',
        create: '服务资源依赖新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        request_cpu: [
          { required: true, message: '字段必须填写', trigger: 'blur' }
        ],
        request_memory: [
          { required: true, message: '字段必须填写', trigger: 'blur' }
        ],
        limit_memory: [
          { required: true, message: '字段必须填写', trigger: 'blur' }
        ],
        limit_cpu: [
          { required: true, message: '字段必须填写', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getServiceResourceList(this.listQuery).then((response) => {
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
        request_cpu: 0,
        request_memory: 0,
        limit_cpu: 0,
        limit_memory: 0
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
          createServiceResource(this.temp).then(response => {
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
          updateServiceResource(tempData.id, tempData).then(response => {
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
      deleteServiceResource(row.id).then(response => {
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
</style>
