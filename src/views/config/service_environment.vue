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
        width="120"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属环境" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.environment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联服务" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.service }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.resource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置文件" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.service_config }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否部署在k8s" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.kubernetes_enable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联k8s配置" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.kubernetes_environment_config }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否部署在docker" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.docker_enable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联docker配置" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.docker_environment_config }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所用分支" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.git_branch_or_tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联项目" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.project }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150px"
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
        label-width="140px"
        style="width: 400px; margin-left: 50px"
      >

        <el-form-item label="关联服务" prop="service">
          <el-select v-model="temp.service" >
            <el-option :value="svc.id" :label="svc.service_name" v-for="(svc,index) in selectList7" :key="svc.id"> {{ svc.service_name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属环境" prop="environment">
          <el-select v-model="temp.environment" >
            <el-option :value="env.id" v-for="(env,index) in selectList4" :key="env.id" :label="env.environment"> {{ env.environment }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源" prop="resource">
          <el-select v-model="temp.resource">
            <el-option :value="resource.id"  v-for="(resource,index) in selectList5" :key="resource.id" :label="'Request CPU:' + resource.request_cpu + 'm, Request Memory:' + resource.request_memory + 'GB, Limit CPU:' + resource.limit_cpu + 'm, Limit Memory:' + resource.limit_memory + 'GB'">
              Request CPU:{{ resource.request_cpu }}m, Request Memory:{{ resource.request_memory }}GB, Limit CPU:{{ resource.limit_cpu }}m, Limit Memory:{{ resource.limit_memory }}GB
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置文件" prop="service_config">
          <el-select v-model="temp.service_config" v-for="(config,index) in selectList6" :key="config.id">
            <el-option :value="config.id" :label="config.service_name"> {{ config.service_name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否部署在k8s" prop="kubernetes_enable">
          <el-switch
            v-model="temp.kubernetes_enable"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="关联k8s配置" prop="kubernetes_environment_config" v-if="temp.kubernetes_enable">
          <el-select v-model="temp.kubernetes_environment_config" >
            <el-option :value="config.id"
                       :label="config.kubernetes_namespace"
                       v-for="(config,index) in selectList2"
                       :key="config.id">
              {{ config.kubernetes_namespace }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否部署在docker" prop="docker_enable">
          <el-switch
            v-model="temp.docker_enable"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
        <el-form-item label="关联docker配置" prop="docker_environment_config" v-if="temp.docker_enable">
          <el-select v-model="temp.docker_environment_config" v-for="(config,index) in selectList3" :key="config.id">
            <el-option :value="config.id" :label="config.docker_instances"> {{ config.docker_instances }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所用分支" prop="git_branch_or_tag">
          <el-input
            v-model="temp.git_branch_or_tag"
            class="filter-item"
            placeholder="所用分支"
          />
        </el-form-item>
        <el-form-item label="关联项目" prop="project">
          <el-select v-model="temp.project" >
            <el-option :value="config.id" :label="config.name" v-for="(config,index) in selectList1" :key="config.id"> {{ config.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=自动部署？ prop="auto_deploy">
          <el-switch
            v-model="temp.auto_deploy"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
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
  getServiceEnvironmentList,
  createServiceEnvironment,
  updateServiceEnvironment,
  deleteServiceEnvironment,
  getKubernetesEnvironmentConfigurationList,
  getDockerEnvironmentConfigurationList
} from '@/api/config'
import waves from '@/directive/waves' // waves directive
import { getEnvironmentList } from "@/api/environment";
import {getServiceResourceList, getServiceConfigList, getServiceList} from "@/api/service";
import { getProjectList } from "@/api/project";
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
      selectList1: [],
      selectList2: [],
      selectList3: [],
      selectList4: [],
      selectList5: [],
      selectList6: [],
      selectList7: [],
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
        environment: '',
        service: '',
        resource: '',
        service_config: '',
        kubernetes_enable: false,
        kubernetes_environment_config: '',
        docker_enable: false,
        docker_environment_config: '',
        git_branch_or_tag: '',
        service_prometheus: '',
        project: '',
        auto_deploy: false
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
        environment: [
          { required: true, message: '环境必须填写', trigger: 'blur' }
        ],
        service: [
          { required: true, message: '关联服务必须填写', trigger: 'blur' }
        ],
        resource: [
          { required: true, message: '所需资源必须填写', trigger: 'blur' }
        ],
        service_config: [
          { required: true, message: '服务关联配置必须填写', trigger: 'blur' }
        ],
        kubernetes_enable: [
          { required: true, message: '是否是Kubernetes部署必须填写', trigger: 'blur' }
        ],
        kubernetes_environment_config: [
          { required: true, message: '服务的kubernetes配置必须填写', trigger: 'blur' }
        ],
        docker_enable: [
          { required: true, message: '是否是docker部署必须填写', trigger: 'blur' }
        ],
        docker_environment_config: [
          { required: true, message: '服务的Docker配置必须填写', trigger: 'blur' }
        ],
        git_branch_or_tag: [
          { required: true, message: '分支必须填写', trigger: 'blur' }
        ],
        project: [
          { required: true, message: '所属项目必须填写', trigger: 'blur' }
        ],
        auto_deploy: [
          { required: true, message: '是否自动部署必须填写', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getProject()
    this.getKubernetesEnvironmentConfiguration()
    this.getDockerEnvironmentConfiguration()
    this.getEnvironmentList()
    this.getServiceResource()
    this.getServiceConfig()
    this.getService()
  },
  methods: {
    getProject(){
      getProjectList().then(( response =>{
        this.selectList1 = response.data
      }))
    },
    getKubernetesEnvironmentConfiguration(){
      getKubernetesEnvironmentConfigurationList().then(( response =>{
        this.selectList2 = response.data
      }))
    },
    getDockerEnvironmentConfiguration(){
      getDockerEnvironmentConfigurationList().then(( response =>{
        this.selectList3 = response.data
      }))
    },
    getEnvironmentList(){
      getEnvironmentList().then(( response =>{
        this.selectList4 = response.data
      }))
    },
    getServiceResource(){
      getServiceResourceList().then(( response =>{
        this.selectList5 = response.data
      }))
    },
    getServiceConfig(){
      getServiceConfigList().then(( response =>{
        this.selectList6 = response.data
      }))
    },
    getService(){
      getServiceList().then(( response =>{
        this.selectList7 = response.data
      }))
    },
    getList() {
      this.listLoading = true
      getServiceEnvironmentList(this.listQuery).then((response) => {
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
        environment: '',
        service: '',
        resource: '',
        service_config: '',
        kubernetes_enable: false,
        kubernetes_environment_config: '',
        docker_enable: false,
        docker_environment_config: '',
        git_branch_or_tag: '',
        service_prometheus: '',
        project: '',
        auto_deploy:false
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
          createServiceEnvironment(this.temp).then(response => {
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
          updateServiceEnvironment(tempData.id, tempData).then(response => {
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
      deleteServiceEnvironment(row.id).then(response => {
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
