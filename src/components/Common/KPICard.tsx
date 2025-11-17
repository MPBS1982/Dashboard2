import { ReactNode } from 'react'

export default function KPICard({ title, value, accent, icon }: { title: string; value: string; accent?: 'success' | 'danger'; icon?: ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
      {icon && <div className={accent === 'success' ? 'text-success' : accent === 'danger' ? 'text-danger' : 'text-primary'}>{icon}</div>}
    </div>
  )
}