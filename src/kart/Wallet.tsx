import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import axios from 'axios';
import { Menu, X, Plus, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, ChevronRight } from 'lucide-react';
import BASE_URL from '../Config';

interface Transaction {
  id: string;
  walletTxType: 1 | 2 ;
  amount: number;
  refereedTo:number;
  date: string;
  method: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  walletTxAmount: number;
  walletTxDesc:string;
  createdAt:string;
  orderId:string;
  walletTxBalance:number;
  walletTxPurpose : number;
}

const MyWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 1 | 2 >('all');
  const [amount, setAmount] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction.walletTxType === activeTab;
  });

  useEffect(() => {
    getTransactions();
    setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
  }, []);

  const getTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(BASE_URL+'/order-service/customerWalletData', {
        customerId: localStorage.getItem("userId")
      });
      setTransactions(response.data.walletTransactions || []);
      setAmount(response.data.walletAmount || '0');
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

   

      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                <button 
                  onClick={() => navigate('/main/Subscription')}
                  className="inline-flex items-center justify-center px-4 py-2  bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Wallet Top-Up
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white shadow-xl transform hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="w-6 h-6" />
                    <h2 className="text-lg font-semibold">Available Balance</h2>
                  </div>
                  <p className="text-4xl font-bold mb-3">₹{amount.toLocaleString()}</p>
                  <div className="flex items-center text-purple-200 text-sm">
                    <div className="flex-1">Last updated: Today</div>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <p className="text-sm text-green-600 mb-1">Total Income</p>
                      <p className="text-xl font-bold text-green-700">
                        ₹{transactions
                          .filter(t => t.walletTxType === 1)
                          .reduce((sum, t) => sum +t.walletTxAmount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <p className="text-sm text-red-600 mb-1">Total Spent</p>
                      <p className="text-xl font-bold text-red-700">
                        ₹{transactions
                          .filter(t => t.walletTxType === 2)
                          .reduce((sum, t) => sum + t.walletTxAmount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
                
                <div className="flex gap-4 mb-6 border-b">
                  {(['all', 1, 2] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 px-1 capitalize transition-all ${
                        activeTab === tab
                          ? 'border-b-2 border-purple-600 text-purple-600 font-semibold'
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      {tab==='all' ? 'All' : tab === 1 ? 'Credit' : 'Debit'}
                    </button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No transactions found
                      </div>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <div 
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${
                              transaction.walletTxType === 1 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.walletTxType === 1 
                                ? <ArrowUpRight className="w-5 h-5" />
                                : <ArrowDownRight className="w-5 h-5" />
                              }
                            </div>
                            <div>
                              <p className="font-semibold text-gray-600 mb-1 w-1/1"> {transaction.walletTxType === 1 ? transaction.walletTxPurpose === 2 ? `Order ID : #${transaction.orderId}` : transaction.walletTxPurpose === 3? "Subscription" :`Refereed To : #${transaction.refereedTo}`:"Debit"}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.createdAt).toLocaleDateString()} • {transaction.walletTxDesc}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.walletTxType === 1 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {/* {transaction.type === '1' ? '+' : '-'} */}
                              ₹{transaction.walletTxAmount}
                            </p>
                            {/* <span className={`text-xs px-2 py-1 rounded-full
                             ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-700'
                                : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }
                            `}
                            >
                              {transaction.walletTxBalance}
                            </span> */}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyWalletPage;