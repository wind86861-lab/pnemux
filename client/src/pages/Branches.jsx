import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { MapPin, Phone } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { branchesAPI, requestsAPI } from '../services/api'

export default function Branches() {
  const { language } = useLanguage()
  const [branches, setBranches] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    branchesAPI.getAll().then(res => setBranches(res.data || [])).catch(() => { })
  }, [])

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.querySelector(window.location.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [branches])

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone) return
    setSubmitting(true)
    try {
      await requestsAPI.create({ name, phone, type: 'consultation', page: 'branches' })
      setSubmitted(true); setName(''); setPhone('')
    } catch { }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-6 md:py-12">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-[#1e3d69] mb-6 md:mb-12 uppercase">
          {language === 'uz' && 'FILIALLAR'}
          {language === 'ru' && 'ФИЛИАЛЫ'}
          {language === 'en' && 'BRANCHES'}
        </h1>

        <div className="space-y-10 md:space-y-16">
          {branches.map((branch) => (
            <div key={branch._id} id={`branch-${branch._id}`} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-gray-100 rounded-2xl h-[220px] md:h-[350px] overflow-hidden">
                  {branch.image
                    ? <img src={branch.image} alt={branch.title?.[language]} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-white/50 rounded-lg"></div>
                    </div>
                  }
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg md:text-2xl font-bold text-[#1e3d69]">{branch.title[language]}</h2>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-900">{branch.company}</p>
                    {branch.inn && <p className="text-gray-600">{branch.inn}</p>}
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-gray-700">
                      {language === 'uz' && 'Direktor:'}
                      {language === 'ru' && 'Директор:'}
                      {language === 'en' && 'Director:'}
                    </p>
                    <p className="text-gray-900">{branch.director[language]}</p>
                    <p className="text-sm text-gray-600">
                      {branch.founded} {language === 'uz' ? 'yidan beri faoliyat yuritmoqda' : language === 'ru' ? 'года ведет деятельность' : 'year of operation'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin size={18} className="text-[#3563e9] mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-700">
                          {language === 'uz' && 'Aloqa uchun:'}
                          {language === 'ru' && 'Для связи:'}
                          {language === 'en' && 'Contact:'}
                        </p>
                        <p className="text-gray-900">{branch.address[language]}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone size={18} className="text-[#10b981] mt-1 shrink-0" />
                      <div className="space-y-1">
                        {branch.phones.map((phone, idx) => (
                          <p key={idx} className="text-gray-900">{phone}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-full h-[300px] bg-gray-200 rounded-xl overflow-hidden">
                  <iframe
                    src={branch.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <p>{branch.fullAddress}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-16 bg-gray-50 rounded-2xl p-6 md:p-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#1e3d69] mb-2">
            {language === 'uz' && 'Hamkorlik konsultatsiya oling'}
            {language === 'ru' && 'Получить консультацию по партнерству'}
            {language === 'en' && 'Get partnership consultation'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'uz' && 'Kompaniya haqida ko\'proq ma\'lumot olish uchun ariza qoldiring'}
            {language === 'ru' && 'Оставьте заявку, чтобы узнать больше о компании'}
            {language === 'en' && 'Leave a request to learn more about the company'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'uz' ? 'Ismingizni kiriting' : language === 'ru' ? 'Введите имя' : 'Enter name'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base focus:outline-none focus:border-[#3563e9]"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
              pattern="^(\+998[0-9]{9}|[0-9]{9})$"
              placeholder="+998901234567"
              title="Enter valid phone: +998XXXXXXXXX or XXXXXXXXX"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm md:text-base focus:outline-none focus:border-[#3563e9]"
            />
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl py-3 text-center text-green-700 font-semibold text-sm md:text-base">
                {language === 'uz' ? 'Arizangiz qabul qilindi!' : language === 'ru' ? 'Заявка принята!' : 'Request received!'}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#10b981] text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-[#059669] transition-colors disabled:opacity-60"
            >
              {language === 'uz' && 'Konsultatsiya olish'}
              {language === 'ru' && 'Получить консультацию'}
              {language === 'en' && 'Get consultation'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
