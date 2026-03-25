import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../api/client'

const statusColors = { scheduled: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }

export default function Appointments() {
  const qc = useQueryClient()
  const { data: appointments = [] } = useQuery({ queryKey: ['appointments'], queryFn: () => api.get('/appointments').then(r => r.data) })
  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: () => api.get('/patients').then(r => r.data) })
  const { data: doctors = [] } = useQuery({ queryKey: ['doctors'], queryFn: () => api.get('/doctors').then(r => r.data) })
  const { register, handleSubmit, reset } = useForm()

  const create = useMutation({
    mutationFn: (data) => api.post('/appointments', data),
    onSuccess: () => { qc.invalidateQueries(['appointments']); reset() }
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/appointments/${id}/status?status=${status}`),
    onSuccess: () => qc.invalidateQueries(['appointments'])
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Appointments</h1>
      <form onSubmit={handleSubmit(d => create.mutate(d))} className="bg-white p-4 rounded-2xl shadow mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Patient</label>
          <select {...register('patient_id', { required: true })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Select patient</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Doctor</label>
          <select {...register('doctor_id', { required: true })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Select doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Date</label>
          <input type="date" {...register('date', { required: true })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Time</label>
          <input type="time" {...register('time', { required: true })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-600">Notes</label>
          <input {...register('notes')} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="col-span-2">
          <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Book Appointment</button>
        </div>
      </form>
      <div className="bg-white rounded-2xl shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-600">
            <tr>{['ID', 'Patient', 'Doctor', 'Date', 'Time', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{a.id}</td>
                <td className="px-4 py-3">{a.patient_id}</td>
                <td className="px-4 py-3">{a.doctor_id}</td>
                <td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3">{a.time}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || ''}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-1">
                  {['completed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => updateStatus.mutate({ id: a.id, status: s })}
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 capitalize">{s}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
