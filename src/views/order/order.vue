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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      @close="closeDialog()"
      @open="openDialog()"
    >

      <el-steps :active="active" finish-status="success">
        <el-step title="关联项目环境"></el-step>
        <el-step title="操作列表"></el-step>
        <el-step title="确认信息"></el-step>
      </el-steps>
      <el-form v-show="active === 0"
        ref="dataForm"
        :rules="rules"
        :model="temp"
        width="50%"
        label-position="top"
        label-width="120px"
        style="width: 600px; margin-left: 100px;margin-bottom: 15%"
        center>
        <el-form-item label="所属项目" prop="project">
          <el-select v-model="temp.project" placeholder="环境">
            <el-option
              v-for="(pro, index) in projectList"
              :key="index"
              :value="pro.id"
              :label="pro.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="environment">
          <el-select v-model="temp.environment" placeholder="环境">
            <el-option
              v-for="(repo, index) in EnvironmentList"
              :key="index"
              :value="repo.id"
              :label="repo.environment"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="变更说明" prop="desc">
          <el-input
            v-model="temp.desc"
            type="textarea"
            class="filter-item"
            placeholder="变更说明"
          />
        </el-form-item>
      </el-form>
      <el-form
        v-show="active === 1"
        :model="temp"
        ref="dynamicValidateForm"
        label-width="100px"
        class="demo-dynamic"
        style="margin-bottom: 15%"
      >
        <el-form-item
          v-for="(suborder, index) in temp.suborders"
          :label="'子任务' + index"
          :key="suborder.index"
          :prop="'suborders.' + index + '.content_type'"
          :rules="{ required: true, message: '发布类型', trigger: 'blur'}"
        >
          <el-select
            v-model="suborder.content_type"
          >
            <el-option
              v-for="(data,index) in contentSelect"
              :key="index"
              :label="data.label"
              :value="data.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="addSubOrder">新增操作列表</el-button>
        </el-form-item>
      </el-form>
      <el-descriptions v-show="active === 2" title="任务信息">
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" style="margin-left: 10px;" @click="prev" v-show="active > 0">上一步</el-button>
        <el-button type="success" style="margin-left: 10px" @click="next" v-show="active < 2">下一步</el-button>
        <el-button
          v-show="active === 2"
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import {
  getOrderSubList,
  createOrderSub,
  updateOrderSub,
  deleteOrderSub
} from '@/api/order'
import { getProjectList } from '@/api/project'
import { getEnvironmentList } from '@/api/environment'
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
      active: 0,
      projectList: [],
      EnvironmentList: [],
      contentSelect: [],
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      temp: {
        id: undefined,
        project: '',
        environment: '',
        desc: '',
        suborders: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改操作',
        create: '新增操作'
      },
      rules: {
        project: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        environment: [
          { required: true, message: '字段必填', trigger: 'blur' }
        ],
        suborders: [
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
    addSubOrder(){
      this.temp.suborders.push({})
    },
    next() {
      if (this.active ++ > 3) this.active = 0;
      this.getContentData()
    },
    prev() {
      if (this.active -- < 0)  this.active = 0
    },
    async getProjects() {
      const res = await getProjectList()
      this.projectList = res.data
    },
    async getEnvironments() {
      const res = await getEnvironmentList()
      this.EnvironmentList = res.data
    },
    openDialog(){
      this.getProjects()
      this.getEnvironments()
    },
    closeDialog() {
      this.resetTemp()
      this.active = 0
    },
    getContentData(){
      let envData = []
      this.EnvironmentList.forEach(item =>{
        item.env_data.content.forEach(item2 =>{
          envData.push(item2)
        })
      })
      this.contentSelect = envData
      console.log(envData)
    },
    getList() {
      this.listLoading = true
      getOrderSubList(this.listQuery).then(response => {
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
        project: '',
        environment: '',
        status: '',
        desc: '',
        publish: '',
        suborders: []
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
          createOrderSub(this.temp).then(response => {
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
      this.getProjects()
      this.getEnvironments()
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
          updateOrderSub(tempData.id, tempData).then(response => {
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
      deleteOrderSub(row.id).then(response => {
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
