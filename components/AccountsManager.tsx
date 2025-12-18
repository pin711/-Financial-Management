
import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Plus, Edit2, Trash2, X, Wallet } from 'lucide-react';

interface AccountsManagerProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const AccountsManager: React.FC<AccountsManagerProps> = ({ accounts, setAccounts }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    balance: 0,
    currency: 'TWD'
  });

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormData({ name: '', bankName: '', balance: 0, currency: 'TWD' });
    setShowModal(true);
  };

  const handleOpenEdit = (acc: BankAccount) => {
    setEditingAccount(acc);
    setFormData({ name: acc.name, bankName: acc.bankName, balance: acc.balance, currency: acc.currency });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此帳戶嗎？相關紀錄將會失去關聯。')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...formData } : a));
    } else {
      const newAcc: BankAccount = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: Date.now()
      };
      setAccounts(prev => [...prev, newAcc]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">銀行帳戶管理</h2>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-1" />
          新增帳戶
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white p-6 rounded-2xl border shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleOpenEdit(acc)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(acc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{acc.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{acc.bankName}</p>
            <div className="flex items-baseline">
              <span className="text-xs font-medium text-gray-400 mr-1">{acc.currency}</span>
              <span className="text-3xl font-extrabold text-gray-900">${acc.balance.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingAccount ? '編輯帳戶' : '新增帳戶'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">帳戶名稱</label>
                <input
                  type="text"
                  required
                  placeholder="例如：生活費帳戶"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">銀行名稱</label>
                <input
                  type="text"
                  required
                  placeholder="例如：國泰世華"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">初始餘額</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4"
              >
                {editingAccount ? '更新帳戶' : '確認新增'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsManager;
