<template>
  <div>
    <div>
      <el-select
        v-if="showLanguage"
        :value="language"
        placeholder="请选择编程语言"
        @change="onLangChange"
        :disabled="disableLanguage"
        size="mini"
      >
        <el-option v-for="item in languages" :key="item" :value="item"> </el-option>
      </el-select>
    </div>
    <codemirror ref="myEditor" :value="value" :options="options" style:="margin-top: 10px" @change="onEditorCodeChange"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite'
// theme
import 'codemirror/theme/material.css'
import 'codemirror/theme/solarized.css'

// mode
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/indent-fold.js'

export default {
  name: 'CodeMirror',
  components: {
    codemirror,
  },
  model: {
    prop: 'value',
    event: 'updateValue',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    languages: {
      type: Array,
      default: () => ['c', 'cpp', 'java', 'py'],
    },
    language: {
      type: String,
      default: 'c',
    },
    theme: {
      type: String,
      default: 'material',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    disableLanguage: {
      type: Boolean,
      default: false,
    },
    showLanguage: {
      type: Boolean,
      default: true,
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      options: {
        // codemirror options
        tabSize: 4,
        mode: 'text/x-csrc',
        theme: 'material',
        lineNumbers: true,
        lang: 'c',
        line: true,
        // 代码折叠
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        // 选中文本自动高亮，及高亮方式
        styleSelectedText: true,
        readOnly: false,
        lineWrapping: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
      },
      mode: {
        c: 'text/x-csrc',
        cpp: 'text/x-csrc',
        java: 'text/x-java',
        py: 'text/x-python',
      },
      themes: [
        { label: 'Solarized Light', value: 'solarized' },
        { label: 'Material', value: 'material' },
      ],
    }
  },
  computed: {
    editor() {
      return this.$refs.myEditor.editor
    },
  },
  mounted() {
    if (this.autoFocus) {
      this.editor.focus()
    }
    if (this.readOnly) {
      this.editor.setOption('readOnly', 'nocursor')
    }
    this.editor.setOption('theme', this.theme)
  },
  methods: {
    onEditorCodeChange(value) {
      this.$emit('update:value', value)
      this.$emit('updateValue', value)
    },
    onLangChange(value) {
      this.editor.setOption('mode', this.mode[value])
      this.$emit('update:language', value)
    },
    onThemeChange(value) {
      this.editor.setOption('theme', value)
    },
  },
}
</script>

<style>
.CodeMirror {
  margin-top: 10px;
  height: auto !important;
}
.CodeMirror-scroll {
  min-height: 100px;
  max-height: 800px;
}
</style>
