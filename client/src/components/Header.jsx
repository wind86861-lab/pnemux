import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Phone, Search, Facebook, Instagram, Youtube, Globe, Menu, X, ShoppingCart, Send } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import logo from '../image/logo.jpg'
import { settingsAPI } from '../services/api'

export default function Header() {
  const { toggleLanguage, t } = useLanguage()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    settingsAPI.getAll().then(res => setSettings(res.data || {})).catch(() => { })
  }, [])

  return (
    <header className="bg-white shadow-sm">
      <div className="bg-[#fafafa] border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 md:gap-3">
              <img src={settings.logoImage || logo} alt="PneuMax Logo" className="h-[50px] sm:h-[60px] md:h-[70px] lg:h-[80px] w-auto" />
              <span className="text-[#1e3d69] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">{settings.logoText || 'PNEUMAX'}</span>
            </Link>

            <div className="hidden lg:flex items-center gap-3 w-[280px]">
              <Search className="text-[#1e3d69]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
                    setSearchQuery('')
                  }
                }}
                placeholder={t.header.search}
                className="flex-1 bg-transparent border-b border-gray-300 pb-1 text-[#1e3d69] placeholder:text-[#6b7280] focus:outline-none text-sm"
              />
            </div>

            <div className="hidden md:flex items-center gap-3 lg:gap-6">
              <div className="hidden lg:flex items-center gap-4">
                {[
                  { href: settings.facebook, Icon: Facebook },
                  { href: settings.instagram, Icon: Instagram },
                  { href: settings.telegram, Icon: Send },
                  { href: settings.youtube, Icon: Youtube },
                ].map(({ href, Icon }, i) => (
                  <a
                    key={i}
                    href={href || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1e3d69] hover:text-[#3563e9] transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Phone size={18} className="text-[#1e3d69]" />
                <span className="text-[#1e3d69] font-medium text-xs lg:text-sm">{settings.phone1 || t.header.phone}</span>
              </div>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Globe size={14} className="text-[#1e3d69] md:w-4 md:h-4" />
                <span className="text-[#1e3d69] font-medium text-xs md:text-sm">{t.header.language}</span>
              </button>
              <Link to="/cart" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingCart size={22} className="text-[#1e3d69]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#3563e9] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#1e3d69] p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <nav className="bg-[#1e3d69]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
          <ul className="hidden md:flex items-center justify-between w-full text-white">
            {[
              { to: '/', label: t.nav.home, exact: true },
              { to: '/catalog', label: t.nav.catalog },
              { to: '/calculator', label: t.nav.calculator },
              { to: '/custom-order', label: t.nav.customOrder },
              { to: '/branches', label: t.nav.branches },
              { to: '/blog', label: t.nav.blog },
              { to: '/about', label: t.nav.about },
            ].map(({ to, label, exact }) => {
              const isActive = exact
                ? location.pathname === to
                : location.pathname.startsWith(to)
              return (
                <li key={to} className="flex-1 text-center">
                  <Link
                    to={to}
                    className={`relative block py-4 font-medium text-base lg:text-lg whitespace-nowrap transition-all duration-200 group ${isActive ? 'text-[#42ade2]' : 'text-white hover:text-[#42ade2]'
                      }`}
                  >
                    {label}
                    <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#42ade2] rounded-t transition-transform duration-200 origin-center ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1e3d69] border-t border-white/10">
          <div className="px-4 py-2">
            {/* Search bar */}
            <div className="flex items-center gap-2 py-3 border-b border-white/10">
              <Search className="text-white" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
                    setSearchQuery('')
                    setMobileMenuOpen(false)
                  }
                }}
                placeholder={t.header.search}
                className="flex-1 bg-transparent border-b border-white/30 pb-1 text-white placeholder:text-white/60 focus:outline-none text-sm"
              />
            </div>
            {/* Navigation links */}
            <Link to="/" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block py-3 text-white hover:text-[#42ade2] transition-colors font-medium border-b border-white/10">{t.nav.home}</Link>
            <Link to="/catalog" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block py-3 text-white hover:text-[#42ade2] transition-colors font-medium border-b border-white/10">{t.nav.catalog}</Link>
            <Link to="/calculator" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block py-3 text-white hover:text-[#42ade2] transition-colors font-medium border-b border-white/10">{t.nav.calculator}</Link>
            <Link to="/custom-order" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block py-3 text-white hover:text-[#42ade2] transition-colors font-medium border-b border-white/10">{t.nav.customOrder}</Link>
            <Link to="/branches" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block py-3 text-white hover:text-[#42ade2] transition-colors font-medium border-b border-white/10">{t.nav.branches}</Link>
            <Link to="/blog" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block py-3 text-white hover:text-[#42ade2] transition-colors font-medium border-b border-white/10">{t.nav.blog}</Link>
            <Link to="/about" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block py-3 text-white hover:text-[#42ade2] transition-colors font-medium border-b border-white/10">{t.nav.about}</Link>
            {/* Cart and phone */}
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <Link
                to="/cart"
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-2 text-white hover:text-[#42ade2] transition-colors font-medium"
              >
                <ShoppingCart size={20} />
                <span>{t.nav.cart || 'Savat'}</span>
                {totalItems > 0 && (
                  <span className="bg-[#42ade2] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
              <a href={`tel:${settings.phone1 || t.header.phone}`} className="flex items-center gap-2 text-white hover:text-[#42ade2] transition-colors font-medium">
                <Phone size={20} />
                <span className="text-sm">{settings.phone1 || t.header.phone}</span>
              </a>
            </div>
            {/* Social links */}
            <div className="flex items-center justify-center gap-4 py-3 border-b border-white/10">
              {[
                { href: settings.facebook, Icon: Facebook },
                { href: settings.instagram, Icon: Instagram },
                { href: settings.telegram, Icon: Send },
                { href: settings.youtube, Icon: Youtube },
              ].map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#42ade2] transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center gap-2 py-3 text-white hover:text-[#42ade2] transition-colors font-medium"
            >
              <Globe size={18} />
              <span>{t.header.language}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
