<template>
  <div class="app-container">
    <el-form ref="form" :model="dataForm" label-width="120px">
      <el-form-item style="text-align: center;">
        <span style="font-size: 30px;">新建发布工单</span>
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="关联服务"
            :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
          >
            <el-select
              v-model="dataForm.service_env"
              placeholder="执行服务"
              style="width: 50%;"
            >
              <el-option
                v-for="(select, index) in selectOption1"
                :key="index"
                :label="'项目:' + select.rw_project + ',环境：' + select.rw_environment + ',服务：' + select.rw_service"
                :value="select.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="运行jenkins"
            :rules="{ required: true, message: '字段必1填', trigger: 'blur' }"
          >
            <el-select
              v-model="dataForm.jenkins"
              placeholder="运行jenkins"
              style="width: 50%;"
            >
              <el-option
                v-for="(select, index) in selectOption2"
                :key="index"
                :label="select.address"
                :value="select.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item class="dialog-footer">
        <el-button type="primary" @click="onSubmit">
          提交
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { createJenkinsOrder } from '@/api/order'
import { getServiceEnvironmentList, getJenkinsAll } from '@/api/config'

const defaultForm = {
  jenkins: '',
  service_env: ''
}
export default {
  name: 'OrderDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectOption1: [],
      selectOption2: [],
      dataForm: Object.assign({}, defaultForm)
    }
  },
  created() {
    this.getServiceEnvironment()
    this.getJenkins()
  },
  methods: {
    setPageTitle() {
      const title = '编辑工单'
      document.title = `${title} - ${this.dataForm.id}`
    },
    getServiceEnvironment() {
      getServiceEnvironmentList().then(response => {
        this.selectOption1 = response.data
      })
    },
    getJenkins() {
      getJenkinsAll(this.listQuery).then(response => {
        this.selectOption2 = response.data
        // Just to simulate the time of the request
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          createJenkinsOrder(this.dataForm).then(response => {
            const { message, code } = response
            this.$notify({
              title: '成功',
              message: `新建成功： ${message},代码：${code}`,
              type: 'success',
              duration: 2000
            })
            this.$router.push({ path: '/order/jenkins_order' })
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel() {
      this.$message({
        message: '取消!',
        type: 'warning'
      })
      this.$router.push({ path: '/order/jenkins_order' })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

<style>
.suborder{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  /*background-color: #409EFF;*/
  background: linear-gradient(to bottom right,#ffba00,#e6ebf5);
  color: #e6ebf5;
  overflow: hidden;
}
.el-select {
  width: 100%;
}
.dialog-footer{
  margin-top: 3%;
  margin-right: 20%;
  text-align: right;
}
</style>
