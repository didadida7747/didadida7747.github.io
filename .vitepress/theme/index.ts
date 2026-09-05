import DefaultTheme from 'vitepress/theme'
import QuizGame from './QuizGame.vue'
import WrongBook from './WrongBook.vue'
import TaskBoard from './TaskBoard.vue'
import KnowledgePoints from './KnowledgePoints.vue'
import MyLayout from './MyLayout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    app.component('QuizGame', QuizGame)
    app.component('WrongBook', WrongBook)
    app.component('TaskBoard', TaskBoard)
    app.component('KnowledgePoints', KnowledgePoints)
  }
}
