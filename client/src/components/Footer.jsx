import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Facebook, Instagram, Send, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { settingsAPI } from '../services/api'
import logo from '../image/logo.jpg'

export default function Footer() {
  const { t, language } = useLanguage()
  const [settings, setSettings] = useState({})

  useEffect(() => {
    settingsAPI.getAll().then(res => setSettings(res.data || {})).catch(() => { })
  }, [])

  return (
    <footer className="bg-[#1a2556] text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 pt-12 md:pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10 md:mb-14">

          {/* Column 1 — Logo + description + socials */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 mb-5">
              <img
                src={settings.logoImage || logo}
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="font-bold text-xl tracking-wide">
                <span className="bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent">{(settings.logoText || 'PneuMax').slice(0, 4)}</span><span className="text-white">{(settings.logoText || 'PneuMax').slice(4)}</span>
              </span>
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed text-sm">
              {language === 'uz'
                ? 'Ishonchli sanoat ehtiyot qismlari, qulay narxlarda va barqaror yetkazib berish tizimi.'
                : language === 'ru'
                  ? 'Надежные промышленные запчасти, доступные цены и стабильная система доставки.'
                  : 'Reliable industrial spare parts, affordable prices and stable delivery system.'}
            </p>
            <div className="flex gap-3">
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
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/25 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Company links */}
          <div>
            <h4 className="font-semibold text-[#10b981] text-base mb-5 uppercase tracking-wide">{t.footer.company}</h4>
            <ul className="space-y-3">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-white/65 hover:text-white transition-colors text-sm">{t.footer.about}</Link></li>
              <li><Link to="/catalog" onClick={() => window.scrollTo(0, 0)} className="text-white/65 hover:text-white transition-colors text-sm">{t.footer.services}</Link></li>
              <li><Link to="/branches" onClick={() => window.scrollTo(0, 0)} className="text-white/65 hover:text-white transition-colors text-sm">{t.footer.branches}</Link></li>
              <li><Link to="/custom-order" onClick={() => window.scrollTo(0, 0)} className="text-white/65 hover:text-white transition-colors text-sm">{t.footer.partnership}</Link></li>
            </ul>
          </div>

          {/* Column 3 — Information links */}
          <div>
            <h4 className="font-semibold text-[#10b981] text-base mb-5 uppercase tracking-wide">{t.footer.information}</h4>
            <ul className="space-y-3">
              <li><Link to="/branches" onClick={() => window.scrollTo(0, 0)} className="text-white/65 hover:text-white transition-colors text-sm">{t.footer.contact}</Link></li>
              <li><Link to="/calculator" onClick={() => window.scrollTo(0, 0)} className="text-white/65 hover:text-white transition-colors text-sm">{t.footer.faq}</Link></li>
              <li><Link to="/blog" onClick={() => window.scrollTo(0, 0)} className="text-white/65 hover:text-white transition-colors text-sm">{t.footer.news}</Link></li>
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-white/65 hover:text-white transition-colors text-sm">{t.footer.vacancies}</Link></li>
            </ul>
          </div>

          {/* Column 4 — Contact info */}
          <div>
            <h4 className="font-semibold text-[#10b981] text-base mb-5 uppercase tracking-wide">{t.footer.contactTitle}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-white/50" />
                <span className="text-white/70 text-sm leading-relaxed">
                  {settings[`address_${language}`] || settings.address_uz || t.footer.location}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-white/50" />
                <a href={`tel:${settings.phone1 || ''}`} className="text-white/70 hover:text-white text-sm transition-colors">
                  {settings.phone1 || '+998 99 999-00-00'}
                </a>
              </li>
              {settings.phone2 && (
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-white/50" />
                  <a href={`tel:${settings.phone2}`} className="text-white/70 hover:text-white text-sm transition-colors">
                    {settings.phone2}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-white/50" />
                <a href={`mailto:${settings.email || 'info@pneumax.uz'}`} className="text-white/70 hover:text-white text-sm transition-colors">
                  {settings.email || 'info@pneumax.uz'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <p className="text-white/50 text-xs sm:text-sm">
            {t.footer.copyright}
            {' '}
            <a href="https://supersite.uz/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors font-medium">
              Supersite.uz
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
