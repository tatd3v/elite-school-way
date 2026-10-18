import { render } from 'preact'
import { App } from './App'
import './index.css'
import { checkVersionAndClearData } from './utils/auth'

// Check version and clear cached data if the app has been updated
checkVersionAndClearData()

render(<App />, document.getElementById('app'))
