<template>
  <div class="app-container">
    <sticky :z-index="10" class="btn-box" class-name=" draft">
      <router-link to="/config/kubernets_create">
        <el-button v-loading="listLoading" style="margin-left: 10px;" type="success">
          创建配置
        </el-button>
      </router-link>
    </sticky>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
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
      <el-table-column label="名称" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="正则信息" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.regular }}</span>
        </template>
      </el-table-column>
      <el-table-column label="debug" width="auto" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.debug">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="删除"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <router-link :to="'kubernets_edit/'+row.id" style="margin-right: 10px;">
            <el-button type="primary" size="medium" icon="el-icon-edit" style="margin-right: 10px;">
              编辑
            </el-button>
          </router-link>
          <el-button
            icon="el-icon-delete"
            size="medium"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import {
  getKubernetesList,
  deleteKubernetes
} from '@/api/kubernetes'
import Sticky from '@/components/Sticky'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination, Sticky },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getKubernetesList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleDelete(row) {
      deleteKubernetes(row.id).then(response => {
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
    }
  }
}
</script>

<style scoped>
.btn-box{
  text-align:left;
  /*padding-left:5%;*/
  margin-bottom: 1%;
}
</style>
