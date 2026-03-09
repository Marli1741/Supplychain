'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadWeb3, getContract } from '@/lib/web3'

interface Medicine {
  id: string
  name: string
  description: string
  stage: string
  gpsCoordinates: string
}

export default function Track() {
  const router = useRouter()
  const [med, setMed] = useState<{ [key: number]: Medicine }>({})
  const [medStage, setMedStage] = useState<{ [key: number]: string }>({})
  const [id, setId] = useState('')
  const [trackedItem, setTrackedItem] = useState<Medicine | null>(null)

  useEffect(() => {
    loadWeb3()
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { contract } = await getContract()
      const medCtrData = await contract.methods.medicineCtr().call()
      const medCtr = Number(medCtrData)

      const medData: { [key: number]: Medicine } = {}
      const stageData: { [key: number]: string } = {}

      const stageNames = [
        "Init", 
        "Raw Material Supply", 
        "Manufacture", 
        "Distribution", 
        "Retail", 
        "Sold"
      ]

      for (let i = 0; i < medCtr; i++) {
        const item = (await contract.methods.MedicineStock(i + 1).call()) as any
        medData[i + 1] = item
        stageData[i + 1] = stageNames[Number(item.stage)]
      }

      setMed(medData)
      setMedStage(stageData)
    } catch (err) {
      console.error("Error loading tracking data:", err)
    }
  }

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedId = parseInt(id)
    if (med[parsedId]) {
      setTrackedItem(med[parsedId])
    } else {
      alert("Product ID not found on the blockchain. Please check the ID and try again.")
      setTrackedItem(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => router.push('/')} 
          className="mb-8 bg-white border-2 border-slate-900 px-4 py-2 rounded-lg font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          ← EXIT TO DASHBOARD
        </button>
        
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-4 border-slate-900">
          <header className="mb-10 border-b-4 border-slate-900 pb-6">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">
              Track <span className="text-blue-600">Product</span>
            </h1>
            <p className="text-slate-700 font-bold mt-2 text-xl">Enter a Product ID to view its verified blockchain history.</p>
          </header>
          
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-10">
            <input 
              className="flex-1 border-4 border-slate-200 bg-slate-50 p-4 rounded-xl text-xl font-black text-slate-900 focus:border-slate-900 outline-none transition-all placeholder:text-slate-400" 
              placeholder="Search Product ID (e.g. 1)" 
              value={id} 
              onChange={(e) => setId(e.target.value)} 
              required
            />
            <button className="bg-blue-600 text-white px-10 rounded-xl font-black text-xl hover:bg-blue-700 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 active:shadow-none active:translate-x-1 active:translate-y-1 uppercase tracking-widest transition-all">
              TRACK
            </button>
          </form>

          {trackedItem && (
            <div className="bg-slate-50 p-8 rounded-xl border-4 border-slate-900 shadow-inner">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-4xl font-black text-slate-900 uppercase">
                  {trackedItem.name}
                </h2>
                <span className="bg-green-300 text-green-900 px-6 py-2 rounded-lg font-black text-sm uppercase tracking-widest border-2 border-green-600 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)]">
                  {medStage[parseInt(id)] || "Unknown Stage"}
                </span>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-slate-500 font-black text-sm uppercase tracking-widest mb-1 border-b-2 border-slate-200 pb-1 inline-block">Product Description</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">{trackedItem.description}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                  <p className="text-blue-600 font-black text-sm uppercase tracking-widest mb-3 mt-2">Verified Blockchain GPS Coordinates</p>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl bg-blue-100 p-3 rounded-lg border-2 border-blue-300">📍</span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight font-mono break-all">
                      {trackedItem.gpsCoordinates || "No GPS Recorded"}
                    </p>
                  </div>
                  
                  {trackedItem.gpsCoordinates && trackedItem.gpsCoordinates !== "Origin: Factory HQ" && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trackedItem.gpsCoordinates)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-black text-sm hover:bg-slate-800 transition-colors uppercase tracking-wider"
                    >
                      View On Live Map →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}