import { useEffect, useState } from 'react'
import { faqsAPI } from '../../services/api'
import { Plus, Pencil, Trash2, X, GripVertical } from 'lucide-react'

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    question: { uz: '', ru: '', en: '' },
    answer: { uz: '', ru: '', en: '' },
    order: 0,
    isActive: true,
  })

  useEffect(() => { fetchFaqs() }, [])

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const res = await faqsAPI.getAll()
      setFaqs(res.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ question: { uz: '', ru: '', en: '' }, answer: { uz: '', ru: '', en: '' }, order: faqs.length, isActive: true })
    setShowModal(true)
  }

  const openEdit = (faq) => {
    setEditing(faq._id)
    setForm({
      question: faq.question || { uz: '', ru: '', en: '' },
      answer: faq.answer || { uz: '', ru: '', en: '' },
      order: faq.order || 0,
      isActive: faq.isActive !== false,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { ...form, order: Number(form.order) }
      if (editing) await faqsAPI.update(editing, data)
      else await faqsAPI.create(data)
      setShowModal(false)
      fetchFaqs()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить этот FAQ?')) return
    try { await faqsAPI.delete(id); fetchFaqs() }
    catch (err) { alert('Error') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
          <p className="text-gray-600 text-sm">{faqs.length} вопросов</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={18} /> Добавить FAQ
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Загрузка...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Вопросов нет</div>
        ) : faqs.map((faq, index) => (
          <div key={faq._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-gray-300 mt-1"><GripVertical size={18} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">#{faq.order}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${faq.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {faq.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{faq.question?.uz}</h3>
                  <p className="text-sm text-gray-500 mb-1">{faq.question?.ru}</p>
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">{faq.answer?.uz}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(faq)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(faq._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">{editing ? 'Редактировать FAQ' : 'Добавить FAQ'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Вопрос</label>
                <input placeholder="Question (UZ)" value={form.question.uz} onChange={e => setForm(f => ({ ...f, question: { ...f.question, uz: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" required />
                <input placeholder="Question (RU)" value={form.question.ru} onChange={e => setForm(f => ({ ...f, question: { ...f.question, ru: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" required />
                <input placeholder="Question (EN)" value={form.question.en} onChange={e => setForm(f => ({ ...f, question: { ...f.question, en: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ответ</label>
                <textarea placeholder="Answer (UZ)" value={form.answer.uz} onChange={e => setForm(f => ({ ...f, answer: { ...f.answer, uz: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" rows={3} required />
                <textarea placeholder="Answer (RU)" value={form.answer.ru} onChange={e => setForm(f => ({ ...f, answer: { ...f.answer, ru: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" rows={3} required />
                <textarea placeholder="Answer (EN)" value={form.answer.en} onChange={e => setForm(f => ({ ...f, answer: { ...f.answer, en: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Порядок отображения</label>
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-gray-700">Активен</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Отмена</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{editing ? 'Обновить' : 'Создать'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
