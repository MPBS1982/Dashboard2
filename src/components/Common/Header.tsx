import { useState } from 'react'

type Tab = 'overview' | 'products' | 'analytics'

export default function Header({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="text-primary font-semibold">Dashboard de Vendas</div>
          <nav className="hidden md:flex gap-6">
            <a className={tab === 'overview' ? 'text-primary' : 'text-gray-600'} href="#overview" onClick={(e) => { e.preventDefault(); onChange('overview'); }}>Visão Geral</a>
            <a className={tab === 'products' ? 'text-primary' : 'text-gray-600'} href="#products" onClick={(e) => { e.preventDefault(); onChange('products'); }}>Produtos</a>
            <a className={tab === 'analytics' ? 'text-primary' : 'text-gray-600'} href="#analytics" onClick={(e) => { e.preventDefault(); onChange('analytics'); }}>Análises</a>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>
        </div>
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-2">
            <a className={tab === 'overview' ? 'text-primary' : 'text-gray-600'} href="#overview" onClick={(e) => { e.preventDefault(); onChange('overview'); setOpen(false); }}>Visão Geral</a>
            <a className={tab === 'products' ? 'text-primary' : 'text-gray-600'} href="#products" onClick={(e) => { e.preventDefault(); onChange('products'); setOpen(false); }}>Produtos</a>
            <a className={tab === 'analytics' ? 'text-primary' : 'text-gray-600'} href="#analytics" onClick={(e) => { e.preventDefault(); onChange('analytics'); setOpen(false); }}>Análises</a>
          </div>
        )}
      </div>
    </header>
  )
}