import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FiberProvider } from 'its-fine'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <FiberProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </FiberProvider>,
)
