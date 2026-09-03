import DefaultTheme from 'vitepress/theme'
import QuizGame from './QuizGame.vue'
import MyLayout from './MyLayout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    app.component('QuizGame', QuizGame)
  }
}
