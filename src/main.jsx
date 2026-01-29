import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { DataProvider } from './context/TemplatesVersionsContext.jsx';
import { UniversityProvider } from './context/UniversityContext.jsx';


// import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    //   <BrowserRouter>
    <UniversityProvider>
    <DataProvider>
        <AuthProvider>
            <SettingsProvider>
                <App />
            </SettingsProvider>
        </AuthProvider>
    </DataProvider>
    </UniversityProvider>
    //   </BrowserRouter>
)
