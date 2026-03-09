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

export default function Supply() {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState('')
  const [loader, setLoader] = useState(true)
  const [supplyChain, setSupplyChain] = useState<any>(null)
  const [med, setMed] = useState<{ [key: number]: Medicine }>({})
  const [medStage, setMedStage] = useState<string[]>([])
  
  const [rmsId, setRmsId] = useState('')
  const [manId, setManId] = useState('')
  const [disId, setDisId] = useState('')
  const [retId, setRetId] = useState('')
  const [soldId, setSoldId] = useState('')

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

const loadBlockchainData = async () => {
    try {
      setLoader(true)
      const { contract, account } = await getContract()
      setSupplyChain(contract)
      setCurrentAccount(account)

      const medCtrData = await contract.methods.medicineCtr().call()
      const medCtr = Number(medCtrData)

      const medData: { [key: number]: Medicine } = {}
      const medStageData: string[] = []

      const stageNames = [
        "Init", 
        "Raw Material Supply", 
        "Manufacture", 
        "Distribution", 
        "Retail", 
        "Sold"
      ]

      for (let i = 0; i < medCtr; i++) {
const item = (await contract.methods.MedicineStock(i + 1).call()) as any;
        medData[i + 1] = item
        // Converting the blockchain integer (0, 1, 2) into the correct string
        medStageData[i + 1] = stageNames[Number(item.stage)]
      }

      setMed(medData)
      setMedStage(medStageData)
      setLoader(false)
    } catch (err: any) {
      console.error("Blockchain load error:", err)
      setLoader(false)
    }
  }

  const getGPS = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported")
        resolve("Unknown Location")
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(4)
            const long = position.coords.longitude.toFixed(4)
            resolve(`${lat}, ${long}`)
          },
          () => {
            alert("Location access denied")
            resolve("GPS Error")
          }
        )
      }
    })
  }

const handlerSubmitRMSsupply = async (e: React.FormEvent) => {
    e.preventDefault(); try { const loc = await getGPS(); await supplyChain.methods.RMSsupply(Number(rmsId), loc).send({ from: currentAccount }); loadBlockchainData(); setRmsId(''); } catch(err) { console.error(err); alert("Failed"); }
  }
  const handlerSubmitManufacturing = async (e: React.FormEvent) => {
    e.preventDefault(); try { const loc = await getGPS(); await supplyChain.methods.Manufacturing(Number(manId), loc).send({ from: currentAccount }); loadBlockchainData(); setManId(''); } catch(err) { console.error(err); alert("Failed"); }
  }
  const handlerSubmitDistribute = async (e: React.FormEvent) => {
    e.preventDefault(); try { const loc = await getGPS(); await supplyChain.methods.Distribute(Number(disId), loc).send({ from: currentAccount }); loadBlockchainData(); setDisId(''); } catch(err) { console.error(err); alert("Failed"); }
  }
  const handlerSubmitRetail = async (e: React.FormEvent) => {
    e.preventDefault(); try { const loc = await getGPS(); await supplyChain.methods.Retail(Number(retId), loc).send({ from: currentAccount }); loadBlockchainData(); setRetId(''); } catch(err) { console.error(err); alert("Failed"); }
  }
  const handlerSubmitSold = async (e: React.FormEvent) => {
    e.preventDefault(); try { const loc = await getGPS(); await supplyChain.methods.sold(Number(soldId), loc).send({ from: currentAccount }); loadBlockchainData(); setSoldId(''); } catch(err) { console.error(err); alert("Failed"); }
  }

  if (loader) return <div className="p-10 text-center font-black text-2xl text-slate-900">Syncing with Blockchain...</div>

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        <button 
          onClick={() => router.push('/')} 
          className="mb-6 bg-white border-2 border-slate-900 px-4 py-2 rounded-lg font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          ← EXIT TO DASHBOARD
        </button>
        <header className="mb-10">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Supply Chain <span className="text-blue-600">Operations</span>
          </h1>
          <p className="text-slate-600 font-bold mt-2 text-lg italic">Update product stages and capture hardware telemetry.</p>
        </header>
        
        {/* INVENTORY TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border-4 border-slate-900">
          <div className="bg-slate-900 px-6 py-4">
            <h2 className="text-xl font-black text-white uppercase tracking-widest text-center">Live Supply Chain Ledger</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-200 border-b-4 border-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-900 uppercase">GPS Node</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-900 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200">
                {Object.keys(med).map((key) => {
                  const index = parseInt(key)
                  return (
                    <tr key={key} className="hover:bg-blue-50 bg-white">
                      <td className="px-6 py-4 text-lg font-black text-slate-900">{med[index].id}</td>
                      <td className="px-6 py-4 text-base font-bold text-slate-800">{med[index].name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 italic">{med[index].description}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-blue-100 text-blue-900 px-3 py-1 rounded-md border-2 border-blue-300 font-black">
                          📍 {med[index].gpsCoordinates || "NOT_LOGGED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-4 py-1 bg-green-200 text-green-900 font-black rounded-lg text-xs border-2 border-green-400">
                          {medStage[index]}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* INPUT FORMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { label: '1. Raw Material Supply', state: rmsId, setState: setRmsId, handler: handlerSubmitRMSsupply, color: 'bg-blue-500' },
              { label: '2. Manufacture', state: manId, setState: setManId, handler: handlerSubmitManufacturing, color: 'bg-emerald-500' },
              { label: '3. Distribute', state: disId, setState: setDisId, handler: handlerSubmitDistribute, color: 'bg-indigo-500' },
              { label: '4. Retail', state: retId, setState: setRetId, handler: handlerSubmitRetail, color: 'bg-amber-500' },
              { label: '5. Mark Sold', state: soldId, setState: setSoldId, handler: handlerSubmitSold, color: 'bg-rose-500' }
            ].map((form, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border-2 border-slate-900 overflow-hidden transform hover:-translate-y-1 transition-transform">
                <div className={`${form.color} p-3 text-white font-black text-sm uppercase tracking-wider text-center`}>
                  {form.label}
                </div>
                <form onSubmit={form.handler} className="p-6 flex flex-col gap-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-tighter">Enter Blockchain Product ID</label>
                  <input 
                    className="w-full p-4 border-4 border-slate-100 bg-slate-50 rounded-xl text-slate-900 font-black text-xl focus:border-slate-900 outline-none transition-all" 
                    placeholder="e.g. 1" 
                    onChange={(e)=>form.setState(e.target.value)} 
                    value={form.state} 
                  />
                  <button className="bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1">
                    EXECUTE UPDATE
                  </button>
                </form>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}