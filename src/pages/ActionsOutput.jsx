import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { actionChecklist, draftEmail, teamsPrompt } from '../data/demoData'

const priorityColour = {
  Critical: 'bg-brand-red/10 text-brand-red border-brand-red/20',
  High: 'bg-amber-50 text-amber-700 border-amber-200',
  Medium: 'bg-blue-50 text-blue-700 border-blue-200',
}

function ActionItem({ action, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
        checked
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
        checked ? 'border-green-500 bg-green-500' : 'border-gray-300'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`text-sm font-semibold ${checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {action.title}
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityColour[action.priority]}`}>
            {action.priority}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{action.description}</p>
        <p className="text-xs text-gray-400 mt-1">Owner: {action.owner}</p>
      </div>
    </button>
  )
}

function AgentTimeline() {
  const steps = [
    { label: 'Detected competitor readout', time: '08:32', done: true, icon: 'search' },
    { label: 'Traced impact to portfolio studies', time: '08:33', done: true, icon: 'chart' },
    { label: 'Forecasted FTE resource gaps', time: '08:34', done: true, icon: 'calc' },
    { label: 'Identified Capacity Manager contact', time: '08:34', done: true, icon: 'person' },
    { label: 'Drafted stakeholder communications', time: '08:35', done: true, icon: 'mail' },
    { label: 'Approve email to Sarah Chen', time: '', done: false, icon: 'approve', pending: true },
  ]

  const icons = {
    search: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    chart: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    calc: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.616 4.5 4.71V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.71c0-1.094-.807-2.01-1.907-2.138A48.205 48.205 0 0012 2.25z" />
      </svg>
    ),
    person: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    mail: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    approve: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.pending
                ? 'bg-brand-red text-white border-2 border-brand-red'
                : step.done
                ? 'bg-brand-red/10 text-brand-red border border-brand-red/30'
                : 'bg-gray-100 text-gray-400 border border-gray-200'
            }`}>
              {icons[step.icon]}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px h-6 bg-gray-200 my-0.5" />
            )}
          </div>
          <div className={`pb-4 flex-1 ${step.pending ? 'bg-brand-red/5 border border-brand-red/30 rounded-lg px-3 py-2 -mt-0.5' : 'pt-1'}`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${step.pending ? 'font-semibold text-brand-red' : step.done ? 'text-gray-700' : 'text-gray-400'}`}>
                {step.label}
              </p>
              {step.time && (
                <span className="text-xs text-gray-400">{step.time}</span>
              )}
            </div>
            {step.pending && (
              <p className="text-xs text-brand-red/70 mt-0.5">Awaiting your approval to send</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ActionsOutput() {
  const navigate = useNavigate()
  const [checkedItems, setCheckedItems] = useState(new Set())
  const [emailApproved, setEmailApproved] = useState(false)
  const [teamsPosted, setTeamsPosted] = useState(false)
  const [activeTab, setActiveTab] = useState('email')

  function toggleItem(id) {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const completedCount = checkedItems.size

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actions & Outputs</h1>
          <p className="text-gray-500 text-sm mt-0.5">Recommended actions and draft communications for NP-MM-401 acceleration</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{completedCount}/{actionChecklist.length}</span> actions completed
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Agent timeline */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-4">Agent Status</h2>
            <AgentTimeline />
          </div>
        </div>

        {/* Centre: Checklist */}
        <div className="col-span-4 space-y-3">
          <h2 className="font-semibold text-gray-900">Action Checklist</h2>
          {actionChecklist.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
              checked={checkedItems.has(action.id)}
              onToggle={() => toggleItem(action.id)}
            />
          ))}
        </div>

        {/* Right: Draft comms */}
        <div className="col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('email')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'email' ? 'bg-brand-red/10 text-brand-red' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Draft Email
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'teams' ? 'bg-brand-red/10 text-brand-red' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Teams Message
            </button>
          </div>

          {activeTab === 'email' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Email header */}
              <div className="border-b border-gray-100 p-4 space-y-2">
                <div className="grid grid-cols-[40px_1fr] gap-2 text-xs">
                  <span className="text-gray-400 pt-0.5">From</span>
                  <span className="text-gray-700">{draftEmail.from}</span>
                  <span className="text-gray-400 pt-0.5">To</span>
                  <span className="text-gray-700">{draftEmail.toName}</span>
                  <span className="text-gray-400 pt-0.5">Subject</span>
                  <span className="text-gray-900 font-medium">{draftEmail.subject}</span>
                </div>
              </div>

              {/* Email body */}
              <div className="p-4">
                <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                  {draftEmail.body}
                </pre>
              </div>

              {/* Approve CTA */}
              <div className={`mx-4 mb-4 rounded-lg border p-3 ${
                emailApproved
                  ? 'border-green-200 bg-green-50'
                  : 'border-brand-red/30 bg-brand-red/5'
              }`}>
                {emailApproved ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold">Email approved and queued for sending</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-brand-red font-medium">
                      Approve to send email to {draftEmail.toName.split(',')[0]}
                    </p>
                    <button
                      onClick={() => setEmailApproved(true)}
                      className="w-full bg-brand-red text-white text-sm font-semibold py-2 rounded-lg hover:bg-brand-red/90 transition-colors"
                    >
                      Approve & Send Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-4 h-4 bg-purple-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">T</span>
                  </div>
                  <span>Microsoft Teams</span>
                  <span className="text-gray-300">·</span>
                  <span className="font-medium text-gray-700">#{teamsPrompt.channel}</span>
                </div>
              </div>

              <div className="p-4">
                <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                  {teamsPrompt.message}
                </pre>
              </div>

              <div className={`mx-4 mb-4 rounded-lg border p-3 ${
                teamsPosted
                  ? 'border-green-200 bg-green-50'
                  : 'border-purple-200 bg-purple-50'
              }`}>
                {teamsPosted ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold">Posted to Teams channel</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-purple-700 font-medium">Post to #{teamsPrompt.channel}</p>
                    <button
                      onClick={() => setTeamsPosted(true)}
                      className="w-full bg-purple-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Post to Teams
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
