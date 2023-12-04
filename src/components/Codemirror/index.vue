<!-- eslint-disable vue/require-default-prop -->
<template>
  <div class="in-coder-panel">
    <textarea :ref="textareaRef" v-model="code" autofocus="true" />
    <el-select v-if="modeFlg" v-model="mode" class="code-mode-select" @change="changeMode">
      <el-option v-for="ssss in modes" :key="ssss.value" :label="ssss.label" :value="ssss.value" />
    </el-select>
  </div>
</template>

<script type="text/ecmascript-6">
// 正常引入实例
import _CodeMirror from 'codemirror'
const CodeMirror = _CodeMirror
// 核心样式
import 'codemirror/lib/codemirror.css'
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/cobalt.css'

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入

import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/r/r.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/vue/vue.js'

// 引入代码块主题  我这边是动态主题，所以引入的有点多
// 正常下面设置 theme: '3024-day' 就好了
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

// 尝试获取实例
// 如果全局组件直接使用就行
// const CodeMirror = _CodeMirror;

export default {
  name: 'InCoder',
  props: {
    modeFlg: Boolean,
    // 是否只读
    readOnlyFlg: Boolean,
    // 是否自动获取焦点
    autofocusFlg: Boolean,
    // 外部传入的内容，用于实现双向绑定
    value: String,
    // 外部传入的语法类型
    language: {
      type: String,
      default: null
    },
    textareaRef: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      CodeMirror: null,
      // 内部真实的内容
      code: '',
      // 默认的语法类型
      mode: 'yaml',
      // 编辑器实例
      coder: null,
      // 默认配置
      options: {
        // 缩进格式
        tabSize: 2,
        // 显示行号
        lineNumbers: true,
        line: true,
        // 代码块主题
        theme: 'material',
        // 是否只读
        readOnly: this.readOnlyFlg,
        lineWrapping: true,
        // 是否自动获取焦点
        autofocus: this.autofocusFlg,
        matchBrackets: true, // 括号匹配
        cursorHeight: 0.8, // 光标高度，默认是1
        smartIndent: true, // 智能缩进
        completeSingle: true // 当匹配只有一项的时候是否自动补全
      },
      // 支持切换的语法高亮类型，对应 JS 已经提前引入
      // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
      modes: [{
        value: 'x-java',
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
        value: 'x-objectivec',
        label: 'Objective-C'
      }, {
        value: 'x-python',
        label: 'Python'
      }, {
        value: 'x-rsrc',
        label: 'R'
      }, {
        value: 'x-sh',
        label: 'Shell'
      }, {
        value: 'x-sql',
        label: 'SQL'
      }, {
        value: 'x-swift',
        label: 'Swift'
      }, {
        value: 'x-vue',
        label: 'Vue'
      }, {
        value: 'markdown',
        label: 'Markdown'
      }]
    }
  },
  mounted() {
    // 初始化
    this._initialize()
  },
  methods: {
    // 重设代码块内容
    codemirrorRefresh(text) {
      text = text || ''
      this.coder.setValue(text)
      this.code = this.coder.getValue()
      this.coder.refresh()
    },
    // 初始化
    _initialize() {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置---this.$CodeMirror是全局引入的实例
      //   this.coder = this.$CodeMirror.fromTextArea(this.$refs[this.textareaRef], this.options)
      this.coder = CodeMirror.fromTextArea(this.$refs[this.textareaRef], this.options)
      // 编辑器赋值
      this.coder.setValue(this.value || this.code)
      // 支持双向绑定
      this.coder.on('change', (coder) => {
        this.code = coder.getValue()
        // 组件可以用input事件监听到值的变化
        if (this.$emit) {
          this.$emit('input', this.code)
        }
      })

      // 尝试从父容器获取语法类型
      if (this.language) {
        // 获取具体的语法类型对象
        const modeObj = this._getLanguage(this.language)

        // 判断父容器传入的语法是否被支持
        if (modeObj) {
          this.mode = modeObj.label
        }
      }
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
    // 更改模式
    changeMode(val) {
      // 修改编辑器的语法配置
      this.coder.setOption('mode', `text/${val}`)

      // 获取修改后的语法
      const label = this._getLanguage(val).label.toLowerCase()

      // 允许父容器通过以下函数监听当前的语法值
      this.$emit('language-change', label)
    },
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
    // 格式化字符串为json格式字符串
    formatStrInJson(strValue) {
      return JSON.stringify(
        JSON.parse(strValue),
        null,
        this.cmIndentUnit
      )
    },
    onCmCodeChanges(cm, changes) {
      this.code = cm.getValue()
      this.resetLint()
    },
    // 失去焦点时处理函数
    onCmBlur(cm, event) {
      try {
        const editorValue = cm.getValue()
        if (this.mode === 'application/json' && editorValue) {
          if (!this.enableAutoFormatJson) {
            return
          }
          this.code = this.formatStrInJson(editorValue)
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
    onMouseDown(event) {
      this.$refs.myCm.codemirror.closeHint()
    },
    // 黏贴事件处理函数
    OnPaste(event) {
      if (this.mode === 'application/json') {
        try {
          this.code = this.formatStrInJson(this.code)
        } catch (e) {
          // 啥都不做
        }
      }
    }
  }
}
</script>

<style>
	.in-coder-panel {
		flex-grow: 1;
		display: flex;
		position: relative;
	}
	.CodeMirror {
		flex-grow: 1;
		z-index: 1;
		height: auto;
	}

	.CodeMirror-code {
		line-height: 22px;
		font-size: 17px;
	}

	.code-mode-select {
		position: absolute;
		z-index: 2;
		right: 10px;
		top: 10px;
		max-width: 130px;
	}

</style>

