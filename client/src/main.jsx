import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import AOS from 'aos'
import 'aos/dist/aos.css'

function Root() {
  useEffect(() => {
    // Disable AOS on admin pages to prevent input issues
    const isAdminPage = window.location.pathname.startsWith('/admin')

    if (!isAdminPage) {
      AOS.init({
        duration: 700,
        once: true,
        offset: 60,
        easing: 'ease-out-cubic',
        delay: 0,
        anchorPlacement: 'top-bottom',
      })
    }

    // Refresh AOS on route changes (only for non-admin pages)
    const handleRouteChange = () => {
      const isAdmin = window.location.pathname.startsWith('/admin')
      if (!isAdmin) {
        setTimeout(() => AOS.refresh(), 100)
      }
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <CartProvider>
        <Root />
      </CartProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
