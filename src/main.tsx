import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
       <React.Fragment>
        <Toaster
          position="top-center"
        />
      </React.Fragment>
    </BrowserRouter>
  </StrictMode>,
)
