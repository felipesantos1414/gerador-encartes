import { themes } from '../../themes'

function StepTema({ themeId, onSelect }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold text-slate-800">1. Escolha o tema</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.values(themes).map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
              themeId === theme.id
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex gap-1">
              <span className="h-8 w-8 rounded" style={{ background: theme.colors.background }} />
              <span className="h-8 w-8 rounded" style={{ background: theme.colors.priceTag }} />
            </div>
            <span className="font-semibold text-slate-800">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default StepTema
