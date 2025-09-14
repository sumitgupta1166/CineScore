import React, { useState } from 'react'
import client from '../lib/api'

export default function ReviewForm({ movieId, onSuccess }) {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await client.post(`/movies/${movieId}/reviews`, { rating, text })
      setText('')
      onSuccess && onSuccess()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm">Rating</label>
        <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="border p-2 rounded">
          {[5,4,3,2,1].map(v=> <option key={v} value={v}>{v} star</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm">Review</label>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full border p-2 rounded" rows={4} />
      </div>
      <button className="px-4 py-2 bg-accent text-white rounded">Submit</button>
    </form>
  )
}