import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMyRequestsApi, addCommentApi, getCommentsApi } from '../api/requestApi'

function RequestDetailPage() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequest()
    loadComments()
  }, [requestId])

  const loadRequest = async () => {
    try {
      const { data } = await getMyRequestsApi()
      const req = data.requests.find(r => Number(r.id) === Number(requestId))
      if (req) setRequest(req)
      else toast.error('Request not found')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async () => {
    try {
      const { data } = await getCommentsApi(requestId)
      setComments(data.comments || [])
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      await addCommentApi(requestId, { text: newComment })
      setNewComment('')
      toast.success('Comment added')
      loadComments()
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (loading) return <div className="text-center py-20 text-slate-400">Loading...</div>
  if (!request) return <div className="text-center py-20 text-red-400">Request not found</div>

  const statusColors = { Pending: 'bg-yellow-600', 'In Progress': 'bg-blue-600', Completed: 'bg-green-600' }
  const priorityColors = { Low: 'bg-green-600', Medium: 'bg-yellow-600', High: 'bg-orange-600', Critical: 'bg-red-600' }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <button onClick={() => navigate(-1)} className="text-cyan-400 hover:text-cyan-300 mb-6">← Back</button>

      <div className="max-w-2xl mx-auto">
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{request.title}</h1>
              <p className="text-slate-400 mt-2">Request #{request.id}</p>
            </div>
            <div className="flex gap-2">
              <span className={`${statusColors[request.status]} px-3 py-1 rounded text-white`}>{request.status}</span>
              <span className={`${priorityColors[request.priority]} px-3 py-1 rounded text-white`}>{request.priority}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-slate-300">
            <div>
              <p className="text-sm text-slate-500">Category</p>
              <p className="text-white">{request.category}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Created</p>
              <p className="text-white">{new Date(request.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-600">
            <p className="text-sm text-slate-500 mb-2">Description</p>
            <p className="text-slate-300 leading-relaxed">{request.description}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">💬 Comments ({comments.length})</h2>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-slate-400">No comments yet</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="bg-slate-800 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-cyan-400">{comment.full_name}</span>
                    <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-600 pt-4">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="input w-full mb-3 resize-none" rows="3"></textarea>
            <button onClick={handleAddComment} className="btn-primary w-full">Post Comment</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestDetailPage