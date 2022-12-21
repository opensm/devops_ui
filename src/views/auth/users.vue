<template>
  <div class="app-container">
    <el-container style="border: 1px solid #eee;height: auto;">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message" />角色
            </template>
            <el-menu-item-group>
              <template slot="title">系统管理</template>
              <el-menu-item index="1-1">admin</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="管理">
              <el-menu-item index="1-3">manager</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="管理">
              <el-menu-item index="1-4">user</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>

        <el-main>
          <el-table :data="list">
            <el-table-column prop="username" label="用户" width="140" />
            // eslint-disable-next-line vue/html-self-closing
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="address" label="地址" />
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getInfo } from '@/api/user'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getInfo().then((response) => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
