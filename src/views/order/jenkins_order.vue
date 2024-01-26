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
      <el-table-column label="Jenkins地址" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.jenkins_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="auto" align="center">
        <template slot-scope="{ row }">
          <el-tag :type=" row.status | filter_jenkins_status_tag ">{{ row.status | filter_jenkins_status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务id" width="auto" align="center">
        <template slot-scope="{ row }">
          <el-tag >{{ row.jenkins_order_id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <router-link :to="'jenkins_order_detail/'+row.id">
            <el-button type="primary" size="medium" icon="el-icon-view" style="margin-bottom: 10px;" />
          </router-link>
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
  getJenkinsOrders
} from '@/api/order'
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
      listQuery: {
        page: 1,
        limit: 20,
        desc: undefined,
        sort: '-id'
      },
      temp: {
        id: undefined,
        jenkins: '',
        service_env: ''
      }
    }
  },
filters: {
  filter_jenkins_status(value) {
    if (value === 0 ) {
      return '未执行'
    } else if (value === 1 ) {
      return '执行中'
    } else if (value === 2 ) {
      return '执行完成'
    } else if (value === 3 ) {
      return '执行失败'
    } else if (value === 4 ) {
      return '取消'
    } else if (value === 5 ) {
      return '未知'
    }
  },
  filter_jenkins_status_tag(value) {
    if (value === 0 ) {
      return ''
    } else if (value === 1 ) {
      return 'warning'
    } else if (value === 2 ) {
      return 'success'
    } else if (value === 3 ) {
      return 'danger'
    } else if (value === 4 ) {
      return 'info'
    } else if (value === 5 ) {
      return 'info'
    }
  }
},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getJenkinsOrders(this.listQuery).then((response) => {
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
        jenkins: '',
        service_env: ''
      }
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
