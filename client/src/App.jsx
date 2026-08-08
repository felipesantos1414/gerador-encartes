import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [status, setStatus] = useState('verificando')

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => {
        if (!res.ok) throw new Error('resposta inválida')
        return res.json()
      })
      .then(() => setStatus('conectado'))
      .catch(() => setStatus('desconectado'))
  }, [])

  const statusStyles = {
    verificando: 'bg-yellow-100 text-yellow-800',
    conectado: 'bg-green-100 text-green-800',
    desconectado: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-800">Gerador de Encartes</h1>
      <p className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[status]}`}>
        Status do servidor: {status}
      </p>
    </div>
  )
}

export default App
