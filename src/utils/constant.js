export const STORAGE_PREFIX = 'oj-storage'

export const PERMISSION_ENUM = {
  ADMIN: 0,
  TEACHER: 1,
  ASSISTANT: 2,
  STUDENT: 3
}

export const PERMISSION_TYPE = {
  0: '管理员',
  1: '教师',
  2: '助教',
  3: '学生'
}

export const JUDGE_STATE = {
  0: 'WATTING',
  1: 'RUNNING',
  2: 'ACCEPTED',
  3: 'RUNTIME_ERROR',
  4: 'TIME_LIMIT_EXCEEDED',
  5: 'MEMORY_LIMIT_EXCEEDED',
  6: 'COMPILE_ERROR',
  7: 'PRESENTATION_ERROR',
  8: 'SYSTEM_ERROR'
}

export const CONTEST_STATE = {
  0: '未开始',
  1: '进行',
  2: '结束'
}

export const PROBLEM_TYPE = {
  '0': 'coding',
  '1': 'choice',
  '2': 'fillIn',
  '3': 'QA',
  '4': 'codeFill'
}

export const PROBLEM_TYPE_CN = {
  '0': '编程题',
  '1': '选择题',
  '2': '填空题',
  '3': '问答题',
  '4': '代码补全题'
}

export const PROBLEM_NAME2TYPE = {
  编程题: 0,
  选择题: 1,
  填空题: 2,
  问答题: 3,
  代码补全题: 4
}

export const PROBLEM_ENUM = {
  CODING: 0,
  CHOICE: 1,
  FILLIN: 2,
  QA: 3,
  CODEFILL: 4
}

export const TYPE_LIST = [0,1,2,3,4]

export const fillRegEx = /\[=\]/g
