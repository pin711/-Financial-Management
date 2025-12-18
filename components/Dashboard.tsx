
import React from 'react';
import { BankAccount, Transaction, TransactionType } from '../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthIncome = transactions
    .filter(t => t.type === TransactionType.INCOME && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  // Chart Data: Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME && new Date(t.date).toDateString() === d.toDateString())
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date).toDateString() === d.toDateString())
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: label, 收入: income, 支出: expense };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">總覽儀表板</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">總資產</p>
            <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center">
          <div className="p-3 bg-green-100 rounded-xl mr-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">本月收入</p>
            <p className="text-2xl font-bold text-green-600">+${monthIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center">
          <div className="p-3 bg-red-100 rounded-xl mr-4">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">本月支出</p>
            <p className="text-2xl font-bold text-red-600">-${monthExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">近 7 日收支統計</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="收入" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">最近交易</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).sort((a,b) => b.date - a.date).map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${t.type === TransactionType.INCOME ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {t.type === TransactionType.INCOME ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t.category}</p>
                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                </p>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-center text-gray-400 py-8">目前尚無交易紀錄</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
