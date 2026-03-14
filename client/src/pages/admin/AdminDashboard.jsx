import { useEffect, useState } from 'react'
import { productsAPI, blogsAPI, branchesAPI, requestsAPI, faqsAPI } from '../../services/api'
import {
  Package,
  FileText,
  MapPin,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    blogs: 0,
    branches: 0,
    requests: 0,
    faqs: 0,
    newRequests: 0,
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, blogsRes, branchesRes, requestsRes, faqsRes] = await Promise.allSettled([
        productsAPI.getAll({ limit: 1 }),
        blogsAPI.getAll({ limit: 1 }),
        branchesAPI.getAll(),
        requestsAPI.getAll({ limit: 5 }),
        faqsAPI.getAll(),
      ])

      const reqData = requestsRes.status === 'fulfilled' ? requestsRes.value.data : { requests: [], total: 0 }
      const newCount = reqData.requests?.filter(r => r.status === 'new').length || 0

      setStats({
        products: productsRes.status === 'fulfilled' ? productsRes.value.data.total || 0 : 0,
        blogs: blogsRes.status === 'fulfilled' ? blogsRes.value.data.total || 0 : 0,
        branches: branchesRes.status === 'fulfilled' ? branchesRes.value.data?.length || 0 : 0,
        requests: reqData.total || 0,
        faqs: faqsRes.status === 'fulfilled' ? faqsRes.value.data?.length || 0 : 0,
        newRequests: newCount,
      })
      setRecentRequests(reqData.requests || [])
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const cards = [
    { name: 'Товары', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { name: 'Статьи блога', value: stats.blogs, icon: FileText, color: 'bg-green-500' },
    { name: 'Филиалы', value: stats.branches, icon: MapPin, color: 'bg-purple-500' },
    { name: 'Всего заявок', value: stats.requests, icon: MessageSquare, color: 'bg-orange-500' },
    { name: 'Новых заявок', value: stats.newRequests, icon: AlertCircle, color: 'bg-red-500' },
    { name: 'Вопросы FAQ', value: stats.faqs, icon: HelpCircle, color: 'bg-indigo-500' },
  ]

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-gray-600 mt-1">Обзор управления контентом сайта</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.name} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={22} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Последние заявки</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentRequests.length > 0 ? (
            recentRequests.map((req) => (
              <div key={req._id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquare size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{req.name}</p>
                    <p className="text-sm text-gray-500">{req.phone} &middot; {req.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 ml-11 sm:ml-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                    {req.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">Заявок пока нет</div>
          )}
        </div>
      </div>
    </div>
  )
}
