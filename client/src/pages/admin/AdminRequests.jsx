import { useEffect, useState } from 'react'
import { requestsAPI } from '../../services/api'
import { Trash2, X, Clock, CheckCircle, XCircle, Loader, Eye, ChevronDown } from 'lucide-react'

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showDetail, setShowDetail] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => { fetchRequests() }, [page, statusFilter, typeFilter])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      if (typeFilter) params.type = typeFilter
      const res = await requestsAPI.getAll(params)
      setRequests(res.data.requests || [])
      setTotal(res.data.total || 0)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    try {
      await requestsAPI.update(id, { status })
      fetchRequests()
      if (showDetail?._id === id) setShowDetail(prev => ({ ...prev, status }))
    } catch (err) { alert('Error updating status') }
  }

  const saveNotes = async () => {
    if (!showDetail) return
    try {
      await requestsAPI.update(showDetail._id, { adminNotes })
      fetchRequests()
      setShowDetail(prev => ({ ...prev, adminNotes }))
    } catch (err) { alert('Error saving notes') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить эту заявку?')) return
    try {
      await requestsAPI.delete(id)
      fetchRequests()
      if (showDetail?._id === id) setShowDetail(null)
    } catch (err) { alert('Error') }
  }

  const openDetail = (req) => {
    setShowDetail(req)
    setAdminNotes(req.adminNotes || '')
  }

  const totalPages = Math.ceil(total / 15)

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusIcons = {
    new: Clock,
    'in-progress': Loader,
    completed: CheckCircle,
    cancelled: XCircle,
  }

  const typeLabels = {
    consultation: { label: 'Консультация', color: 'bg-blue-100 text-blue-700' },
    'custom-order': { label: 'Спец. заказ', color: 'bg-purple-100 text-purple-700' },
    calculator: { label: 'Калькулятор', color: 'bg-orange-100 text-orange-700' },
    contact: { label: 'Обратная связь', color: 'bg-gray-100 text-gray-700' },
  }

  const statusLabels = {
    new: 'Новая',
    'in-progress': 'В работе',
    completed: 'Выполнена',
    cancelled: 'Отменена',
  }

  const pageLabels = {
    home: 'Главная', catalog: 'Каталог', 'product-detail': 'Товар', 'custom-order': 'Спец. заказ',
    about: 'О нас', branches: 'Филиалы', blog: 'Блог', calculator: 'Калькулятор',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Заявки</h1>
          <p className="text-gray-600 text-sm">{total} заявок всего</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Все статусы</option>
          <option value="new">Новая</option>
          <option value="in-progress">В работе</option>
          <option value="completed">Выполнена</option>
          <option value="cancelled">Отменена</option>
        </select>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Все типы</option>
          <option value="consultation">Консультация</option>
          <option value="custom-order">Спец. заказ</option>
          <option value="calculator">Калькулятор</option>
          <option value="contact">Обратная связь</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-3 font-medium text-gray-600 whitespace-nowrap">#</th>
                <th className="text-left p-3 font-medium text-gray-600 whitespace-nowrap">Имя / Телефон</th>
                <th className="text-left p-3 font-medium text-gray-600 whitespace-nowrap">Тип</th>
                <th className="text-left p-3 font-medium text-gray-600 whitespace-nowrap">Товар</th>
                <th className="text-left p-3 font-medium text-gray-600 whitespace-nowrap">Страница</th>
                <th className="text-left p-3 font-medium text-gray-600 whitespace-nowrap">Статус</th>
                <th className="text-left p-3 font-medium text-gray-600 whitespace-nowrap">Дата</th>
                <th className="text-right p-3 font-medium text-gray-600 whitespace-nowrap">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Загрузка...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Заявок нет</td></tr>
              ) : requests.map((req, idx) => {
                const typeInfo = typeLabels[req.type] || { label: req.type, color: 'bg-gray-100 text-gray-600' }
                return (
                  <tr key={req._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDetail(req)}>
                    <td className="p-3 text-gray-400 text-xs">{(page - 1) * 15 + idx + 1}</td>
                    <td className="p-3">
                      <p className="font-semibold text-gray-900 text-sm">{req.name || <span className="text-gray-400 italic">—</span>}</p>
                      <a href={`tel:${req.phone}`} onClick={e => e.stopPropagation()} className="text-[#3563e9] text-xs hover:underline">{req.phone || '—'}</a>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
                    </td>
                    <td className="p-3 max-w-[180px]">
                      {req.productModel ? (
                        <div>
                          <p className="text-gray-800 text-xs font-medium line-clamp-1">{req.productModel}</p>
                          {req.productQuantity && <p className="text-gray-400 text-xs">Кол-во: {req.productQuantity}</p>}
                        </div>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="p-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{pageLabels[req.page] || req.page || '—'}</span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[req.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[req.status] || req.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString('ru-RU')}<br />
                      <span className="text-gray-300">{new Date(req.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openDetail(req)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600" title="Просмотр">
                          <Eye size={14} />
                        </button>
                        <select
                          value={req.status}
                          onChange={e => updateStatus(req._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-white"
                        >
                          <option value="new">Новая</option>
                          <option value="in-progress">В работе</option>
                          <option value="completed">Выполнена</option>
                          <option value="cancelled">Отменена</option>
                        </select>
                        <button onClick={() => handleDelete(req._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Стр. {page} из {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Назад</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Вперёд</button>
            </div>
          </div>
        )}
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl my-4">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Детали заявки</h2>
                <p className="text-xs text-gray-400">{new Date(showDetail.createdAt).toLocaleString('ru-RU')}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">

              {/* Type + Status badges */}
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${(typeLabels[showDetail.type] || { color: 'bg-gray-100 text-gray-600' }).color}`}>
                  {(typeLabels[showDetail.type] || { label: showDetail.type }).label}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[showDetail.status]}`}>
                  {statusLabels[showDetail.status] || showDetail.status}
                </span>
                {showDetail.page && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {pageLabels[showDetail.page] || showDetail.page}
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Имя</p>
                  <p className="font-semibold text-gray-900 text-sm">{showDetail.name || <span className="italic text-gray-400">Не указано</span>}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Телефон</p>
                  <a href={`tel:${showDetail.phone}`} className="font-semibold text-[#3563e9] text-sm hover:underline">{showDetail.phone || '—'}</a>
                </div>
              </div>

              {/* Product Info */}
              {(showDetail.productModel || showDetail.productQuantity) && (
                <div className="bg-blue-50 rounded-xl p-4">
                  {showDetail.productModel && (
                    <div className="mb-2">
                      <p className="text-xs text-blue-400 mb-0.5">Товар / Модель</p>
                      <p className="font-semibold text-blue-900 text-sm">{showDetail.productModel}</p>
                    </div>
                  )}
                  {showDetail.productQuantity && (
                    <div>
                      <p className="text-xs text-blue-400 mb-0.5">Количество</p>
                      <p className="font-semibold text-blue-900 text-sm">{showDetail.productQuantity}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Comment */}
              {showDetail.comment && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Комментарий</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{showDetail.comment}</p>
                </div>
              )}

              {/* Image */}
              {showDetail.image && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Прикреплённое изображение</p>
                  <a href={showDetail.image} target="_blank" rel="noopener noreferrer">
                    <img src={showDetail.image} alt="request" className="w-full max-h-56 object-contain rounded-xl border border-gray-200" />
                  </a>
                </div>
              )}

              {/* Change Status */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Изменить статус</p>
                <div className="flex flex-wrap gap-2">
                  {[['new', 'Новая'], ['in-progress', 'В работе'], ['completed', 'Выполнена'], ['cancelled', 'Отменена']].map(([s, label]) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(showDetail._id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${showDetail.status === s
                        ? statusColors[s] + ' border-transparent'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Заметка администратора</p>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Добавьте внутреннюю заметку..."
                />
                <button onClick={saveNotes} className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium">Сохранить</button>
              </div>

              <div className="flex justify-between pt-2 border-t">
                <button
                  onClick={() => handleDelete(showDetail._id)}
                  className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 size={14} /> Удалить
                </button>
                <button onClick={() => setShowDetail(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
