import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { createNote, deleteNote, listNotes, updateNote } from '../api/notes'
import { Plus, Trash2 } from 'lucide-react'

export default function Notes(){
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const refresh = async () => {
    const data = await listNotes()
    setNotes(data)
  }

  useEffect(()=>{ refresh() }, [])

  const add = async () => {
    if(!title.trim()) return
    const note = await createNote({ title, content })
    setNotes([note, ...notes])
    setTitle('')
    setContent('')
    window.dispatchEvent(new CustomEvent('notes:refresh'))
  }

  const save = async (note, updatedContent) => {
    const updated = await updateNote(note._id, { content: updatedContent })
    setNotes(notes.map(n => n._id===note._id ? updated : n))
    window.dispatchEvent(new CustomEvent('notes:refresh'))
  }

  const remove = async (note) => {
    await deleteNote(note._id)
    setNotes(notes.filter(n => n._id !== note._id))
    window.dispatchEvent(new CustomEvent('notes:refresh'))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-title text-slate">Quick Notes</h3>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Capture ideas instantly</p>
        </div>
        <button className="btn btn-accent flex items-center gap-2" onClick={add}>
          <Plus size={16}/> Add
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-dashed border-border rounded-2xl p-4 bg-bg-soft flex flex-col gap-3">
          <input
            className="border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="Note title..."
            value={title}
            onChange={e=>setTitle(e.target.value)}
          />
          <textarea
            className="border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/40 h-28 resize-none"
            placeholder="Remember to review oxidation-reduction reactions..."
            value={content}
            onChange={e=>setContent(e.target.value)}
          />
          <button className="btn btn-primary" onClick={add}>Save Note</button>
        </div>

        <div className="space-y-3 max-h-[260px] overflow-auto pr-2">
          {notes.map(note => {
            const updatedAt = note.updatedAt || note.createdAt || Date.now()
            return (
              <div key={note._id} className="rounded-2xl border border-border p-4 bg-white shadow-soft/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate">{note.title}</p>
                    <p className="text-xs uppercase text-muted">{formatDistanceToNow(new Date(updatedAt), { addSuffix:true })}</p>
                  </div>
                  <button className="text-muted hover:text-error" onClick={()=>remove(note)}>
                    <Trash2 size={16}/>
                  </button>
                </div>
                <textarea
                  className="mt-3 w-full bg-transparent border-none focus:outline-none text-sm text-slate h-24 resize-none"
                  defaultValue={note.content}
                  onBlur={(e)=>save(note, e.target.value)}
                />
              </div>
            )
          })}
          {notes.length===0 && <div className="text-muted text-sm">No notes yet — start by adding one.</div>}
        </div>
      </div>
    </div>
  )
}
