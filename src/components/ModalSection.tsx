import React from "react";

export const ModalContent = ({ showModal, setShowModal, mode, setMode, selectedKarat, setSelectedKarat, weight, setWeight, result, setResult, calculatePrice, calculateSellPrice, goldRates, formatCurrency2 }: any) => {
  const [metalType, setMetalType] = React.useState<"gold" | "silver" | null>(null);
  const [modeSelected, setModeSelected] = React.useState(false);
  
  const calculateSilverPrice = () => {
    const ibjaRate = goldRates.find((r: any) => r.companyName === "IBJA");
    if (!ibjaRate || !weight) return;
    const rate = ibjaRate.silverprice;
    if (!rate) return;
    const weightNum = parseFloat(weight);
    const basePrice = rate * weightNum;
    const refining = basePrice * 0.05;
    const payable = basePrice - refining;
    setResult({ basePrice, refining, payable });
  };
  
  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] max-w-[95%] rounded-xl shadow-xl p-6 relative">
        <button onClick={() => { setShowModal(false); setResult(null); setWeight(""); setModeSelected(false); setMetalType(null); }} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          ✕
        </button>

        {!modeSelected ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Select  Type</h2>
            
            <div className="space-y-3">
              <button onClick={() => { setMode("buy"); setModeSelected(true); setMetalType("gold"); setResult(null); setWeight(""); }} className="w-full bg-white border-2 border-yellow-500 hover:bg-yellow-50 text-yellow-600 font-bold py-3 rounded-lg transition-colors text-base">
                Buy
              </button>
              <button onClick={() => { setMode("sell"); setModeSelected(true); setResult(null); setWeight(""); }} className="w-full bg-white border-2 border-yellow-500 hover:bg-yellow-50 text-yellow-600 font-bold py-3 rounded-lg transition-colors text-base">
                Sell
              </button>
            </div>
          </>
        ) : mode === "buy" ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center text-gray-900">Buy Gold</h2>

            {goldRates.find((r: any) => r.companyName === "IBJA") && (
              <div className="grid gap-3 mb-4 p-3 bg-amber-50 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">22K Gold</p>
                    <p className="text-base font-bold text-amber-700">{formatCurrency2(goldRates.find((r: any) => r.companyName === "IBJA")?.rate22kt || null)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">24K Gold</p>
                    <p className="text-base font-bold text-amber-700">{formatCurrency2(goldRates.find((r: any) => r.companyName === "IBJA")?.rate24kt || null)}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Select Karat</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSelectedKarat("22k")} className={`py-2 rounded-lg font-semibold text-sm ${selectedKarat === "22k" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                    22K
                  </button>
                  <button onClick={() => setSelectedKarat("24k")} className={`py-2 rounded-lg font-semibold text-sm ${selectedKarat === "24k" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                    24K
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Enter Weight (grams)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              
              <button onClick={calculatePrice} className={`w-full text-white font-semibold py-2 rounded-lg text-sm bg-amber-500 hover:bg-amber-600`}>
                Check Price
              </button>
              
              {result && (
                <div className={`p-3 rounded-lg space-y-2 text-sm bg-amber-50 border border-amber-200`}>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Gold Price:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency2(result.basePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Making (1.5%):</span>
                    <span className="font-semibold text-gray-900">{formatCurrency2(result.making)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">GST (3%):</span>
                    <span className="font-semibold text-gray-900">{formatCurrency2(result.gst)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-amber-700">{formatCurrency2(result.total)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={() => { setModeSelected(false); setMetalType(null); setResult(null); setWeight(""); }} className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors text-sm">
              Back
            </button>
          </>
        ) : !metalType ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Select Metal Type</h2>
            <p className="text-center text-gray-600 mb-6 text-sm">Choose Gold or Silver</p>
            
            <div className="space-y-3">
              <button onClick={() => { setMetalType("gold"); setResult(null); setWeight(""); }} className="w-full bg-white border-2 border-yellow-500 hover:bg-yellow-50 text-yellow-600 font-bold py-3 rounded-lg transition-colors text-base">
                Gold
              </button>
              <button onClick={() => { setMetalType("silver"); setResult(null); setWeight(""); }} className="w-full bg-white border-2 border-gray-400 hover:bg-gray-50 text-gray-600 font-bold py-3 rounded-lg transition-colors text-base">
                Silver
              </button>
            </div>
            
            <button onClick={() => { setModeSelected(false); setMetalType(null); }} className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors text-sm">
              Back
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center text-gray-900">Sell {metalType === "gold" ? "Gold" : "Silver"}</h2>

            {goldRates.find((r: any) => r.companyName === "IBJA") && (
              <div className="grid gap-3 mb-4 p-3 bg-amber-50 rounded-lg">
                {metalType === "gold" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">22K Gold</p>
                      <p className="text-base font-bold text-amber-700">{formatCurrency2(goldRates.find((r: any) => r.companyName === "IBJA")?.rate22kt || null)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">24K Gold</p>
                      <p className="text-base font-bold text-amber-700">{formatCurrency2(goldRates.find((r: any) => r.companyName === "IBJA")?.rate24kt || null)}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Silver Price</p>
                    <p className="text-base font-bold text-gray-700">{formatCurrency2(goldRates.find((r: any) => r.companyName === "IBJA")?.silverprice || null)}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-3">
              {metalType === "gold" && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Select Karat</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setSelectedKarat("22k")} className={`py-2 rounded-lg font-semibold text-sm ${selectedKarat === "22k" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                      22K
                    </button>
                    <button onClick={() => setSelectedKarat("24k")} className={`py-2 rounded-lg font-semibold text-sm ${selectedKarat === "24k" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                      24K
                    </button>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Enter Weight ({metalType === "gold" ? "grams" : "kg"})</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              
              <button onClick={metalType === "gold" ? calculateSellPrice : calculateSilverPrice} className={`w-full text-white font-semibold py-2 rounded-lg text-sm bg-amber-500 hover:bg-amber-600`}>
                Check Price
              </button>
              
              {result && (
                <div className={`p-3 rounded-lg space-y-2 text-sm bg-gray-50 border border-gray-200`}>
                  <div className="flex justify-between">
                    <span className="text-gray-700">{metalType === "gold" ? "Gold" : "Silver"} Price:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency2(result.basePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Refining ({metalType === "gold" ? "2%" : "5%"}):</span>
                    <span className="font-semibold text-red-600">-{formatCurrency2(result.refining)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Payable:</span>
                    <span className="text-gray-700">{formatCurrency2(result.payable)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={() => { setMetalType(null); setResult(null); setWeight(""); }} className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors text-sm">
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};
