import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getRequestByIdApi, addCommentApi, getCommentsApi, updateRequestStatusApi } from '../api/requestApi'

function RequestDetailPage() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [request, setRequest] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [statusDraft, setStatusDraft] = useState('Pending')

  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff'

  useEffect(() => {
    loadRequest()
    loadComments()
  }, [requestId])

  const loadRequest = async () => {
    try {
      const { data } = await getRequestByIdApi(requestId)
      const resolvedRequest = data?.request || null
      setRequest(resolvedRequest)
      if (resolvedRequest?.status) {
        setStatusDraft(resolvedRequest.status)
      }
    } catch (error) {
      toast.error(error?.message || 'Unable to load request')
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async () => {
    try {
      const { data } = await getCommentsApi(requestId)
      setComments(data?.comments || [])
    } catch (error) {
      toast.error(error?.message || 'Unable to load comments')
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      await addCommentApi(requestId, { text: newComment.trim() })
      setNewComment('')
      toast.success('Comment added')
      loadComments()
    } catch (error) {
      toast.error(error?.message || 'Failed to add comment')
    }
  }

  const handleStatusUpdate = async () => {
    if (!request || statusDraft === request.status) return

    try {
      setSavingStatus(true)
      await updateRequestStatusApi(request.id, { status: statusDraft, assignedTo: request.assigned_to || user?.full_name || '' })
      toast.success('Request status updated')
      loadRequest()
    } catch (error) {
      toast.error(error?.message || 'Failed to update status')
    } finally {
      setSavingStatus(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Loading...</div>
  if (!request) return <div className="text-center py-20 text-red-400">Request not found</div>

  const statusColors = { Pending: 'bg-yellow-600', 'In Progress': 'bg-blue-600', Completed: 'bg-green-600' }
  const priorityColors = { Low: 'bg-green-600', Medium: 'bg-yellow-600', High: 'bg-orange-600', Critical: 'bg-red-600' }

  const timeline = [
    { label: 'Submitted', done: true, date: request.created_at },
    { label: 'In Progress', done: request.status === 'In Progress' || request.status === 'Completed', date: request.status !== 'Pending' ? request.updated_at : null },
    { label: 'Completed', done: request.status === 'Completed', date: request.status === 'Completed' ? request.updated_at : null },
  ]

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <button onClick={() => navigate(-1)} className="text-cyan-400 hover:text-cyan-300 mb-6">Back</button>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{request.title}</h1>
              <p className="text-slate-400 mt-2">Request #{request.id}</p>
              <p className="text-slate-400 text-sm mt-1">Requester: {request.full_name || 'Employee'}</p>
            </div>
            <div className="flex gap-2">
              <span className={`${statusColors[request.status]} px-3 py-1 rounded text-white`}>{request.status}</span>
              <span className={`${priorityColors[request.priority]} px-3 py-1 rounded text-white`}>{request.priority}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-slate-300">
            <div>
              <p className="text-sm text-slate-500">Category</p>
              <p className="text-white">{request.category}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Assigned To</p>
              <p className="text-white">{request.assigned_to || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Created</p>
              <p className="text-white">{new Date(request.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Last Updated</p>
              <p className="text-white">{new Date(request.updated_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-600">
            <p className="text-sm text-slate-500 mb-2">Description</p>
            <p className="text-slate-300 leading-relaxed">{request.description}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Progress Timeline</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {timeline.map((step) => (
              <div key={step.label} className={`rounded-lg border px-4 py-3 ${step.done ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="text-xs text-slate-400 mt-1">{step.date ? new Date(step.date).toLocaleString() : 'Not reached yet'}</p>
              </div>
            ))}
          </div>
        </div>

        {isAdminOrStaff && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Handle This Request</h2>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <select value={statusDraft} onChange={(e) => setStatusDraft(e.target.value)} className="input w-full">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button disabled={savingStatus || statusDraft === request.status} onClick={handleStatusUpdate} className="btn-primary px-6 disabled:cursor-not-allowed disabled:opacity-60">
                {savingStatus ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Comments ({comments.length})</h2>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-slate-400">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-slate-800 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-cyan-400">{comment.full_name}</span>
                    <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-600 pt-4">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment with your troubleshooting update..." className="input w-full mb-3 resize-none" rows="3"></textarea>
            <button onClick={handleAddComment} className="btn-primary w-full">Post Comment</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestDetailPage