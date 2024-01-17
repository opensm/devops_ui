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
      <router-link to="/config/service_create">
        <el-button
          v-loading="listLoading"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-edit"
        >
          新增
        </el-button>
      </router-link>
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
        width="80%"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务名称" width="150%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.service_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代码仓库地址" width="300%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.service_git }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认编译命令" width="400%" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.service_type === 'single'">{{ row.service_build_bin }} {{ row.service_build_params }}</span>
          <span v-else>cd {{ row.service_build_path }} && {{ row.service_build_bin }} {{ row.service_build_params }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口启用" width="100px" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.service_ports_enable">有</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="环境变量" width="100px" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.service_environment_enable">有</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="健康检查" width="100px" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.service_healthy_enable">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="监控启用" width="100px" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.service_prometheus_enable">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="域名启用" width="100px" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.service_domain_enable">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="skywalking启用" width="100px" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.service_skywalking_enable">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <router-link :to="'service_edit/'+row.id">
            <el-button type="primary" size="medium" icon="el-icon-edit" style="margin-bottom: 10px;">
              详情
            </el-button>
          </router-link>
          <el-button
            size="medium"
            type="danger"
            icon="el-icon-delete"
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
  </div>
</template>
<script>
import {
  getServiceList,
  deleteService
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
        service_name: '',
        service_ports_enable: false,
        service_ports: {},
        service_config: [],
        service_git: '',
        service_compile: 'clean package -Dmaven.test.skip=true',
        service_environment_enable: false,
        service_environment: {},
        service_healthy_enable: false,
        service_readiness: {},
        service_liveness: {},
        service_prometheus_enable: false,
        service_prometheus: {},
        service_domain_enable: false,
        service_domain: {},
        service_skywalking_enable: false,
        service_skywalking: {}
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getServiceList(this.listQuery).then((response) => {
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
        service_name: '',
        service_ports_enable: false,
        service_ports: {},
        service_config: [],
        service_git: '',
        service_compile: 'clean package -Dmaven.test.skip=true',
        service_environment_enable: false,
        service_environment: {},
        service_healthy: false,
        service_readiness: {},
        service_liveness: {},
        service_prometheus_enable: false,
        service_prometheus: {},
        service_domain_enable: false,
        service_domain: {},
        service_skywalking_enable: false,
        service_skywalking: {}
      }
    },
    handleDelete(row) {
      deleteService(row.id).then(response => {
        const { message, code } = response
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
