import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QuestionProvider } from './context/QuestionContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QuestionProvider>
      <App />
    </QuestionProvider>
  </React.StrictMode>,
)
