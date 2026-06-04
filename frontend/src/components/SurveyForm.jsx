import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function SurveyForm(){
  const [survey, setSurvey] = useState(null)
  const [answers, setAnswers] = useState({})

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/api/surveys/active')
        setSurvey(res.data)
      }catch(err){
        console.error(err)
      }
    }
    load()
  },[])

  function setAnswer(qid, value){
    setAnswers(a => ({ ...a, [qid]: value }))
  }

  async function submit(e){
    e.preventDefault()
    if (!survey) return
    const user = JSON.parse(localStorage.getItem('user')||'null')
    const payload = {
      surveyId: survey._id,
      department: user?.department || '',
      answers: Object.keys(answers).map(k => ({ questionId: k, answer: answers[k] }))
    }
    try{
      await api.post('/api/responses/submit', payload)
      alert('Submitted')
    }catch(err){
      alert('Submit failed')
    }
  }

  if (!survey) return <div className="p-4 bg-white rounded shadow">No active survey</div>

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{survey.title}</h3>
      <div className="space-y-3">
        {survey.questions?.map((q, idx) => (
          <div key={q.id || idx} className="">
            <label className="block text-sm font-medium">{q.text || q.question}</label>
            <input className="mt-1 p-2 w-full border rounded" onChange={e=>setAnswer(q.id || idx, e.target.value)} />
          </div>
        ))}
      </div>
      <div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      </div>
    </form>
  )
}
