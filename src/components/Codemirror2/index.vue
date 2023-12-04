<template>
  <codemirror
    ref="myCm"
    class="tinymce-container "
    :value="editorValue"
    :options="cmOptions"
    @changes="onCmCodeChanges"
    @blur="onCmBlur"
    @keydown.native="onKeyDown"
    @mousedown.native="onMouseDown"
    @paste.native="OnPaste"
  />
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/blackboard.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/hint/css-hint.js'
import 'codemirror/addon/hint/html-hint.js'
import 'codemirror/addon/hint/sql-hint.js'
import 'codemirror/addon/hint/anyword-hint.js'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/json-lint'

require('script-loader!jsonlint')
// import 'codemirror/addon/lint/html-lint.js'
// import 'codemirror/addon/lint/css-lint.js'
import 'codemirror/addon/lint/javascript-lint.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/matchtags.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/display/autorefresh.js'
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/lib/codemirror.css'
// import YAML from 'js-yaml'

export default {
  name: 'CodeMirrorEditor',
  components: {
    codemirror
  },
  // props: ['cmTheme', 'cmMode', 'autoFormatJson', 'jsonIndentation'],
  props: {
    cmTheme: {
      type: String,
      default: '3024-night'
    },
    cmMode: {
      type: String,
      default: 'yaml'
    },
    jsonIndentation: {
      type: Number,
      default: 4
    },
    autoFormatJson: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editorValue: this.formValue ? this.formValue : '',
      cmOptions: {
        theme: !this.cmTheme || this.cmTheme === 'default' ? 'blackboard' : this.cmTheme,
        mode: !this.cmMode || this.cmMode === 'default' ? 'application/json' : this.cmMode,
        lineWrapping: true,
        lineNumbers: true,
        autofocus: true,
        smartIndent: false,
        autocorrect: true,
        spellcheck: true,
        extraKeys: {
          Tab: 'autocomplete',
          'Ctrl-Alt-L': () => {
            try {
              if (this.cmOptions.mode === 'application/json' && this.editorValue) {
                this.editorValue = this.formatStrInJson(this.editorValue)
              }
            } catch (e) {
              this.$message.error('格式化代码出错：' + e.toString())
            }
          }
        },
        lint: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldGutter: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchTags: { bothTags: true },
        matchBrackets: true,
        styleActiveLine: true,
        autoRefresh: true,
        highlightSelectionMatches: {
          minChars: 2,
          style: 'matchhighlight',
          showToken: true
        },
        styleSelectedText: true,
        enableAutoFormatJson: this.autoFormatJson == null ? true : this.autoFormatJson,
        defaultJsonIndentation: !this.jsonIndentation || typeof this.jsonIndentation !== typeof 1 ? 2 : this.jsonIndentation
      },
      enableAutoFormatJson: this.autoFormatJson == null ? true : this.autoFormatJson,
      defaultJsonIndentation: !this.jsonIndentation || typeof this.jsonIndentation !== typeof 1 ? 2 : this.jsonIndentation
    }
  },

  watch: {
    cmTheme: function(newValue, oldValue) {
      try {
        const theme = this.cmTheme === 'default' ? 'blackboard' : this.cmTheme
        require('codemirror/theme/' + theme + '.css')
        this.cmOptions.theme = theme
        this.resetLint()
      } catch (e) {
        this.$message.error('切换编辑器主题出错：' + e.toString())
      }
    },
    cmMode: function(newValue, oldValue) {
      this.$set(this.cmOptions, 'mode', this.cmMode)
      this.resetLint()
      this.resetFoldGutter()
    }
  },
  created() {
    try {
      if (!this.editorValue) {
        this.cmOptions.lint = false
        return
      }
      if (this.cmOptions.mode === 'application/json') {
        if (!this.enableAutoFormatJson) {
          return
        }
        this.editorValue = this.formatStrInJson(this.editorValue)
      }
    } catch (e) {
      console.log('初始化codemirror出错:' + e)
      // this.$message.error('初始化codemirror出错：' + e);
    }
  },
  methods: {
    resetLint() {
      if (!this.$refs.myCm.codemirror.getValue()) {
        this.$nextTick(() => {
          this.$refs.myCm.codemirror.setOption('lint', false)
        })
        return
      }
      this.$refs.myCm.codemirror.setOption('lint', false)
      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption('lint', true)
      })
    },
    resetFoldGutter() {
      this.$refs.myCm.codemirror.setOption('foldGutter', false)
      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption('foldGutter', true)
      })
    },

    // 修改编辑框样式

    setStyle(style) {
      try {
        this.$nextTick(() => {
          const cm = this.$refs.myCm.$el.querySelector('.CodeMirror')
          if (cm) {
            cm.style.cssText = style
          } else {
            this.$message.error('未找到编辑器元素，修改编辑器样式失败')
          }
        })
      } catch (e) {
        this.$message.error('修改编辑器样式失败：' + e.toString())
      }
    },

    // 获取值

    getValue() {
      try {
        return this.$refs.myCm.codemirror.getValue()
      } catch (e) {
        const errorInfo = e.toString()
        this.$message.error('获取编辑框内容失败：' + errorInfo)
        return errorInfo
      }
    },

    // 修改值

    setValue(value) {
      try {
        if (typeof value !== typeof '') {
          this.$message.error('修改编辑框内容失败：编辑宽内容只能为字符串')
          return
        }
        if (this.cmOptions.mode === 'application/json') {
          this.editorValue = this.formatStrInJson(value)
        } else {
          this.editorValue = value
        }
      } catch (e) {
        this.$message.error('修改编辑框内容失败：' + e.toString())
      }
    },
    // 黏贴事件处理函数

    OnPaste(event) {
      if (this.cmOptions.mode === 'application/json') {
        try {
          this.editorValue = this.formatStrInJson(this.editorValue)
        } catch (e) {
          // 啥都不做
        }
      }
    },

    // 失去焦点时处理函数

    onCmBlur(cm, event) {
      try {
        const editorValue = cm.getValue()
        if (this.cmOptions.mode === 'application/json' && editorValue) {
          if (!this.enableAutoFormatJson) {
            return
          }
          this.editorValue = this.formatStrInJson(editorValue)
        }
      } catch (e) {
        // 啥也不做
      }
    },

    // 按下键盘事件处理函数

    onKeyDown(event) {
      const keyCode = event.keyCode || event.which || event.charCode
      const keyCombination = event.ctrlKey || event.altKey || event.metaKey
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs.myCm.codemirror.showHint({ completeSingle: false })
      }
    },
    // 按下鼠标时事件处理函数

    onMouseDown(event) {
      this.$refs.myCm.codemirror.closeHint()
    },
    onCmCodeChanges(cm, changes) {
      this.editorValue = cm.getValue()
      this.$emit('update:editorValue', this.editorValue)
      this.resetLint()
    },
    // 格式化字符串为json格式字符串

    formatStrInJson(strValue) {
      return JSON.stringify(
        JSON.parse(strValue),
        null,
        this.defaultJsonIndentation
      )
    }
  }
}

