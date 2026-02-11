import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { UniversityProvider } from './context/UniversityContext.jsx';


// import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    //   <BrowserRouter>
    <UniversityProvider>
        <AuthProvider>
            <SettingsProvider>
                <App />
            </SettingsProvider>
        </AuthProvider>
    </UniversityProvider>
    //   </BrowserRouter>
)
