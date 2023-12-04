<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning /> -->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 80px;" prop="name">
              <MDinput v-model="postForm.name" :maxlength="100" name="name" required>
                集群名称
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="10" style="margin-bottom: 40px;">
                  <el-form-item label-width="100px" label="正则匹配:" class="postInfo-container-item" prop="regular">
                    <el-input
                      v-model="postForm.regular"
                      placeholder="请输入正则"
                      clearable
                    />
                    <el-form-item />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="140px" label="是否开启debug:" class="postInfo-container-item" prop="debug">
                    <el-switch
                      v-model="postForm.debug"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="配置:" prop="kubeconfig">
          <el-input v-model="postForm.kubeconfig" :rows="5" type="textarea" class="article-textarea" autosize placeholder="请输入集群配置" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}个字符</span>
        </el-form-item>
      </div>
      <sticky :z-index="10" class="btn-box" class-name="sub-navbar draft">
        <el-button v-loading="loading" style="margin-right: 10px;" type="success" @click="submitForm">
          确认
        </el-button>
        <router-link to="/config/kubernetes">
          <el-button v-loading="loading" type="warning">
            取消
          </el-button>
        </router-link>
        <!-- <el-button v-loading="loading" type="warning">
          取消
        </el-button> -->
      </sticky>
    </el-form>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validURL } from '@/utils/validate'
import {
  getKubernetes,
  updateKubernetes,
  createKubernetes
} from '@/api/kubernetes'
// import { searchUser } from '@/api/remote-search'
// import Warning from './Warning'

const defaultForm = {
  name: '', // 文章题目
  kubeconfig: '', // 文章内容
  regular: '', // 文章摘要
  debug: '', // 文章外链
  desc: '' // 文章图片
}

export default {
  name: 'ArticleDetail',
  components: { MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: [
          { required: true, message: '集群名称必须填写', trigger: 'blur' }
        ],
        kubeconfig: [
          { required: true, message: '集群配置必须填写', trigger: 'blur' }
        ],
        regular: [
          { required: true, message: '正则规则必须填写', trigger: 'blur' }
        ],
        debug: [
          { required: true, message: '是否开启debug需要填写', trigger: 'blur' }
        ]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.kubeconfig.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      getKubernetes(id).then(response => {
        this.postForm = response.data
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑Kubernetes'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑Kubernetes'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateKubernetes(this.postForm.id, this.postForm).then(response => {
              const { message, code } = response
              this.$notify({
                title: '成功',
                message: `修改成功： ${message},代码：${code}`,
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/config/kubernetes' })
            })
          } else {
            createKubernetes(this.postForm).then(response => {
              const { message, code } = response
              this.$notify({
                title: '成功',
                message: `新建成功： ${message},代码：${code}`,
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/config/kubernetes' })
            })
          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.name.length === 0 || this.postForm.kubeconfig.length === 0) {
        this.$message({
          message: '请填写必要的名称和配置',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .createPost-container {
    position: relative;
    .btn-box{
  text-align:right;
  padding-right:10%;
}
    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 80px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
  </style>

