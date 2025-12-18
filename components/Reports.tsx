
import React, { useState, useEffect } from 'react';
import { BankAccount, Transaction, TransactionType } from '../types';
import { getFinancialAdvice } from '../geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BrainCircuit, Sparkles, Loader2 } from 'lucide-react';

interface ReportsProps {
  accounts: BankAccount[];
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'];

const Reports: React.FC<ReportsProps> = ({ accounts, transactions }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Group expenses by category
  const expenseByCategory = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  })).sort((a,b) => b.value - a.value);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    const topCategories = pieData.slice(0, 3).map(d => `${d.name}: $${d.value}`).join(', ');
    const summary = `
      總收入：$${totalIncome}
      總支出：$${totalExpense}
      淨儲蓄：$${totalIncome - totalExpense}
      前三大支出類別：${topCategories}
      帳戶總數：${accounts.length}
    `;
    const res = await getFinancialAdvice(summary);
    setAdvice(res);
    setLoadingAdvice(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold">財務分析報告</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 w-full text-left">支出類別佔比</h3>
          {pieData.length > 0 ? (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400 italic">目前無支出資料可供分析</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" />
              AI 理財建議
            </h3>
            <button 
              onClick={handleGetAdvice}
              disabled={loadingAdvice}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loadingAdvice ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              生成分析
            </button>
          </div>
          
          <div className="flex-1 bg-purple-50 rounded-xl p-4 overflow-y-auto max-h-80">
            {advice ? (
              <div className="prose prose-sm text-gray-700 whitespace-pre-line">
                {advice}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-8">
                <BrainCircuit className="w-12 h-12 mb-2 opacity-20" />
                <p>點擊上方按鈕，讓 AI 為您的財務狀況提供專業建議</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-6">類別明細</h3>
        <div className="space-y-4">
          {pieData.map((item, idx) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  {item.name}
                </span>
                <span>${item.value.toLocaleString()} ({Math.round((item.value/totalExpense)*100)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${(item.value/totalExpense)*100}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
