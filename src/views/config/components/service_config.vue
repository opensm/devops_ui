<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position="top" label-width="100px">
      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning /> -->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 80px;" prop="service_name">
              <MDinput v-model="postForm.service_name" :maxlength="100" name="service_name" required>
                服务名称
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="10" style="margin-bottom: 40px;">
                  <!-- <el-form-item label-width="100px" label="配置类型:" class="postInfo-container-item" prop="content_type">
                    <el-input
                      v-model="postForm.content_type"
                      placeholder="配置类型"
                      clearable
                    />
                    <el-form-item /> -->
                  <el-form-item label="配置类型:" prop="content_type" class="postInfo-container-item">
                    <el-radio-group v-model="postForm.content_type">
                      <el-radio-button label="secret">密文</el-radio-button>
                      <el-radio-button label="config">明文</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10" style="margin-bottom: 40px;">
                  <el-form-item label="备注:" label-width="90px" class="postInfo-container-item" prop="description">
                    <el-input
                      v-model="postForm.description"
                      placeholder="备注"
                      clearable
                    />
                    <el-form-item />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label="配置内容:" prop="content">
          <!-- <el-input v-model="postForm.content" :rows="5" type="textarea" class="article-textarea" autosize placeholder="请输入配置内容" /> -->
          <!-- <CodePage
            ref="codemirror"
            class="details_centerCode Codemirrors"
            :autofocus-flg="false"
            :read-only-flg="false"
            :mode-flg="false"
            :value="postForm.content"
          /> -->
          <!-- <code-editor
            :cm-theme="cmTheme"
            @update:editorValue="postForm.content = $event"
          /> -->
          <!-- <template> -->
          <!--          <div class="code-mirror-div">-->
          <div class="tool-bar">
            <span>选择主题</span>
            <el-select v-model="cmTheme" style="margin-left: 10px;width:150px" placeholder="请选择" size="small">
              <el-option v-for="item in cmThemeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <span style="margin-left: 10px">编辑模式</span>
            <el-select
              v-model="cmEditorMode"
              placeholder="请选择"
              size="small"
              style="width:150px;margin-left: 10px"
              @change="onEditorModeChange"
            >
              <el-option
                v-for="item in cmEditorModeOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-button v-if="isEdit" type="primary" size="small" style="margin-left:10px;width:150px" @click="getValue">获取内容</el-button>
          </div>
          <CodeMirrorEditor
            ref="cmEditor"
            :cmTheme="cmTheme"
            :cm-mode="cmMode"
            :auto-format-json="autoFormatJson"
            :json-indentation="jsonIndentation"
            :editorValues.sync="postForm.content"
          />
          <!--          </div>-->
        </el-form-item>
      </div>
      <sticky :z-index="10" class-name="draft" style="float:right">
        <el-button v-loading="loading" style="margin:10px 40px 0 10px" type="success" @click="submitForm">
          确认
        </el-button>
        <router-link to="/config/service_config" style="margin:10px 40px 0 10px">
          <el-button v-loading="loading" type="warning">
            取消
          </el-button>
        </router-link>
      </sticky>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import CodeMirrorEditor from '@/components/Codemirror2/index'
import {
  getServiceConfig,
  createServiceConfig,
  updateServiceConfig
} from '@/api/service'
// import { searchUser } from '@/api/remote-search'
// import Warning from './Warning'
import { checkSpecialKey } from '@/utils/validate'
const defaultForm = {
  id: undefined,
  service_name: '',
  content: '',
  content_type: 'secret',
  description: ''
}

