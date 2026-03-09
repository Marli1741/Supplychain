'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadWeb3, getContract } from '@/lib/web3'

export default function RegisterRoles() {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState('')
  const [supplyChain, setSupplyChain] = useState<any>(null)
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [ownerAddress, setOwnerAddress] = useState('')

  const [rms, setRms] = useState({ address: '', name: '', place: '' })
  const [man, setMan] = useState({ address: '', name: '', place: '' })
  const [dis, setDis] = useState({ address: '', name: '', place: '' })
  const [ret, setRet] = useState({ address: '', name: '', place: '' })

  useEffect(() => {
    const init = async () => {
      await loadWeb3()
      const { contract, account } = await getContract()
      setSupplyChain(contract)
      setCurrentAccount(account)

try {
const contractOwner = (await contract.methods.Owner().call()) as string;
        setOwnerAddress(contractOwner);
        
        if (account && contractOwner && account.toLowerCase() === contractOwner.toLowerCase()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false)
        }
      } catch (err) {
        console.error("Error verifying admin status:", err)
        setIsAdmin(false) 
      }
    }
    init()
  }, [])

  const handleAddRMS = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await supplyChain.methods.addRMS(rms.address, rms.name, rms.place).send({ from: currentAccount }); alert("Supplier Added!"); setRms({address:'', name:'', place:''}) } catch (err) { console.error(err); alert("Failed. Are you the Admin?") }
  }
  const handleAddMan = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await supplyChain.methods.addManufacturer(man.address, man.name, man.place).send({ from: currentAccount }); alert("Manufacturer Added!"); setMan({address:'', name:'', place:''}) } catch (err) { console.error(err); alert("Failed. Are you the Admin?") }
  }
  const handleAddDis = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await supplyChain.methods.addDistributor(dis.address, dis.name, dis.place).send({ from: currentAccount }); alert("Distributor Added!"); setDis({address:'', name:'', place:''}) } catch (err) { console.error(err); alert("Failed. Are you the Admin?") }
  }
  const handleAddRet = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await supplyChain.methods.addRetailer(ret.address, ret.name, ret.place).send({ from: currentAccount }); alert("Retailer Added!"); setRet({address:'', name:'', place:''}) } catch (err) { console.error(err); alert("Failed. Are you the Admin?") }
  }

  const inputStyle = "w-full p-3 border-4 border-slate-200 bg-slate-50 rounded-lg text-slate-900 font-bold text-lg focus:border-slate-900 outline-none transition-all placeholder:text-slate-400 mb-3"
  const buttonStyle = "w-full bg-slate-900 text-white font-black py-4 rounded-lg hover:bg-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 uppercase tracking-wider"

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <h2 className="text-3xl font-black text-slate-900 animate-pulse">Verifying Admin Credentials...</h2>
      </div>
    )
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border-4 border-red-600 overflow-hidden text-center">
          <div className="bg-red-600 p-6 text-white">
            <h1 className="text-5xl font-black uppercase tracking-widest">🛑 Access Denied</h1>
          </div>
          <div className="p-10 space-y-6">
            <p className="text-2xl font-bold text-slate-900">
              Administrator Privileges Required
            </p>
            <div className="bg-slate-100 p-4 rounded-lg border-2 border-slate-300">
              <p className="text-sm font-bold text-slate-500 uppercase">Your Connected Wallet:</p>
              <p className="text-lg font-mono text-slate-900 break-all">{currentAccount}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg border-2 border-slate-300">
              <p className="text-sm font-bold text-slate-500 uppercase">Required Admin Wallet:</p>
              <p className="text-lg font-mono text-slate-900 break-all">{ownerAddress}</p>
            </div>
            <p className="text-slate-600 font-bold">
              Please switch to the Admin account in MetaMask to access this portal.
            </p>
            <button 
              onClick={() => router.push('/')} 
              className="mt-6 bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xl hover:bg-slate-800 transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] active:shadow-none active:translate-x-1 active:translate-y-1 uppercase"
            >
              ← Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-6 bg-white border-2 border-slate-900 px-4 py-2 rounded-lg font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
          ← EXIT TO DASHBOARD
        </button>

        <header className="mb-10 text-center">
          <div className="inline-block bg-green-100 border-2 border-green-600 text-green-800 px-4 py-1 rounded-full font-black text-sm uppercase mb-4 shadow-sm">
            ✓ Admin Verified
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">
            Role Registration <span className="text-blue-600 border-b-8 border-blue-600">Portal</span>
          </h1>
          <p className="text-slate-700 font-bold mt-4 text-xl">Authorize Supply Chain Participants</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. Supplier */}
          <div className="bg-white rounded-xl shadow-xl border-4 border-slate-900 overflow-hidden">
            <div className="bg-blue-600 p-4 text-white font-black text-xl uppercase tracking-widest text-center border-b-4 border-slate-900">1. Raw Material Supplier</div>
            <form onSubmit={handleAddRMS} className="p-6">
              <input className={inputStyle} placeholder="Ethereum Address (0x...)" value={rms.address} onChange={(e)=>setRms({...rms, address: e.target.value})} required />
              <input className={inputStyle} placeholder="Company Name" value={rms.name} onChange={(e)=>setRms({...rms, name: e.target.value})} required />
              <input className={inputStyle} placeholder="Location / GPS" value={rms.place} onChange={(e)=>setRms({...rms, place: e.target.value})} required />
              <button className={buttonStyle}>Authorize Supplier</button>
            </form>
          </div>

          {/* 2. Manufacturer */}
          <div className="bg-white rounded-xl shadow-xl border-4 border-slate-900 overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white font-black text-xl uppercase tracking-widest text-center border-b-4 border-slate-900">2. Manufacturer</div>
            <form onSubmit={handleAddMan} className="p-6">
              <input className={inputStyle} placeholder="Ethereum Address (0x...)" value={man.address} onChange={(e)=>setMan({...man, address: e.target.value})} required />
              <input className={inputStyle} placeholder="Company Name" value={man.name} onChange={(e)=>setMan({...man, name: e.target.value})} required />
              <input className={inputStyle} placeholder="Location / GPS" value={man.place} onChange={(e)=>setMan({...man, place: e.target.value})} required />
              <button className={buttonStyle}>Authorize Manufacturer</button>
            </form>
          </div>

          {/* 3. Distributor */}
          <div className="bg-white rounded-xl shadow-xl border-4 border-slate-900 overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white font-black text-xl uppercase tracking-widest text-center border-b-4 border-slate-900">3. Distributor</div>
            <form onSubmit={handleAddDis} className="p-6">
              <input className={inputStyle} placeholder="Ethereum Address (0x...)" value={dis.address} onChange={(e)=>setDis({...dis, address: e.target.value})} required />
              <input className={inputStyle} placeholder="Company Name" value={dis.name} onChange={(e)=>setDis({...dis, name: e.target.value})} required />
              <input className={inputStyle} placeholder="Location / GPS" value={dis.place} onChange={(e)=>setDis({...dis, place: e.target.value})} required />
              <button className={buttonStyle}>Authorize Distributor</button>
            </form>
          </div>

          {/* 4. Retailer */}
          <div className="bg-white rounded-xl shadow-xl border-4 border-slate-900 overflow-hidden">
            <div className="bg-amber-500 p-4 text-slate-900 font-black text-xl uppercase tracking-widest text-center border-b-4 border-slate-900">4. Retailer</div>
            <form onSubmit={handleAddRet} className="p-6">
              <input className={inputStyle} placeholder="Ethereum Address (0x...)" value={ret.address} onChange={(e)=>setRet({...ret, address: e.target.value})} required />
              <input className={inputStyle} placeholder="Company Name" value={ret.name} onChange={(e)=>setRet({...ret, name: e.target.value})} required />
              <input className={inputStyle} placeholder="Location / GPS" value={ret.place} onChange={(e)=>setRet({...ret, place: e.target.value})} required />
              <button className={buttonStyle}>Authorize Retailer</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}