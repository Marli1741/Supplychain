'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadWeb3, getContract } from '@/lib/web3'

export default function AddMedicine() {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState('')
  const [supplyChain, setSupplyChain] = useState<any>(null)
  
  const [medName, setMedName] = useState('')
  const [medDes, setMedDes] = useState('')

  useEffect(() => {
    const init = async () => {
      await loadWeb3()
      const { contract, account } = await getContract()
      setSupplyChain(contract)
      setCurrentAccount(account)
    }
    init()
  }, [])

  const handlerSubmitMed = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await supplyChain.methods.addMedicine(medName, medDes).send({ from: currentAccount })
      alert("Medicine Ordered Successfully! It is now on the Blockchain.")
      setMedName('')
      setMedDes('')
    } catch (err) {
      console.error(err)
      alert("Transaction Failed. Ensure you are the Admin AND all 4 roles are registered first!")
    }
  }

  const inputStyle = "w-full p-4 border-4 border-slate-200 bg-slate-50 rounded-xl text-slate-900 font-bold text-xl focus:border-slate-900 outline-none transition-all placeholder:text-slate-400 mb-6"
  const buttonStyle = "w-full bg-blue-600 text-white font-black py-5 rounded-xl hover:bg-blue-700 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 text-2xl uppercase tracking-widest border-4 border-slate-900"

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        
        <div className="self-start">
          <button 
            onClick={() => router.push('/')} 
            className="mb-8 bg-white border-2 border-slate-900 px-4 py-2 rounded-lg font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            ← EXIT TO DASHBOARD
          </button>
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">
            Order <span className="text-blue-600 border-b-8 border-blue-600">Materials</span>
          </h1>
          <p className="text-slate-700 font-bold mt-4 text-xl">
            Create a new product batch on the Blockchain Ledger.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-2xl border-4 border-slate-900 overflow-hidden flex-1 max-h-[500px]">
          <div className="bg-slate-900 p-6 text-white font-black text-2xl uppercase tracking-widest text-center border-b-4 border-slate-900 flex items-center justify-center gap-3">
            <span>📦</span> Initialize New Product
          </div>
          
          <form onSubmit={handlerSubmitMed} className="p-8 md:p-12">
            
            <div className="mb-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block">
                Product Name
              </label>
              <input 
                className={inputStyle} 
                placeholder="e.g., Paracetamol Batch A" 
                value={medName} 
                onChange={(e) => setMedName(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block">
                Product Description
              </label>
              <input 
                className={inputStyle} 
                placeholder="e.g., 500mg tablets, 100 boxes" 
                value={medDes} 
                onChange={(e) => setMedDes(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className={buttonStyle}>
              Create Order
            </button>

            <p className="text-center mt-6 text-slate-500 font-bold text-sm">
              Note: This action requires MetaMask confirmation and will cost Gas (ETH).
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}