function EmptyState({ title, subtitle }) {
  return (
    <div className="card p-10 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
    </div>
  )
}

export default EmptyState