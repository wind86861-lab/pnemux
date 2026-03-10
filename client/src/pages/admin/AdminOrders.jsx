import { useState, useEffect } from 'react'
import { ordersAPI } from '../../services/api'
import { ShoppingCart, Trash2, ChevronDown, ChevronUp, Phone, User, MessageSquare } from 'lucide-react'

const STATUS_LABELS = {
  new: { label: 'Новый', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'В обработке', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Выполнен', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Отменён', color: 'bg-red-100 text-red-700' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (statusFilter) params.status = statusFilter
      const res = await ordersAPI.getAll(params)
      setOrders(res.data.orders || [])
      setTotal(res.data.total || 0)
    } catch { }
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const handleStatusChange = async (id, status) => {
    try {
      await ordersAPI.update(id, { status })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
    } catch { alert('Ошибка обновления статуса') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить этот заказ?')) return
    try { await ordersAPI.delete(id); fetchOrders() }
    catch { alert('Ошибка удаления') }
  }

  const totalPages = Math.ceil(total / 20)
  const fmt = (n) => Number(n).toLocaleString('ru-RU')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
          <p className="text-gray-600 text-sm">{total} заказов</p>
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все статусы</option>
          {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">Загрузка...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <ShoppingCart size={48} className="text-gray-200" />
            <p>Заказов нет</p>
          </div>
        ) : orders.map(order => {
          const isExpanded = expandedId === order._id
          const status = STATUS_LABELS[order.status] || STATUS_LABELS.new
          return (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header row */}
              <div className="flex items-center gap-4 p-4">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={14} className="text-gray-400" />
                    <span className="truncate">{order.customerName || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={14} className="text-gray-400" />
                    <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">{order.customerPhone}</a>
                  </div>
                  <div className="font-bold text-[#1e3d69]">
                    {fmt(order.totalPrice)} so'm
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className={`text-xs px-2 py-1.5 rounded-lg font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${status.color}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                  <button onClick={() => handleDelete(order._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-4 space-y-3">
                  <div className="space-y-2">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{fmt(item.price)} so'm × {item.quantity}</p>
                        </div>
                        <p className="font-bold text-[#1e3d69] text-sm flex-shrink-0">{fmt(item.price * item.quantity)} so'm</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {order.comment && (
                        <>
                          <MessageSquare size={14} />
                          <span>{order.comment}</span>
                        </>
                      )}
                    </div>
                    <p className="font-bold text-[#1e3d69]">Итого: {fmt(order.totalPrice)} so'm</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Стр. {page} из {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Назад</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Вперёд</button>
          </div>
        </div>
      )}
    </div>
  )
}
