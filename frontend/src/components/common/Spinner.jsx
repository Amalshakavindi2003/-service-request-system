function Spinner({ fullScreen = false }) {
  return (
    <div className={fullScreen ? 'grid min-h-screen place-items-center bg-slate-950' : 'grid place-items-center py-10'}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
    </div>
  )
}

export default Spinner