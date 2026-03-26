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
    mutationFn: (data) => editing
      ? api.put(`/patients/${editing}`, data)
      : api.post('/patients', data),
    onSuccess: () => { qc.invalidateQueries(['patients']); reset(); setEditing(null) }
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
        {['name', 'age', 'gender', 'contact', 'address'].map(f => (
          <div key={f}>
            <label className="text-sm font-medium text-gray-600 capitalize">{f}</label>
            <input {...register(f)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        ))}
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-600">Medical History</label>
          <textarea {...register('medical_history')} rows={2} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="col-span-2 flex gap-2">
          <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            {editing ? 'Update' : 'Add Patient'}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); reset() }} className="bg-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </form>
      )}
      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-600">
            <tr>{['ID', 'Name', 'Age', 'Gender', 'Contact', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.age}</td>
                <td className="px-4 py-3">{p.gender}</td>
                <td className="px-4 py-3">{p.contact}</td>
                <td className="px-4 py-3">
                  {canManage && <button onClick={() => startEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
