function StatCard({ label, value, accent = 'from-sky-500 to-indigo-500' }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-300">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-bold text-white">{value}</p>
        <div className={`h-2 w-14 rounded-full bg-gradient-to-r ${accent}`} />
      </div>
    </div>
  )
}

export default StatCard