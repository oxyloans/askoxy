import React, { useState } from 'react';
import { Check, X, HelpCircle, Package, Wheat, Tag, Lightbulb, ChevronDown, Sparkles, Receipt } from 'lucide-react';

interface FAQItemProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface TableRow {
  type: string;
  gstRate: string;
  highlight?: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({ icon, title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 md:px-6 md:py-5 flex items-center justify-between text-left hover:bg-purple-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-purple-600">{icon}</div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-purple-600 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 md:px-6 md:pb-6 animate-in slide-in-from-top duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const GSTRiceFAQ: React.FC = () => {
  const tableData: TableRow[] = [
    { type: 'Loose rice (no pack/brand)', gstRate: '0%' },
    { type: 'Packed but unbranded', gstRate: '0%' },
    { type: 'Packed with brand/trademark', gstRate: '5%', highlight: true },
    { type: 'Bags above 25kg (any type)', gstRate: '0%' },
  ];

  const askOxyBenefits = [
    { icon: <Sparkles className="w-5 h-5" />, text: "Premium quality rice at 0% GST where applicable" },
    { icon: <Package className="w-5 h-5" />, text: "All our 26kg+ rice bags are GST-exempt" },
    { icon: <Receipt className="w-5 h-5" />, text: "Clear GST status indication on every invoice" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <span className="text-3xl md:text-4xl">🧾</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              GST on Rice
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
              Everything you need to know about GST rates on rice products
            </p>
          </div>
        </div>
      </header>

      {/* Quick Summary Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <Check className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold text-gray-900">0% GST</h3>
            </div>
            <p className="text-sm text-gray-600">Unbranded rice & bulk purchases (26kg+)</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
            <div className="flex items-center gap-3 mb-2">
              <X className="w-6 h-6 text-red-500" />
              <h3 className="font-semibold text-gray-900">5% GST</h3>
            </div>
            <p className="text-sm text-gray-600">Branded rice packages under 25kg</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h3 className="font-semibold text-gray-900">AskOxy Promise</h3>
            </div>
            <p className="text-sm text-gray-600">Best quality at lowest applicable GST</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-6">
          
          {/* What is GST Section */}
          <FAQItem 
            icon={<HelpCircle className="w-6 h-6" />}
            title="What is GST?"
            defaultOpen={true}
          >
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-purple-800">Goods and Services Tax (GST)</strong> is a comprehensive indirect tax on manufacture, sale and consumption of goods and services throughout India. It replaced multiple cascading taxes levied by the central and state governments.
              </p>
            </div>
          </FAQItem>

          {/* Is GST applicable on rice Section */}
          <FAQItem 
            icon={<Wheat className="w-6 h-6" />}
            title="Is GST applicable on rice?"
          >
            <div className="pl-4 md:pl-6">
              <p className="text-gray-700 text-lg">
                Yes, but with <strong className="text-purple-700">specific exemptions and conditions</strong> based on packaging and quantity.
              </p>
            </div>
          </FAQItem>

          {/* GST on 1-25 Kgs Section */}
          <FAQItem 
            icon={<Package className="w-6 h-6" />}
            title="GST on rice bags (1-25 Kgs)"
          >
            <div className="space-y-4 pl-4 md:pl-6">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Check className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong className="text-green-800">No GST</strong> if the rice is unbranded and sold loose or without trademarked packaging.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Check className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong className="text-green-800">No GST</strong> if sold in non-registered brand names or generic packaging.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <X className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-gray-700">
                  <p><strong className="text-red-800">5% GST</strong> applies if:</p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>The rice is packed and</li>
                    <li>Sold under a registered brand (with trademark)</li>
                  </ul>
                </div>
              </div>
            </div>
          </FAQItem>

          {/* GST on 26 Kgs+ Section */}
          <FAQItem 
            icon={<span className="text-2xl">🧺</span>}
            title="GST on bulk rice (26 Kgs+)"
          >
            <div className="space-y-4 pl-4 md:pl-6">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Check className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <strong className="text-green-800">No GST</strong> on bags of 
                  <span className="text-purple-700 font-bold mx-1">26 Kgs or more</span>, 
                  even if branded and packed.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Note:</strong> Bulk quantities are considered for industrial or commercial consumption and are tax-exempt.
                </p>
              </div>
            </div>
          </FAQItem>

          {/* Comparison Table */}
          <FAQItem 
            icon={<Tag className="w-6 h-6" />}
            title="GST Rate Comparison Chart"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <th className="p-4 text-left font-medium">Rice Type</th>
                    <th className="p-4 text-left font-medium">GST Rate</th>
                    <th className="p-4 text-left font-medium hidden md:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="p-4">
                        {row.highlight ? (
                          <>
                            Packed with <span className="text-purple-700 font-bold">brand/trademark</span>
                          </>
                        ) : row.type.includes('unbranded') ? (
                          <>
                            Packed but <strong>unbranded</strong>
                          </>
                        ) : row.type.includes('above 25kg') ? (
                          <>
                            Bags <strong>above 25kg</strong> (any type)
                          </>
                        ) : (
                          row.type
                        )}
                      </td>
                      <td className="p-4 font-semibold">
                        <span className={row.gstRate === '0%' ? 'text-green-600' : 'text-red-600'}>
                          {row.gstRate}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {row.gstRate === '0%' ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <Check className="w-4 h-4" />
                            Tax Free
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <X className="w-4 h-4" />
                            Taxable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FAQItem>

          {/* AskOxy Section */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                AskOxy.ai Advantage
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {askOxyBenefits.map((benefit, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <p className="text-white/90">{benefit.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 AskOxy.ai - Making rice shopping simple and transparent</p>
        </div>
      </footer>
    </div>
  );
};

export default GSTRiceFAQ;