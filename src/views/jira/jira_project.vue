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
      <el-table-column label="项目id" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.project_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目关键字" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.project_key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.project_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.project_description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目负责人" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.project_leader }}</span>
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
  getJiraProjects
} from '@/api/jira'
import waves from '@/directive/waves' // waves directive
import {getEnvironmentList} from '@/api/environment'
import Pagination from '@/components/Pagination'
import {enSecret} from '@/utils/secret'
import store from "@/store";
import {mapGetters} from "vuex";

export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  directives: {waves},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      selectList: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      temp: {
        id: undefined,
        project_id: 'http',
        project_key: '',
        project_name: '',
        project_description: '',
        project_leader: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getJiraProjects(this.listQuery).then((response) => {
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
    getSortClass: function (key) {
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