</script>

<style>

.CodeMirror-selected {
  background-color: blue !important;
}
.CodeMirror-selectedtext {
  color: white !important;
}
.cm-matchhighlight {
  background-color: #ae00ae;
}

</style>

<!-- <template>
  <div class='code-mirror-div'>
    <div class='tool-bar'>
      <span>请选择主题</span>
      <el-select v-model='cmTheme' placeholder='请选择' size='small' style='width:150px'>
        <el-option v-for='item in cmThemeOptions' :key='item' :label='item' :value='item'></el-option>
      </el-select>
      <span style='margin-left: 10px'>请选择编辑模式</span>
      <el-select
        v-model='cmEditorMode'
        placeholder='请选择'
        size='small'
        style='width:150px'
        @change='onEditorModeChange'
      >
        <el-option
          v-for='item in cmEditorModeOptions'
          :key='item'
          :label='item'
          :value='item'
        ></el-option>
      </el-select>
      <el-button type='primary' size='small' style='margin-left:10x' @click='setStyle'>修改样式</el-button>
      <el-button type='primary' size='small' style='margin-left:10x' @click='getValue'>获取内容</el-button>
      <el-button type='primary' size='small' style='margin-left:10x' @click='setValue'>修改内容</el-button>

    </div>
    <code-mirror-editor
      ref='cmEditor'
      :cmTheme='cmTheme'
      :cmMode='cmMode'
      :autoFormatJson='autoFormatJson'
      :jsonIndentation='jsonIndentation'
    ></code-mirror-editor>
  </div>
</template>

<script>
// 使用时需要根据CodeMirrorEditor.vue的实际存放路径，调整from后面的组件路径，以便正确引用

import CodeMirrorEditor from '@/common/components/public/CodeMirrorEditor';

export default {

  components: {
    CodeMirrorEditor
  },

  data() {
    return {
      cmTheme: 'default', // codeMirror主题
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
      cmMode: 'application/json', //codeMirror模式
      jsonIndentation: 2, // json编辑模式下，json格式化缩进 支持字符或数字，最大不超过10，默认缩进2个空格
      autoFormatJson: true // json编辑模式下，输入框失去焦点时是否自动格式化，true 开启， false 关闭
    };
  },
  methods: {
    // 切换编辑模式事件处理函数
    onEditorModeChange(value) {
      switch (value) {
        case 'json':
          this.cmMode = 'application/json';
          break;
        case 'sql':
          this.cmMode = 'sql';
          break;
        case 'javascript':
          this.cmMode = 'javascript';
          break;
        case 'xml':
          this.cmMode = 'xml';
          break;
        case 'css':
          this.cmMode = 'css';
          break;
        case 'html':
          this.cmMode = 'htmlmixed';
          break;
        case 'yaml':
          this.cmMode = 'yaml';
          break;
        case 'markdown':
          this.cmMode = 'markdown';
          break;
        case 'python':
          this.cmMode = 'python';
          break;
        default:
          this.cmMode = 'application/json';
      }
    },

    // 修改样式（不推荐，建议参考<style>中的样式，提前配置好样式）

    setStyle() {
      let styleStr = 'position: absolute; top: 80px; left: 50px; right: 200px; bottom: 20px; padding: 2px; height: auto;';
      this.$refs.cmEditor.setStyle(styleStr);
    },
    //获取内容
    getValue() {
      let content = this.$refs.cmEditor.getValue();
      console.log(content);
    },

    //修改内容
    setValue() {
      let jsonValue = {
        name: 'laiyu',
        addr: '广东省深圳市',
        other: 'nothing',
        tel: '168888888',
        intro: [{item1: 'item1'}]
      };

      this.$refs.cmEditor.setValue(JSON.stringify(jsonValue));
    }

  }

};

</script>

<style>

.CodeMirror {

  position: absolute;

  top: 80px;

  left: 2px;

  right: 5px;

  bottom: 0px;

  padding: 2px;

  height: auto;

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

    margin: 30px 2px 0px 20px;

  }

} -->
<style>

.CodeMirror {
  position: absolute;
  top: 80px;
  left: 2px;
  right: 5px;
  bottom: 0px;
  padding: 2px;
  height: auto;
  overflow-y: auto;
}

.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

</style>
