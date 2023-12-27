<template>
  <div class="app-container background-order">
    <el-descriptions class="margin-top" :title="'版本信息:' + dataForm.name" :column="3" border>
      <template slot="extra">
        <router-link to="/jira/version">
          <el-button type="primary" style="margin-right: 10px" size="small">返回</el-button>
        </router-link>
      </template>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          Jira项目
        </template>
        {{ dataForm.raw_jira_project }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          jira版本ID
        </template>
        {{ dataForm.project_version_id }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          开始时间
        </template>
        {{ dataForm.start_date }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          发布时间
        </template>
        {{ dataForm.release_date }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          发布状态
        </template>
        {{ dataForm.released }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          归档状态
        </template>
        {{ dataForm.archived }}
      </el-descriptions-item>
    </el-descriptions>
    <div
      v-for="(sub,index) in dataForm.issues.issues"
      :key="index"
      class="app-container background-yellow"
    >
      <el-descriptions class="margin-top" :title="index + 1 + '.' + sub.fields.summary" :column="4" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            IssueID
          </template>
          {{ sub.id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            IssueKey
          </template>
          {{ sub.key }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            话题类别
          </template>
          {{ sub.fields.issuetype.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            优先级
          </template>
          {{ sub.fields.priority.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            报告人员
          </template>
          {{ sub.fields.reporter.displayName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            分配人员
          </template>
          {{ sub.fields.assignee.displayName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            创建人员
          </template>
          {{ sub.fields.creator.displayName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            状态
          </template>
          {{ sub.fields.status.name }}
        </el-descriptions-item>
        <el-descriptions-item v-for="(component, index) in sub.fields.components" :key="index">
          <template slot="label">
            <i class="el-icon-office-building" />
            模块 {{ index + 1 }}:
          </template>
          {{ component.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            说明
          </template>
          {{ sub.fields.description }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>

import { getJiraProjectVersionIssue } from '@/api/jira'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '完成': 'green',
        10000: 'info',
        10113: 'info',
        10200: 'info',
        10201: 'info',
        10202: 'info',
        10203: 'info',
        3: 'yellow',
        10332: 'green',
        10333: 'yellow',
        10335: 'yellow',
        10400: 'yellow',
        10336: 'yellow',
        10403: 'yellow',
        5: 'green',
        '10001': 'green',
        10337: 'green',
        6: 'green'
      }
      return statusMap[status]
    }
  },
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
      getJiraProjectVersionIssue(id).then(response => {
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
.background-yellow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 10px;
  /*background-color: #409EFF;*/
  background: linear-gradient(to bottom right, #f1b531,#e6ebf5);
  color: #e6ebf5;
  overflow: hidden;
}
.background-green {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 10px;
  /*background-color: #409EFF;*/
  background: linear-gradient(to bottom right, #05fd37,#e6ebf5);
  color: #e6ebf5;
  overflow: hidden;
}
.background-info {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 10px;
  /*background-color: #409EFF;*/
  background: linear-gradient(to bottom right, #3758f6,#e6ebf5);
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
