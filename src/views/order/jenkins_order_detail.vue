<template>
  <div class="app-container background-order">
    <el-descriptions class="margin-top" title="Jenkins任务信息" :column="3" border>
      <template slot="extra">
        <router-link to="/order/jenkins_order">
          <el-button type="primary" style="margin-right: 10px" size="small">返回</el-button>
        </router-link>
      </template>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          Jenkins地址
        </template>
        {{ dataForm.jenkins_address }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          Jenkins ID
        </template>
        {{ dataForm.jenkins_order_id }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          状态
        </template>
        {{ dataForm.status }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          运行时间
        </template>
        {{ dataForm.datetime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          项目
        </template>
        {{ dataForm.service_environment.rw_project }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          环境
        </template>
        {{ dataForm.service_environment.rw_environment }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          服务信息
        </template>
        {{ dataForm.service_environment.rw_service }}
      </el-descriptions-item>
    </el-descriptions>
    <div
      class="app-container background-sub"
    >
      <el-card
        style="color: #e6ebf5;background-color: #001528"
        v-html="dataForm.jenkins_log"
      />
    </div>
  </div>
</template>

<script>

import { getJenkinsOrder } from '@/api/order'

export default {
  data() {
    return {
      id: '',
      dataForm: [],
      listLoading: false
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    this.fetchData(this.id)
  },
  methods: {
    fetchData(id) {
      getJenkinsOrder(id).then(response => {
        this.dataForm = response.data
        // set tagsview title

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style>
.background-order {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  /*background-color: #409EFF;*/
  background: linear-gradient(to bottom right, #68cdf1,#e6ebf5);
  color: #e6ebf5;
  overflow: hidden;
}
.background-sub {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 10px;
  /*background-color: #409EFF;*/
  background: linear-gradient(to bottom right, #f1b531,#e6ebf5);
  color: #e6ebf5;
  overflow: hidden;
}
.background-log {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 10px;
  /*background-color: #409EFF;*/
  background: linear-gradient(to bottom right, #f5b3f3,#e6ebf5);
  color: #e6ebf5;
  overflow: hidden;
}
</style>
