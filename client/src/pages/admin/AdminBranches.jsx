import { useEffect, useState } from 'react'
import { branchesAPI, uploadAPI } from '../../services/api'
import { Plus, Pencil, Trash2, X, MapPin, Phone } from 'lucide-react'

export default function AdminBranches() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    title: { uz: '', ru: '', en: '' },
    company: '',
    inn: '',
    director: { uz: '', ru: '', en: '' },
    founded: '',
    address: { uz: '', ru: '', en: '' },
    fullAddress: '',
    phones: [''],
    mapUrl: '',
    image: '',
    order: 0,
    showOnHomepage: false,
    isActive: true,
  })

  useEffect(() => { fetchBranches() }, [])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const res = await branchesAPI.getAll()
      setBranches(res.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({
      title: { uz: '', ru: '', en: '' }, company: '', inn: '',
      director: { uz: '', ru: '', en: '' }, founded: '',
      address: { uz: '', ru: '', en: '' }, fullAddress: '',
      phones: [''], mapUrl: '', image: '', order: 0, showOnHomepage: false, isActive: true,
    })
    setShowModal(true)
  }

  const openEdit = (b) => {
    setEditing(b._id)
    setForm({
      title: b.title || { uz: '', ru: '', en: '' },
      company: b.company || '',
      inn: b.inn || '',
      director: b.director || { uz: '', ru: '', en: '' },
      founded: b.founded || '',
      address: b.address || { uz: '', ru: '', en: '' },
      fullAddress: b.fullAddress || '',
      phones: b.phones?.length ? b.phones : [''],
      mapUrl: b.mapUrl || '',
      image: b.image || '',
      order: b.order || 0,
      showOnHomepage: b.showOnHomepage || false,
      isActive: b.isActive !== false,
    })
    setShowModal(true)
  }

  const [imgUploading, setImgUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    setImgUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await uploadAPI.single(fd)
      setForm(f => ({ ...f, image: res.data.url }))
    } catch { alert('Yuklash xatosi') }
    finally { setImgUploading(false) }
  }

  const addPhone = () => setForm(f => ({ ...f, phones: [...f.phones, ''] }))
  const removePhone = (i) => setForm(f => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }))
  const updatePhone = (i, val) => setForm(f => ({ ...f, phones: f.phones.map((p, idx) => idx === i ? val : p) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { ...form, order: Number(form.order), phones: form.phones.filter(p => p.trim()) }
      if (editing) await branchesAPI.update(editing, data)
      else await branchesAPI.create(data)
      setShowModal(false)
      fetchBranches()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить этот филиал?')) return
    try { await branchesAPI.delete(id); fetchBranches() }
    catch (err) { alert('Error') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Филиалы</h1>
          <p className="text-gray-600 text-sm">{branches.length} филиалов</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={18} /> Добавить филиал
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-gray-400">Загрузка...</div>
        ) : branches.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-400">Филиалов нет</div>
        ) : branches.map(b => (
          <div key={b._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{b.title?.uz}</h3>
                <p className="text-sm text-gray-500">{b.company}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(b)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(b._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{b.fullAddress || b.address?.uz || '—'}</span>
              </div>
              {b.phones?.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">Директор: {b.director?.ru || b.director?.uz || '—'}</span>
                {b.showOnHomepage && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">На главной</span>
                )}
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {b.isActive ? 'Активен' : 'Неактивен'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">{editing ? 'Редактировать филиал' : 'Добавить филиал'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название филиала</label>
                <input placeholder="Title (UZ)" value={form.title.uz} onChange={e => setForm(f => ({ ...f, title: { ...f.title, uz: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" required />
                <input placeholder="Title (RU)" value={form.title.ru} onChange={e => setForm(f => ({ ...f, title: { ...f.title, ru: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" required />
                <input placeholder="Title (EN)" value={form.title.en} onChange={e => setForm(f => ({ ...f, title: { ...f.title, en: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название компании</label>
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ИНН</label>
                  <input value={form.inn} onChange={e => setForm(f => ({ ...f, inn: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Директор</label>
                <input placeholder="Director (UZ)" value={form.director.uz} onChange={e => setForm(f => ({ ...f, director: { ...f.director, uz: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" />
                <input placeholder="Director (RU)" value={form.director.ru} onChange={e => setForm(f => ({ ...f, director: { ...f.director, ru: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" />
                <input placeholder="Director (EN)" value={form.director.en} onChange={e => setForm(f => ({ ...f, director: { ...f.director, en: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата основания</label>
                  <input value={form.founded} onChange={e => setForm(f => ({ ...f, founded: e.target.value }))} placeholder="напр. 24.01.2024" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
                <input placeholder="Address (UZ)" value={form.address.uz} onChange={e => setForm(f => ({ ...f, address: { ...f.address, uz: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" />
                <input placeholder="Address (RU)" value={form.address.ru} onChange={e => setForm(f => ({ ...f, address: { ...f.address, ru: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" />
                <input placeholder="Address (EN)" value={form.address.en} onChange={e => setForm(f => ({ ...f, address: { ...f.address, en: e.target.value } }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Полный адрес</label>
                <input value={form.fullAddress} onChange={e => setForm(f => ({ ...f, fullAddress: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Номера телефонов</label>
                {form.phones.map((phone, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={phone} onChange={e => updatePhone(i, e.target.value)} placeholder="+998 XX XXX XX XX" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    {form.phones.length > 1 && (
                      <button type="button" onClick={() => removePhone(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addPhone} className="text-sm text-blue-600 hover:underline">+ Добавить телефон</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Фото филиала</label>
                <div className="flex items-center gap-4">
                  {form.image && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={form.image} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {imgUploading ? 'Загрузка...' : 'Загрузить фото'}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                <input value={form.mapUrl} onChange={e => setForm(f => ({ ...f, mapUrl: e.target.value }))} placeholder="https://www.google.com/maps/embed?..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.showOnHomepage} onChange={e => setForm(f => ({ ...f, showOnHomepage: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Показывать на главной</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Активен</span>
                </label>
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
