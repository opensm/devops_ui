<template>
  <div class="app-container">
    <el-form ref="form" :model="dataForm" label-width="120px">
      <el-form-item style="text-align: center;">
        <span style="font-size: 30px;">新建发布工单</span>
      </el-form-item>
      <el-form-item
        label="发布说明"
        :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
      >
        <el-input v-model="dataForm.desc" type="textarea" />
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="通知"
            :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
          >
            <el-select
              v-model="dataForm.notice"
              placeholder="选择通知方式"
              style="width: 50%;"
              multiple
            >
              <el-option
                v-for="(notice, index) in notice_select"
                :key="'notice'+index"
                :label="notice.notice_type"
                :value="notice.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="工单时间"
            :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
          >
            <el-col :span="11">
              <el-date-picker
                v-model="dataForm.order_time"
                type="datetime"
                placeholder="任务时间"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="suborder">
        <div
          v-for="(suborder,index) in dataForm.suborders"
          :key="'suborders'+index"
        >
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
                    :key="'contentType'+index1"
                    :label="content.model.label"
                    :value="content.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="关联配置："
                :prop="'suborders.' + index + '.object_id'"
                :rules="[{required: true, message: '对应配置不能为空', trigger: 'change'}]"
              >
                <el-select
                  v-model="dataForm.suborders[index]['object_id']"
                  :disabled="!dataForm.suborders[index].content_type"
                >
                  <template v-for="(content, index1) in suborder_select[index]">
                    <el-option
                      v-if="'address' in content"
                      :key="index1+'addresss'"
                      :value="content.id"
                      :label="content.rw_environment + ':' + content.address"
                    />
                    <el-option
                      v-else
                      :key="index1+'addresss1'"
                      :value="content.id"
                      :label="content.helm_repo_chart"
                    />
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="suborder.content_type==19"
                :key="index"
                label="数据库名称："
                :prop="'suborders.' + index + '.correlation_name'"
                :rules="[{required: true, message: '数据库名称不能为空', trigger: 'blur'}]"
              >
                <el-input v-model="dataForm.suborders[index]['correlation_name']" type="textarea" />
              </el-form-item>
              <el-form-item
                v-if="suborder.content_type==19"
                label="新增是否备份："
                :prop="'suborders.' + index + '.is_backup'"
                :rules="{required: true, message: '字段必填', trigger: 'change'}"
              >
                <el-switch v-model="dataForm.suborders[index].is_backup" />
              </el-form-item>
              <el-row>
                <el-form-item
                  v-if="order_type[index] === 'kuberneteshelmchartmodel'"
                  label="服务配置："
                  :prop="'suborders.' + index + '.service_env'"
                  :rules="{ required: true, message: '字段必填', trigger: 'blur' }"
                >
<!--                  :disabled="!dataForm.suborders[index]['object_id']"-->
                  <el-select
                    v-model="dataForm.suborders[index]['service_env']"

                    @change="get_images"
                  >
                    <el-option
                      v-for="(contents, index1) in service_select"
                      :key="'service_select'+index1"
                      :label="'项目：' + contents.rw_project + '，环境:' + contents.rw_environment + '，服务:' + contents.rw_service"
                      :value="contents.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="suborder.content_type==22"
                  label="命名空间："
                  :prop="'suborders.' + index + '.namespace'"
                  :rules="[{required: true, message: '命名空间不能为空', trigger: 'blur'}]"
                >
                  <el-input v-model="dataForm.suborders[index]['namespace']" />
                </el-form-item>
                <el-form-item
                  v-if="suborder.content_type==22"
                  label="分组："
                  :prop="'suborders.' + index + '.group'"
                  :rules="[{required: true, message: '分组不能为空', trigger: 'blur'}]"
                >
                  <el-input v-model="dataForm.suborders[index]['group']" />
                </el-form-item>
                <el-form-item
                  v-if="suborder.content_type==22"
                  label="文件名称："
                  :prop="'suborders.' + index + '.file_name'"
                  :rules="[{required: true, message: '文件名称不能为空', trigger: 'blur'}]"
                >
                  <el-input v-model="dataForm.suborders[index]['file_name']" />
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
                    :key="'image_select'+index1"
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
        <el-button type="primary" @click="onSubmit">
          提交
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getContentType, getOrder, createOrder, updateOrder } from '@/api/order'
import { getServiceEnvironmentList, getNoticeList } from '@/api/config'

const defaultForm = {
  order_time: undefined,
  notice: [],
  suborders: [],
  desc: ''
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
      order_type: [],
      content_type: [],
      suborder_select: [],
      service_select: [],
      image_select: [],
      notice_select: [],
      dataForm: Object.assign({}, defaultForm),
    }
  },
  created() {
    debugger
    if (this.isEdit) {
      debugger
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }else{
      this.dataForm= {
        order_time: undefined,
        notice: [],
        suborders: [],
        desc: ''
      }
    }
    this.getSelectContentType()
    this.getServiceEnvironment()
    this.getNotice()
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
    },
    setPageTitle() {
      const title = '编辑工单'
      document.title = `${title} - ${this.dataForm.id}`
    },
    getNotice() {
      getNoticeList().then(response => {
        this.notice_select = response.data
      })
    },
    get_images(event) {
      this.service_select.forEach(item => {
        if (item.id === event) {
          this.image_select = item.production
        }
      })
    },
    content_change(event, index) {
      this.suborder_select[index] = {}
      this.dataForm.suborders[index].object_id = ''
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
      this.dataForm.suborders.push({
        content_type: undefined,
        object_id: undefined,
        go_over: false,
        params: '',
        service_env: '',
        images: '',
        namespace:'',
        group:'',
        file_name:'',
        is_backup:false,
        correlation_name:''
      })
      this.suborder_select.push({})
    },
    removeSuborder(item) {
      const index = this.dataForm.suborders.indexOf(item)
      if (index !== -1) {
        this.dataForm.suborders.splice(index, 1)
        this.suborder_select.splice(index, 1)
      }
    },
    dealData(data){
     data.suborders.forEach(val=>{
      if(val.content_type===22){
        val['correlation_name']=val.namespace+val.group+val.file_name
      }
     })
      return data
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {

          console.log(this.dealData(this.dataForm))
          this.loading = true
          if (this.isEdit) {
            updateOrder(this.from.id, this.from).then(response => {
              const { message, code } = response
              this.$notify({
                title: '成功',
                message: `修改成功： ${message},代码：${code}`,
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/order/list' })
            })
          } else {
            createOrder(this.dataForm).then(response => {
              const { message, code } = response
              this.$notify({
                title: '成功',
                message: `新建成功： ${message},代码：${code}`,
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/order/list' })
            })
          }
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
      this.$router.push({ path: '/order/list' })
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
