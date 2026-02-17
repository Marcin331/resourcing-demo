import { useState } from 'react'

const DEMO_PASSWORD = 'demo2026'

export default function PasswordScreen({ onAuthenticated }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === DEMO_PASSWORD) {
      onAuthenticated()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA]">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8B1A4A] text-2xl font-bold text-white">
            RP
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            Resource Planning
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Enter password to access the demo
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="Enter demo password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:border-[#8B1A4A] focus:ring-2 focus:ring-[#8B1A4A]/20 focus:outline-none"
          />

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-[#D4A017] px-4 py-3 text-sm font-semibold text-[#1F2937] transition-colors hover:bg-[#C4920F] cursor-pointer"
          >
            Enter Demo
          </button>
        </form>
      </div>
    </div>
  )
}
