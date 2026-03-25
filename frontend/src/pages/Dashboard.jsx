import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-white rounded-2xl shadow p-6 border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value ?? '—'}</p>
    </div>
  )
}

export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: () => api.get('/reports/summary').then(r => r.data),
    retry: false,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Patients" value={data?.total_patients} color="border-blue-500" />
        <StatCard label="Total Appointments" value={data?.total_appointments} color="border-green-500" />
        <StatCard label="Drugs in Stock" value={data?.total_drugs} color="border-purple-500" />
        <StatCard label="Total Revenue ($)" value={data?.total_revenue?.toFixed(2)} color="border-yellow-500" />
        <StatCard label="Pending Invoices" value={data?.pending_invoices} color="border-red-500" />
      </div>
    </div>
  )
}
