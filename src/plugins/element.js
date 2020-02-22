import Vue from 'vue'
import {
  Button,
  Message,
  MessageBox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Table,
  TableColumn,
  Card,
  TabPane,
  Tabs,
  Tag,
  Form,
  FormItem,
  Input,
  Dialog,
  Row,
  Col,
  Pagination,
  Radio,
  RadioGroup,
  RadioButton,
  Loading,
  Select,
  Option,
  Checkbox,
  CheckboxGroup,
} from 'element-ui'

const plugins = {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Table,
  TableColumn,
  Card,
  TabPane,
  Tabs,
  Tag,
  Form,
  FormItem,
  Input,
  Dialog,
  Row,
  Col,
  Pagination,
  Radio,
  RadioGroup,
  RadioButton,
  Select,
  Option,
  Checkbox,
  CheckboxGroup,
}

for (const key in plugins) {
  Vue.use(plugins[key])
}

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$alert = MessageBox.alert