export default {
  name: 'DetailPage',
  components: { MDinput, Sticky, CodeMirrorEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateServiceName = (rule, value, callback) => {
      if (!checkSpecialKey(value)) {
        callback(new Error('请不要填入特殊字符'))
      } else {
        callback()
      }
    }
    return {
      cmTheme: 'material-darker',
      cmMode: 'yaml',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        service_name: [
          { required: true, message: '服务名称必须填写', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'blur' },
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur' },
          { pattern: /[0-9a-zA-Z]{1,10}/, message: '只可以输入数字和字母和中横杠', trigger: 'blur' },
          { validator: validateServiceName, message: '只可以输入数字和字母和中横杠', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '配置内容必须填写', trigger: 'blur' }
        ],
        content_type: [
          { required: true, message: '配置类型必须填写', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '备注需要填写', trigger: 'blur' }
        ]
      },
      tempRoute: {},
      // 编辑器配置
      // cmTheme: 'default', // codeMirror主题
      // codeMirror主题选项
      cmThemeOptions: [
        'default',
        '3024-day',
        '3024-night',
        'abcdef',
        'ambiance',
        'ayu-dark',
        'ayu-mirage',
        'base16-dark',
        'base16-light',
        'bespin',
        'blackboard',
        'cobalt',
        'colorforth',
        'darcula',
        'dracula',
        'duotone-dark',
        'duotone-light',
        'eclipse',
        'elegant',
        'erlang-dark',
        'gruvbox-dark',
        'hopscotch',
        'icecoder',
        'idea',
        'isotope',
        'lesser-dark',
        'liquibyte',
        'lucario',
        'material',
        'material-darker',
        'material-palenight',
        'material-ocean',
        'mbo',
        'mdn-like',
        'midnight',
        'monokai',
        'moxer',
        'neat',
        'neo',
        'night',
        'nord',
        'oceanic-next',
        'panda-syntax',
        'paraiso-dark',
        'paraiso-light',
        'pastel-on-dark',
        'railscasts',
        'rubyblue',
        'seti',
        'shadowfox',
        'solarized dark',
        'solarized light',
        'the-matrix',
        'tomorrow-night-bright',
        'tomorrow-night-eighties',
        'ttcn',
        'twilight',
        'vibrant-ink',
        'xq-dark',
        'xq-light',
        'yeti',
        'yonce',
        'zenburn'
      ],
      cmEditorMode: 'default', // 编辑模式
      // 编辑模式选项
      cmEditorModeOptions: [
        'default',
        'json',
        'sql',
        'javascript',
        'css',
        'xml',
        'html',
        'yaml',
        'markdown',
        'python'
      ],
      // cmMode: 'application/json', //codeMirror模式
      jsonIndentation: 2, // json编辑模式下，json格式化缩进 支持字符或数字，最大不超过10，默认缩进2个空格
      autoFormatJson: true // json编辑模式下，输入框失去焦点时是否自动格式化，true 开启， false 关闭
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
      getServiceConfig(id).then(response => {
        this.postForm = response.data
        console.log('!!!!'+this.postForm.content)
        // set tagsview title
        // this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    // setTagsViewTitle() {
    //   // const title = '编辑Kubernetes'
    //   // const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
    //   // this.$store.dispatch('tagsView/updateVisitedView', route)
    // },
    setPageTitle() {
      const title = '编辑Kubernetes'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateServiceConfig(this.postForm.id, this.postForm).then(response => {
              const { message, code } = response
              this.$notify({
                title: '成功',
                message: `修改成功： ${message},代码：${code}`,
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/config/service_config' })
            })
          } else {
            createServiceConfig(this.postForm).then(response => {
              const { message, code } = response
              this.$notify({
                title: '成功',
                message: `新建成功： ${message},代码：${code}`,
                type: 'success',
                duration: 2000
              })
              this.$router.push({ path: '/config/service_config' })
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
      if (this.postForm.name.length === 0 || this.postForm.content.length === 0) {
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
    },
    // 切换编辑模式事件处理函数
    onEditorModeChange(value) {
      switch (value) {
        case 'json':
          this.cmMode = 'application/json'
          break
        case 'sql':
          this.cmMode = 'sql'
          break
        case 'javascript':
          this.cmMode = 'javascript'
          break
        case 'xml':
          this.cmMode = 'xml'
          break
        case 'css':
          this.cmMode = 'css'
          break
        case 'html':
          this.cmMode = 'htmlmixed'
          break
        case 'yaml':
          this.cmMode = 'yaml'
          break
        case 'markdown':
          this.cmMode = 'markdown'
          break
        case 'python':
          this.cmMode = 'python'
          break
        default:
          this.cmMode = 'application/json'
      }
    },
    // 修改样式（不推荐，建议参考<style>中的样式，提前配置好样式）

    setStyle() {
      const styleStr = 'position: absolute; top: 80px; left: 50px; right: 200px; bottom: 20px; padding: 2px; height: auto;'
      this.$refs.cmEditor.setStyle(styleStr)
    },
    // 获取内容
    getValue() {
      // const content = this.postForm.content
      this.$refs.cmEditor.setValue(this.postForm.content)
      // console.log(content)
    },

    // 修改内容
    setValue() {
      this.$refs.cmEditor.setValue(this.postForm.content)
    }
  }
}
</script>

  <!-- <style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .createPost-container {
    position: relative;
    .btn-box{
  text-align:right;
  padding-right:10%;
}
    .createPost-main-container {
      padding-left:10%;
      padding-right:10%;

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

<style>

.CodeMirror {
  position: absolute;
  top: 80px;
  left: 2px;
  right: 5px;
  bottom: 0px;
  padding: 2px;
  height: 100%;
  overflow-y: auto;
}

</style>
<style lang='scss' scoped>

.code-mirror-div {
  position: absolute;
  top: 0px;
  left: 2px;
  right: 5px;
  bottom: 0px;
  padding: 2px;
  .tool-bar {
    top: 20px;
    margin: 20px 2px 0px 10px;

  }
}
</style> -->

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

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
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
<!--<style>-->
<!--.CodeMirror {-->
<!--  position: absolute;-->
<!--  top: 80px;-->
<!--  left: 2px;-->
<!--  right: 5px;-->
<!--  bottom: 0;-->
<!--  padding: 2px;-->
<!--  height: auto;-->
<!--  overflow-y: auto;-->
<!--}-->
<!--</style>-->
<style lang='scss' scoped>

.code-mirror-div {
  position: absolute;
  top: 0;
  left: 2px;
  right: 5px;
  bottom: 0;
  padding: 2px;
  .tool-bar {
    top: 20px;
    margin: 30px 2px 0 20px;
  }
}
</style>
