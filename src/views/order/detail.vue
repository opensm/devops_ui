<template>
  <div class="app-container background-order">
    <el-descriptions class="margin-top" title="工单信息" :column="3" border>
      <template slot="extra">
        <router-link to="/order/list">
          <el-button type="primary" style="margin-right: 10px" size="small">返回</el-button>
        </router-link>
      </template>
      <template slot="extra">
        <router-link :to="'/order/edit/'+ id">
          <el-button type="primary" size="small">编辑</el-button>
        </router-link>
      </template>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          Jira工单
        </template>
        {{ dataForm.jira_order }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          状态
        </template>
        {{ dataForm.status }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          回退工单
        </template>
        {{ dataForm.re_orders }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          任务时间
        </template>
        {{ dataForm.order_time }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          完成时间
        </template>
        {{ dataForm.finish_time }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          创建时间
        </template>
        {{ dataForm.create_time }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building" />
          发布说明
        </template>
        {{ dataForm.desc }}
      </el-descriptions-item>
    </el-descriptions>
    <div
      v-for="(sub,index) in dataForm.suborders"
      :key="index"
      class="app-container background-sub"
    >
      <el-descriptions class="margin-top" :title="'子单信息：' + index" :column="4" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            发布类别
          </template>
          {{ sub.content_type }}
        </el-descriptions-item>
        <el-descriptions-item v-if="sub.service_env">
          <template slot="label">
            <i class="el-icon-office-building" />
            服务配置
          </template>
          {{ sub.service_env }}
        </el-descriptions-item>
        <el-descriptions-item v-if="sub.object_id">
          <template slot="label">
            <i class="el-icon-office-building" />
            关联配置
          </template>
          {{ sub.service_env }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            发布说明
          </template>
          {{ sub.desc }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="app-container background-log">
      <el-descriptions class="margin-top" title="日志信息" :column="1" border>
      </el-descriptions>
      <el-timeline reverse="true">
        <el-timeline-item
          v-for="(activity, index) in dataForm.order_logs"
          :key="index"
          color='#0bbd87'
          :timestamp="activity.create_time">
          {{ activity.logs }}
        </el-timeline-item>
      </el-timeline>

    </div>
  </div>
</template>

<script>

import { getOrder } from '@/api/order'

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
      getOrder(id).then(response => {
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
