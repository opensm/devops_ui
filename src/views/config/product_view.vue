<template>
  <div class="app-container background-order">
    <el-descriptions class="margin-top" title="镜像信息" :column="1" border>
      <template slot="extra">
        <router-link to="/config/product">
          <el-button type="primary" style="margin-right: 10px" size="small">返回</el-button>
        </router-link>
      </template>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          所属服务
        </template>
        {{ dataForm.rw_service }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          是否有效
        </template>
        <span v-if="dataForm.status">是</span>
        <span v-else>否</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          是否部署
        </template>
        <span v-if="dataForm.install_status">是</span>
        <span v-else>否</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          镜像地址
        </template>
        {{ dataForm.images }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building" />
          jira版本信息
        </template>
        {{ dataForm.desc }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building" />
          更新内容说明
        </template>
        {{ dataForm.desc }}
      </el-descriptions-item>
    </el-descriptions>


    <div class="app-container background-log">
      <el-descriptions class="margin-top" title="部署情况" :column="1" border>
      </el-descriptions>
      <el-timeline reverse='true'>
        <div v-for="(activity, index) in envList" :key="index">
          <el-timeline-item
            v-if="activity.id in service_environment_list"
            color="green"
            :timestamp="activity.environment">
            已部署
          </el-timeline-item>
          <el-timeline-item
            v-else
            color="red"
            :timestamp="activity.environment">
            未部署
          </el-timeline-item>
        </div>
      </el-timeline>

    </div>
  </div>
</template>

<script>

import { getProduct } from '@/api/config'
import { getEnvironmentList } from '@/api/environment'
export default {
  data() {
    return {
      id: '',
      dataForm: [],
      listLoading: false,
      envList: [],
      service_environment_list: []
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    this.fetchData(this.id)
    this.getEnv()
  },
  methods: {
    getEnv(){
      getEnvironmentList().then(response =>{
        this.envList = response.data
      })
    },
    fetchData(id) {
      getProduct(id).then(response => {
        this.dataForm = response.data
        // 获取已部署服务列表
        this.dataForm.rw_service_environment.forEach(item => {
          this.service_environment_list.push(item.id)
        })
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
