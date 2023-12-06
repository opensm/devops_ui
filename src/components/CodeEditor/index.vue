<template>
  <div class="in-coder-panel">
    <el-select v-model="cmMode" v-if="showChangemode" class="code-mode-select" @change="changeMode">
      <!-- <el-select v-model="cmMode" class="code-mode-select"> -->
      <el-option v-for="ssss in modes" :key="ssss.value" :label="ssss.label" :value="ssss.value" />
    </el-select>
    <codemirror
      ref="myCm"
      v-model="editorValue1"
      :options="cmOptions"
      @changes="onCmCodeChanges"
      @blur="onCmBlur"
      @keydown.native="onKeyDown"
      @mousedown.native="onMouseDown"
      @paste.native="OnPaste"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
// const CodeMirror = codemirror
import 'codemirror/lib/codemirror.css'
import 'codemirror/keymap/sublime'
import 'codemirror/keymap/vim'
import 'codemirror/keymap/emacs'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/python/python.js'
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
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/anyword-hint.js'
require('script-loader!jsonlint')
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

import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'

import 'codemirror/theme/3024-day.css'
import 'codemirror/theme/3024-night.css'
import 'codemirror/theme/abbott.css'
import 'codemirror/theme/abcdef.css'
import 'codemirror/theme/ambiance.css'
import 'codemirror/theme/ambiance-mobile.css'
import 'codemirror/theme/ayu-dark.css'
import 'codemirror/theme/ayu-mirage.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/theme/blackboard.css'
import 'codemirror/theme/cobalt.css'
import 'codemirror/theme/colorforth.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/duotone-dark.css'
import 'codemirror/theme/duotone-light.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/theme/elegant.css'
import 'codemirror/theme/erlang-dark.css'
import 'codemirror/theme/gruvbox-dark.css'
import 'codemirror/theme/hopscotch.css'
import 'codemirror/theme/icecoder.css'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/isotope.css'
import 'codemirror/theme/juejin.css'
import 'codemirror/theme/lesser-dark.css'
import 'codemirror/theme/liquibyte.css'
import 'codemirror/theme/lucario.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/theme/material-ocean.css'
import 'codemirror/theme/material-palenight.css'
import 'codemirror/theme/mbo.css'
import 'codemirror/theme/mdn-like.css'
import 'codemirror/theme/midnight.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/moxer.css'
import 'codemirror/theme/neat.css'
import 'codemirror/theme/neo.css'
import 'codemirror/theme/night.css'
import 'codemirror/theme/nord.css'
import 'codemirror/theme/oceanic-next.css'
import 'codemirror/theme/panda-syntax.css'
import 'codemirror/theme/paraiso-dark.css'
import 'codemirror/theme/paraiso-light.css'
import 'codemirror/theme/pastel-on-dark.css'
import 'codemirror/theme/railscasts.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/seti.css'
import 'codemirror/theme/shadowfox.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/ssms.css'
import 'codemirror/theme/the-matrix.css'
import 'codemirror/theme/tomorrow-night-bright.css'
import 'codemirror/theme/tomorrow-night-eighties.css'
import 'codemirror/theme/ttcn.css'
import 'codemirror/theme/twilight.css'
import 'codemirror/theme/vibrant-ink.css'
import 'codemirror/theme/xq-dark.css'
import 'codemirror/theme/xq-light.css'
import 'codemirror/theme/yeti.css'
import 'codemirror/theme/yonce.css'
import 'codemirror/theme/zenburn.css'

