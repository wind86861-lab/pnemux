import { useEffect, useState } from 'react'
import { teamAPI, uploadAPI } from '../../services/api'
import { Trash2, X, Edit2, Plus, Image as ImageIcon, Save } from 'lucide-react'

export default function AdminTeam() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: { uz: '', ru: '', en: '' },
    description: { uz: '', ru: '', en: '' },
    image: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await teamAPI.getAll()
      setMembers(res.data || [])
    } catch (error) {
      console.error('Failed to fetch team members:', error)
    }
    setLoading(false)
  }

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        title: member.title || { uz: '', ru: '', en: '' },
        description: member.description || { uz: '', ru: '', en: '' },
        image: member.image || '',
        order: member.order || 0,
        isActive: member.isActive !== false,
      })
    } else {
      setEditingMember(null)
      setFormData({
        name: '',
        title: { uz: '', ru: '', en: '' },
        description: { uz: '', ru: '', en: '' },
        image: '',
        order: members.length,
        isActive: true,
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingMember) {
        await teamAPI.update(editingMember._id, formData)
      } else {
        await teamAPI.create(formData)
      }
      setShowModal(false)
      fetchMembers()
    } catch (error) {
      alert('Failed to save team member')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить этого сотрудника?')) return
    try {
      await teamAPI.delete(id)
      fetchMembers()
    } catch (error) {
      alert('Failed to delete')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Max 5MB')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await uploadAPI.single(fd)
      setFormData({ ...formData, image: res.data.url })
    } catch (error) {
      alert('Upload failed')
    }
    setUploading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Команда</h1>
          <p className="text-gray-600 text-sm">{members.length} сотрудников</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Добавить сотрудника
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Загрузка...</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Сотрудников нет</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {members.map((member) => (
              <div key={member._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {member.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(member)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(member._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-gray-300" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{member.title?.uz || member.title?.ru || '—'}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{member.description?.uz || member.description?.ru || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl my-4">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">
                {editingMember ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Фото</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-gray-300" />
                    )}
                  </div>
                  <label className="flex-1">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                      {uploading ? (
                        <div className="text-sm text-gray-500">Загрузка...</div>
                      ) : (
                        <div className="text-sm text-gray-500">Загрузить фото (Max 5MB)</div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">*Имя</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Furqatbek Karimov"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formData.title.uz}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, uz: e.target.value } })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="UZ: Ekspert"
                  />
                  <input
                    type="text"
                    value={formData.title.ru}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ru: e.target.value } })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="RU: Эксперт"
                  />
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="EN: Expert"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <div className="space-y-2">
                  <textarea
                    value={formData.description.uz}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, uz: e.target.value } })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="UZ: Uskuna va ehtiyot qismlar narxini hamda yetkazib berish xarajatlarini hisoblab beraman."
                  />
                  <textarea
                    value={formData.description.ru}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ru: e.target.value } })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="RU: Рассчитываю стоимость оборудования и запчастей, а также расходы на доставку."
                  />
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="EN: I calculate the cost of equipment and spare parts, as well as delivery costs."
                  />
                </div>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Активен</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save size={16} /> Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
