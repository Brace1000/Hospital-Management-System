import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
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
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isPatient = user?.role === 'patient'

  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: () => api.get('/reports/summary').then(r => r.data),
    enabled: isAdmin,
    retry: false,
  })

  const { data: myAppointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => api.get('/appointments').then(r => r.data),
    enabled: isPatient,
    retry: false,
  })

  const { data: myInvoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get('/billing/invoices').then(r => r.data),
    enabled: isPatient,
    retry: false,
  })

  if (isPatient) {
    const pending = myInvoices.filter(i => i.status === 'unpaid').length
    const scheduled = myAppointments.filter(a => a.status === 'scheduled').length
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {user.username} 👋</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard label="My Appointments" value={myAppointments.length} color="border-blue-500" />
          <StatCard label="Scheduled" value={scheduled} color="border-green-500" />
          <StatCard label="Pending Invoices" value={pending} color="border-red-500" />
          <StatCard label="Total Invoices" value={myInvoices.length} color="border-yellow-500" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      {!isAdmin && (
        <p className="text-sm text-gray-500 mb-4">Full statistics are available to admins only.</p>
      )}
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
