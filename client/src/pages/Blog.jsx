import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { blogsAPI } from '../services/api'

export default function Blog() {
  const { t, language } = useLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogsAPI.getAll({ published: 'true', limit: 20 })
      .then(res => setPosts(res.data?.blogs || []))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-gradient-to-r from-[#1e3d69] to-[#2d5a8f] py-8 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">{t.nav.blog}</h1>
          <p className="text-white/90 text-lg">
            {t.language === 'uz' && 'Yangiliklar, maqolalar va maslahatlar'}
            {t.language === 'ru' && 'Новости, статьи и советы'}
            {t.language === 'en' && 'News, articles and tips'}
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-6 md:py-12">
        {loading && <div className="text-center py-12 text-gray-400">Yuklanmoqda...</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {posts.map((post) => (
            <Link key={post._id} to={`/blog/${post._id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div className="h-48 bg-gradient-to-br from-[#1e3d69] to-[#3563e9] relative overflow-hidden">
                  {post.image && (
                    <img src={post.image} alt={post.title?.[language] || post.title?.uz} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <span className="inline-block bg-[#3563e9]/10 text-[#3563e9] px-3 py-1 rounded-full text-xs font-medium mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-base md:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3563e9] transition-colors">
                    {post.title?.[language] || post.title?.uz}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt?.[language] || post.excerpt?.uz}
                  </p>
                  <div className="flex items-center gap-2 text-[#3563e9] font-semibold group-hover:gap-3 transition-all">
                    {language === 'uz' ? 'Batafsil' : language === 'ru' ? 'Подробнее' : 'Read more'}
                    <ArrowRight size={18} />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
