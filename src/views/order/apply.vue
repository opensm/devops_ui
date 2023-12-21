<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item style="text-align: center;">
        <span style="font-size: 30px;">新建发布工单</span>
      </el-form-item>
      <el-form-item
        label="发布说明"
        :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
      >
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="通知"
            :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
          >
            <el-select v-model="form.notice" placeholder="选择通知方式" style="width: 50%;" multiple>
              <el-option label="钉钉" value="dingding" />
              <el-option label="企业微信" value="wechat" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="工单时间"
            :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
          >
            <el-col :span="11">
              <el-date-picker v-model="form.order_time" type="datetime" placeholder="任务时间" style="width: 100%;" />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="suborder">
        <div v-for="(suborder,index) in form.suborders" :key="index">
          <el-divider />
          <el-row type="flex" align="middle">
            <el-col :span="7" style="margin-right: 20px">
              <el-form-item
                :label="index + 1 + '：执行类型：'"
                :prop="'suborders.' + index + '.content_type'"
                :rules="[{required: true, message: '对应配置不能为空', trigger: 'blur'}]"
              >
                <el-select v-model="suborder.content_type" @change="content_change($event,index)">
                  <el-option
                    v-for="(content, index1) in content_type"
                    :key="index1"
                    :label="content.model.label"
                    :value="content.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :key="index"
                label="关联配置："
                :prop="'suborders.' + index + '.object_id'"
                :rules="[{required: true, message: '对应配置不能为空', trigger: 'blur'}]"
              >
                <el-select
                  v-model="suborder.object_id"
                  :disabled="!suborder.content_type"
                >
                  <template v-for="(content, index1) in suborder_select[index]">
                    <el-option
                      v-if="'address' in content"
                      :key="index1"
                      :value="content.id"
                      :label="content.rw_environment + ':' + content.address"
                    />
                    <el-option
                      v-else
                      :key="index1"
                      :value="content.id"
                      :label="content.helm_repo_chart"
                    />
                  </template>
                </el-select>
              </el-form-item>
              <el-row>
                <el-form-item
                  v-if="order_type[index] === 'kuberneteshelmchartmodel'"
                  label="服务配置："
                  :prop="'suborders.' + index + '.service_env'"
                  :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
                >
                  <el-select
                    v-model="suborder.service_env"
                    :disabled="! suborder.object_id"
                    @change="get_images"
                  >
                    <el-option
                      v-for="(content, index1) in service_select"
                      :key="index1"
                      :label="'项目：' + content.rw_project + '，环境:' + content.rw_environment + '，服务:' + content.rw_service"
                      :value="content.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="强制执行："
                  :prop="'suborders.' + index + '.go_over'"
                  :rules="{required: true, message: '字段必填', trigger: 'blur'}"
                >
                  <el-switch v-model="suborder.go_over" />
                </el-form-item>
              </el-row>
            </el-col>
            <el-col :span="12" style="margin-right: 20px">
              <el-form-item
                v-if="order_type[index] !== 'kuberneteshelmchartmodel'"
                label="执行参数"
                :prop="'suborders.' + index + '.params'"
                :rules="[{ required: true, message: '字段必填', trigger: 'blur' }]"
              >
                <el-input v-model="suborder.params" type="textarea" rows="8" show-word-limit />
              </el-form-item>
              <el-form-item
                v-if="order_type[index] === 'kuberneteshelmchartmodel'"
                label="关联镜像"
                :prop="'suborders.' + index + '.images'"
                :rules="[{ required: true, message: '字段必填', trigger: 'blur' }]"
              >
                <el-select v-model="suborder.images">
                  <el-option
                    v-for="(product,index1) in image_select"
                    :key="index1"
                    :value="product.id"
                    :label="product.images"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item
                :key="index+'s'"
                :label="` \u00a0`"
              >
                <el-button style="margin-bottom: 0;" type="danger" @click.prevent="removeSuborder(suborder)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-form-item style="text-align: left;margin-top: 20px;">
        <el-button type="success" @click="addSuborder">新增子任务</el-button>
      </el-form-item>
      <el-form-item class="dialog-footer">
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getContentType } from '@/api/order'
import { getServiceEnvironmentList } from '@/api/config'

const defaultForm = {
  jira_order: undefined,
  order_time: undefined,
  status: 0,
  re_orders: '',
  notice: [],
  suborders: [],
  desc: ''
}
export default {
  data() {
    return {
      order_type: [],
      content_type: [],
      suborder_select: [],
      service_select: [],
      image_select: [],
      form: Object.assign({}, defaultForm)
    }
  },
  created() {
    this.getSelectContentType()
    this.getServiceEnvironment()
  },
  methods: {
    get_images(event) {
      this.service_select.forEach(item => {
        if (item.id === event) {
          this.image_select = item.production
        }
      })
    },
    content_change(event, index) {
      this.suborder_select[index] = {}
      this.form.suborders[index].object_id = ''
      this.order_type[index] = ''
      this.content_type.forEach(item => {
        if (item.id === event) {
          this.suborder_select[index] = item.model.child
          this.order_type[index] = item.model.label
        }
      })
    },
    getServiceEnvironment() {
      getServiceEnvironmentList(this.listQuery).then(response => {
        this.service_select = response.data
        // Just to simulate the time of the request
      })
    },
    getSelectContentType() {
      getContentType().then((response) => {
        this.content_type = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    addSuborder() {
      this.form.suborders.push({
        content_type: undefined,
        object_id: undefined,
        go_over: false,
        status: 0,
        params: '',
        service_env: '',
        images: ''
      })
      this.suborder_select.push({})
    },
    removeSuborder(item) {
      const index = this.form.suborders.indexOf(item)
      if (index !== -1) {
        this.form.suborders.splice(index, 1)
        this.suborder_select.splice(index, 1)
      }
    },
    onSubmit() {
      console.log(this.form)
      // this.form.suborders.content_type =>
      // params.content_type=
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
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
