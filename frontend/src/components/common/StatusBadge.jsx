const badgeMap = {
  Pending: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  'In Progress': 'bg-sky-500/20 text-sky-300 border-sky-400/30',
  Completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeMap[status] || badgeMap.Pending}`}>
      {status}
    </span>
  )
}

export default StatusBadge