<template>
  <div class="app-container">
    {{ form }}
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="发布说明">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="告警通知">
        <el-select v-model="form.notice" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="工单时间">
        <el-col :span="11">
          <el-date-picker v-model="form.order_time" type="datetime" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-row>
        <div v-for="(suborder,index) in form.suborders" :key="index">
          <el-divider />
          <el-row type="flex" align="middle">
            <el-col :span="7" style="margin-right: 20px">
              <el-form-item
                :key="index"
                :label="'执行类型：' + index"
                :prop="'suborders.' + index + '.content_type'"
                :rules="[{required: true, message: '对应配置不能为空', trigger: 'blur'}]"
                @change="content_change()"
              >
                <el-select v-model="suborder.content_type">
                  <el-option
                    v-for="(content, index) in content_type"
                    :key="index"
                    :label="content.model.label"
                    :value="content.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :key="index"
                :label="'关联配置：' + index"
                :prop="'suborders.' + index + '.object_id'"
                :rules="[{required: true, message: '对应配置不能为空', trigger: 'blur'}]"
                @change="content_change()"
              >
                <el-select v-model="suborder.object_id">
                  <el-option
                    v-for="(content, index) in suborder_select"
                    :key="index"
                    :label="content.rw_environment + ':' + content.db_type"
                    :value="content.id"
                  />
                </el-select>
              </el-form-item>
<!--              <el-form-item-->
<!--                :key="index"-->
<!--                :label="'对应配置：' + index"-->
<!--                :prop="'suborders.' + index + '.object_id'"-->
<!--                :rules="[{required: true, message: '对应配置不能为空', trigger: 'blur'}]"-->
<!--              >-->
<!--                <el-input-number v-model="suborder.object_id" :min="80" :max="65535" />-->
<!--              </el-form-item>-->
              <el-form-item
                :key="index"
                :label="'强制执行：' + index"
                :prop="'suborders.' + index + '.go_over'"
                :rules="{required: true, message: '字段必填', trigger: 'blur'}"
              >
                <el-switch v-model="suborder.go_over" />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-right: 20px">
              <el-form-item
                :key="index"
                :label="'执行参数：' + index"
                :prop="'suborders.' + index + '.params'"
                :rules="[{ required: true, message: '字段必填', trigger: 'blur' }]"
              >
                <el-input v-model="suborder.params" type="textarea" rows="7" />
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
        <el-form-item>
          <el-button type="success" @click="addSuborder">新增子任务</el-button>
        </el-form-item>
        <el-divider content-position="center">子任务列表</el-divider>
      </el-row>
      <el-form-item class="dialog-footer">
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getContentType } from '@/api/order'

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
      content_type: [],
      suborder_select: [],
      form: Object.assign({}, defaultForm)
    }
  },
  created() {
    this.getSelectContentType()
  },
  methods: {
    content_change(event) {
      console.log(event)
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
        params: ''
      })
      this.suborder_select.push({})
    },
    removeSuborder(item) {
      const index = this.form.suborders.indexOf(item)
      if (index !== -1) {
        this.form.suborders.splice(index, 1)
      }
    },
    onSubmit() {
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
.el-select {
  width: 100%;
}
</style>
