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
      <el-table-column label="Jira任务单" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.jira_order }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.order_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="auto" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.status === 0">还未审批</el-tag>
          <el-tag v-if="row.status === 1" type="warning">审批中</el-tag>
          <el-tag v-if="row.status === 2" type="success">审批通过</el-tag>
          <el-tag v-if="row.status === 3" type="danger">审批拒绝</el-tag>
          <el-tag v-if="row.status === 4" type="info">审批未执行</el-tag>
          <el-tag v-if="row.status === 5" type="warning">执行中</el-tag>
          <el-tag v-if="row.status === 6" type="success">执行完成</el-tag>
          <el-tag v-if="row.status === 7" type="danger">执行失败</el-tag>
          <el-tag v-if="row.status === 8" type="warning">任务回退中</el-tag>
          <el-tag v-if="row.status === 9" type="danger">任务回退失败</el-tag>
          <el-tag v-if="row.status === 10" type="warning">任务取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" width="auto" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.finish_time">有</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.order_user }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <router-link :to="'detail/'+row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" style="margin-bottom: 10px;">
            </el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            :disabled="row.status > 0 "
            @click="handleDelete(row, $index)"
          >
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
  getOrderList,
  deleteOrder
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
        sort: '+id'
      },
      temp: {
        id: undefined,
        jira_order: '',
        notice: [],
        re_orders: false,
        desc: false,
        status: false,
        order_time: {},
        create_time: [],
        finish_time: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then((response) => {
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
        jira_order: '',
        notice: [],
        re_orders: false,
        desc: false,
        status: false,
        order_time: {},
        create_time: [],
        finish_time: ''
      }
    },
    handleDelete(row) {
      deleteOrder(row.id).then(response => {
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
