function StepDados({ form, onChange }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold text-slate-800">3. Dados do encarte</h2>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Título do encarte
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ofertas da Semana"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Nome do mercado
          <input
            type="text"
            value={form.storeName}
            onChange={(e) => onChange({ storeName: e.target.value })}
            placeholder="Seu Mercado"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
            Válido de
            <input
              type="date"
              value={form.validFrom}
              onChange={(e) => onChange({ validFrom: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
            Válido até
            <input
              type="date"
              value={form.validUntil}
              onChange={(e) => onChange({ validUntil: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default StepDados
