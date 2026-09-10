import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/site.css'
import './styles/responsive.css'
import './styles/motion.css'
import './styles/console.css'
import './styles/console-responsive.css'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
