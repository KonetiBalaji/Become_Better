'use client'

export default function DeleteAccountButton() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      e.preventDefault()
    }
  }

  return (
    <form action="/api/auth/delete" method="POST" onSubmit={handleSubmit}>
      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
      >
        Delete Account
      </button>
    </form>
  )
}

