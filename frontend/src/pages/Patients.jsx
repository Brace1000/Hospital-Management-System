import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

export default function Patients() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const canManage = ['admin', 'receptionist', 'doctor', 'nurse'].includes(user?.role)
  const [editing, setEditing] = useState(null)

  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: () => api.get('/patients').then(r => r.data) })
  const { register, handleSubmit, reset, setValue } = useForm()

  const save = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, age: data.age ? Number(data.age) : null, user_id: data.user_id ? Number(data.user_id) : null }
      return editing ? api.put(`/patients/${editing}`, payload) : api.post('/patients', payload)
    },
    onSuccess: () => { qc.invalidateQueries(['patients']); reset(); setEditing(null) },
    onError: (e) => alert(e.response?.data?.detail || 'Failed to save patient'),
  })

  const startEdit = (p) => {
    setEditing(p.id)
    Object.entries(p).forEach(([k, v]) => setValue(k, v))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Patients</h1>
      {canManage && (
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="bg-white p-4 rounded-2xl shadow mb-6 grid grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold text-gray-700">{editing ? 'Edit Patient' : 'Add Patient'}</h2>
          {[['name', 'Full Name'], ['age', 'Age'], ['gender', 'Gender'], ['contact', 'Contact'], ['address', 'Address']].map(([f, l]) => (
            <div key={f}>
              <label className="text-sm font-medium text-gray-600">{l}</label>
              <input {...register(f)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-600">Medical History</label>
            <textarea {...register('medical_history')} rows={2} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Link to User Account <span className="text-gray-400 font-normal">(User ID — allows patient to log in and self-manage)</span>
            </label>
            <input type="number" {...register('user_id')} placeholder="Leave blank if not applicable" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              {editing ? 'Update Patient' : 'Add Patient'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); reset() }} className="bg-gray-300 px-4 py-2 rounded-lg text-sm">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-600">
            <tr>{['ID', 'Name', 'Age', 'Gender', 'Contact', 'User ID', ...(canManage ? ['Actions'] : [])].map(h => (
              <th key={h} className="px-4 py-3 text-left">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {patients.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No patients registered yet</td></tr>
            )}
            {patients.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.age}</td>
                <td className="px-4 py-3">{p.gender}</td>
                <td className="px-4 py-3">{p.contact}</td>
                <td className="px-4 py-3">{p.user_id ?? <span className="text-gray-400">—</span>}</td>
                {canManage && (
                  <td className="px-4 py-3">
                    <button onClick={() => startEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
