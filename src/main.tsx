
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster position="top-right" richColors duration={3000} />
  </>
);
