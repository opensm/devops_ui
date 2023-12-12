<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="top"
      style="width: 400px;
      margin-left: 50px"
    >
      <el-form-item label="原来密码" prop="old_password">
        <el-input v-model="form.old_password" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password">
        <el-input v-model="form.confirm_password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">确认</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkPassword } from '@/utils/validate'
import { passwdUser, checkPasswdUser } from '@/api/user'
import { mapGetters } from 'vuex'
import { enSecret } from '@/utils/secret'
// import { getPubicKey } from '@/utils/auth'
// import { state } from 'jshint/src/state'
import store from '@/store'

export default {

  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不够，需要超过8位'))
      } else if (!checkPassword(value)) {
        callback(new Error('密码填写错误，请填写6-20位，不包含中文至少包含一位数字字符和大小写字母'))
      } else {
        callback()
      }
    }
    const repeatValidate = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const oldValidate = (rule, value, callback) => {
      console.log(store.getters.publickey)
      const old_password = enSecret(value, store.getters.publickey)
      checkPasswdUser({ old_password: old_password }).then(response => {
        const { status } = response.data
        if (!status) {
          callback(new Error('密码不正确!'))
        } else {
          callback()
        }
      })
    }
    return {
      // userid: '',
      rules: {
        old_password: [
          { required: true, message: '原密码必须填写', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: oldValidate }

        ],
        password: [
          { required: true, message: '新密码必须填写', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        confirm_password: [
          { required: true, message: '确认密码必须填写', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: repeatValidate }
        ]
      },
      temp: {

      },
      form: {
        password: '',
        old_password: '',
        confirm_password: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'publickey'
    ])
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const tmp_data = this.form
          this.form.password = enSecret(this.form.password, store.getters.publickey)
          passwdUser({ 'password': this.form.password }).then(response => {
            const { message, code } = response
            this.$notify({
              title: '成功',
              message: `修改成功： ${message},代码：${code}`,
              type: 'success',
              duration: 2000
            })
            this.$router.push({ path: '/dashboard' })
          }).catch(() => {
            this.form = tmp_data
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
