<script>
import FillInInput from './FillInInput'
import { fillRegEx } from '@/utils/constant'
export default {
  name: 'FillIn',
  components: { FillInInput },
  props: {
    problem: {
      type: Object,
      default: () => Object.create(null),
    },
  },
  methods: {
    updateAnswer(i) {
      const vm = this
      return value => {
        vm.problem.answer[i] = value
        vm.$emit('updateAnswer', vm.problem.answer)
      }
    },
  },
  render(createElement) {
    const h = createElement
    const strList = this.problem.description.split(fillRegEx)
    const elements = [h('span', { style: { fontSize: '1.2em' } }, [`【${this.problem.maxScore}分】`])]
    if (this.problem.score !== undefined) {
      elements.unshift(h('el-tag', [`得分：${this.problem.score}`]))
    }
    for (let i = 0; i < strList.length; i++) {
      const textEle = h('span', { style: { fontSize: '1.2em' } }, [strList[i]])
      elements.push(textEle)
      if (i < strList.length - 1) {
        const inputEle = h(FillInInput, {
          props: {
            answer: this.problem.answer[i],
          },
          on: {
            updateAnswer: this.updateAnswer(i),
          },
          key: Math.random(),
        })
        elements.push(inputEle)
      }
    }
    return createElement('div', null, elements)
  },
}
</script>