export default {
  name: 'CodeEditor',
  components: { codemirror },
  props: {
    cmTheme: {
      type: String,
      default: '3024-night'
    },
    showChangemode:{
      type: Boolean,
      default: true
    },
    editorValue: {
      type: String,
      default: 'yaml'
    },
    cmIndentUnit: {
      type: Number,
      default: 1
    },
    autoFormatJson: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editorValue1: '',
      // editorValue: 'select a from table1 where b = 1',
      cmMode: 'text/yaml',
      modes: [{
        value: 'java',
        label: 'Java'
      }, {
        value: 'css',
        label: 'CSS'
      }, {
        value: 'javascript',
        label: 'Javascript'
      }, {
        value: 'html',
        label: 'XML/HTML'
      }, {
        value: 'python',
        label: 'Python'
      }, {
        value: 'sh',
        label: 'Shell'
      }, {
        value: 'sql',
        label: 'SQL'
      }, {
        value: 'markdown',
        label: 'Markdown'
      }, {
        value: 'text/yaml',
        label: 'YAML'
      }],
      cmOptions: {
        theme: !this.cmTheme || this.cmTheme === 'default' ? 'default' : this.cmTheme, // 主题
        mode: !this.cmMode || this.cmMode === 'default' ? 'application/json' : this.cmMode, // 代码格式
        tabSize: 4, // tab的空格个数
        indentUnit: !this.cmIndentUnit ? 2 : this.cmIndentUnit, // 一个块（编辑语言中的含义）应缩进多少个空格
        autocorrect: true, // 自动更正
        spellcheck: true, // 拼写检查
        lint: true, // 检查格式
        lineNumbers: true, // 是否显示行数
        lineWrapping: true, // 是否自动换行
        styleActiveLine: true, // line选择是是否高亮
        keyMap: 'sublime', // sublime编辑器效果
        matchBrackets: true, // 括号匹配
        autoCloseBrackets: true, // 在键入时将自动关闭括号和引号
        matchTags: { bothTags: true }, // 将突出显示光标周围的标签
        foldGutter: true, // 可将对象折叠，与下面的gutters一起使用
        smartIndent: true, // 智能缩进
        completeSingle: true, // 当匹配只有一项的时候是否自动补全
        scrollbarStyle: 'overlay',
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter'
        ],
        highlightSelectionMatches: {
          minChars: 2,
          style: 'matchhighlight',
          showToken: true
        }
      },
      enableAutoFormatJson: this.autoFormatJson == null ? true : this.autoFormatJson // json编辑模式下，输入框失去焦点时是否自动格式化，true 开启， false 关闭
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
        this.editorValue1 = this.formatStrInJson(this.editorValue)
        this.$emit('update:editorValue', this.editorValue1)
      } else {
        this.editorValue1 = this.editorValue
        this.$emit('update:editorValue', this.editorValue1)
      }
    } catch (e) {
      console.log('初始化codemirror出错:' + e)
    }
  },
  methods: {
    changeMode(val) {
      // 修改编辑器的语法配置
      console.log(val)
      // this.coder.setOption('mode', `text/${val}`)
      // this.cmOptions.mode = `text/${val}`
      this.$set(this.cmOptions,'mode',val)
      // 获取修改后的语法
      // const label = this._getLanguage(val).label.toLowerCase()

      // // 允许父容器通过以下函数监听当前的语法值
      // this.$emit('language-change', label)
      this.resetLint()
    },
    // 获取当前语法类型
    _getLanguage(language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find((mode) => {
        // 所有的值都忽略大小写，方便比较
        const currentLanguage = language.toLowerCase()
        const currentLabel = mode.label.toLowerCase()
        const currentValue = mode.value.toLowerCase()

        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
        return currentLabel === currentLanguage || currentValue === currentLanguage
      })
    },
    onCmCodeChanges(cm) {
      this.editorValue1 = cm.getValue()
      this.$emit('update:editorValue', this.editorValue1)
      this.resetLint()
    },
    resetLint() {
      console.log(this.$refs.myCm.codemirror.getValue())
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
    // 格式化字符串为json格式字符串
    formatStrInJson(strValue) {
      return JSON.stringify(
        JSON.parse(strValue),
        null,
        this.cmIndentUnit
      )
    },
    // 失去焦点时处理函数
    onCmBlur(cm) {
      try {
        this.resetLint()
        const editorValue = cm.getValue()
        if (editorValue === null) {
          // throw new Error('数据未添加！')
          return
        }
        if (this.cmOptions.mode === 'application/json') {
          if (!this.enableAutoFormatJson) {
            return
          }
          this.editorValue1 = this.formatStrInJson(editorValue)
          this.$emit('update:editorValue', this.editorValue1)
        } else {
          this.editorValue1 = editorValue
          this.$emit('update:editorValue', this.editorValue1)
        }
      } catch (e) {
        // 啥也不做
      }
    },
    // 按下键盘事件处理函数
    onKeyDown(event) {
      const keyCode = event.keyCode || event.which || event.charCode
      const keyCombination =
          event.ctrlKey || event.altKey || event.metaKey
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs.myCm.codemirror.showHint({ completeSingle: false })
      }
    },
    // 按下鼠标时事件处理函数
    onMouseDown() {
      this.$refs.myCm.codemirror.closeHint()
    },
    // 黏贴事件处理函数
    OnPaste() {
      if (this.cmOptions.mode === 'application/json') {
        try {
          this.editorValue1 = this.formatStrInJson(this.editorValue1)
          this.$emit('update:editorValue', this.editorValue1)
        } catch (e) {
          // 啥都不做
        }
      }
    }
  }
}
</script>

<style scoped>
/* .in-coder-panel {
		flex-grow: 1;
		display: flex;
		position: relative;
	} */
	/* .CodeMirror {
		flex-grow: 1;
		z-index: 1;
		height: auto;
	} */

	/* .CodeMirror-code {
		line-height: 22px;
		font-size: 17px;
	} */

	.code-mode-select {
		position: absolute;
		z-index: 2;
		right: 10px;
		top: 10px;
		/* max-width: 130px; */
	}
</style>
