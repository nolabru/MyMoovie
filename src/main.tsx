
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Aplica o modo escuro como padrão no carregamento inicial
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(<App />);
