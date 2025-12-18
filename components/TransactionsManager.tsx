
import React, { useState } from 'react';
import { BankAccount, Transaction, TransactionType, CATEGORIES } from '../types';
import { Plus, Trash2, Filter, Search } from 'lucide-react';

interface TransactionsManagerProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const TransactionsManager: React.FC<TransactionsManagerProps> = ({ accounts, transactions, setTransactions }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');

  const [formData, setFormData] = useState({
    accountId: accounts[0]?.id || '',
    amount: 0,
    type: TransactionType.EXPENSE,
    category: CATEGORIES.EXPENSE[0],
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date).getTime()
    };
    setTransactions(prev => [newTx, ...prev]);
    setShowModal(false);
    setFormData({ ...formData, amount: 0, note: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除這筆紀錄嗎？')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const filtered = transactions
    .filter(t => filterType === 'ALL' || t.type === filterType)
    .filter(t => t.note.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">收支明細紀錄</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-1" />
          新增紀錄
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋備註或分類..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="ALL">全部類型</option>
            <option value={TransactionType.INCOME}>僅收入</option>
            <option value={TransactionType.EXPENSE}>僅支出</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">日期</th>
              <th className="px-6 py-4">帳戶</th>
              <th className="px-6 py-4">分類</th>
              <th className="px-6 py-4">備註</th>
              <th className="px-6 py-4 text-right">金額</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(t => {
              const account = accounts.find(a => a.id === t.accountId);
              return (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                      {account?.name || '未知帳戶'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{t.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.note}</td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(t.id)} className="p-2 text-gray-300 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center py-12 text-gray-400">目前沒有交易紀錄</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">新增收支紀錄</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">交易日期</label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
                  <select 
                    className="w-full p-2 border rounded-lg outline-none"
                    value={formData.type}
                    onChange={(e) => {
                      const type = e.target.value as TransactionType;
                      setFormData({ ...formData, type, category: CATEGORIES[type][0] });
                    }}
                  >
                    <option value={TransactionType.EXPENSE}>支出</option>
                    <option value={TransactionType.INCOME}>收入</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分類</label>
                  <select 
                    className="w-full p-2 border rounded-lg outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES[formData.type].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">對應帳戶</label>
                <select 
                  className="w-full p-2 border rounded-lg outline-none"
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                >
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.bankName})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">備註</label>
                <textarea
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  placeholder="簡單紀錄一下吧..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsManager;
