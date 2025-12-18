
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isOfflineMode } from './firebase';
import AuthScreen from './components/AuthScreen';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import AccountsManager from './components/AccountsManager';
import TransactionsManager from './components/TransactionsManager';
import Reports from './components/Reports';
import { BankAccount, Transaction } from './types';

export enum View {
  DASHBOARD = 'DASHBOARD',
  ACCOUNTS = 'ACCOUNTS',
  TRANSACTIONS = 'TRANSACTIONS',
  REPORTS = 'REPORTS'
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!isOfflineMode);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  
  // App State
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Sample Data (only if needed)
  useEffect(() => {
    if (isOfflineMode || (user && accounts.length === 0)) {
      const savedAccounts = localStorage.getItem('demo_accounts');
      const savedTransactions = localStorage.getItem('demo_transactions');
      
      if (savedAccounts && savedTransactions) {
        setAccounts(JSON.parse(savedAccounts));
        setTransactions(JSON.parse(savedTransactions));
      } else {
        const initialAccounts: BankAccount[] = [
          { id: '1', name: '主要帳戶', bankName: '國泰世華', balance: 50000, currency: 'TWD', createdAt: Date.now() },
          { id: '2', name: '儲蓄帳戶', bankName: '玉山銀行', balance: 120000, currency: 'TWD', createdAt: Date.now() }
        ];
        const initialTransactions: Transaction[] = [
          { id: 't1', accountId: '1', amount: 35000, type: 'INCOME' as any, category: '薪資', note: '10月薪水', date: Date.now() - 86400000 },
          { id: 't2', accountId: '1', amount: 150, type: 'EXPENSE' as any, category: '飲食', note: '午餐', date: Date.now() }
        ];
        setAccounts(initialAccounts);
        setTransactions(initialTransactions);
      }
    }
  }, [user, isOfflineMode]);

  useEffect(() => {
    localStorage.setItem('demo_accounts', JSON.stringify(accounts));
    localStorage.setItem('demo_transactions', JSON.stringify(transactions));
  }, [accounts, transactions]);

  useEffect(() => {
    if (isOfflineMode) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user && !isOfflineMode) {
    return <AuthScreen onDemoMode={() => setUser({ uid: 'demo', email: 'demo@example.com' } as any)} />;
  }

  return (
    <MainLayout currentView={currentView} setCurrentView={setCurrentView} user={user}>
      {currentView === View.DASHBOARD && <Dashboard accounts={accounts} transactions={transactions} />}
      {currentView === View.ACCOUNTS && <AccountsManager accounts={accounts} setAccounts={setAccounts} />}
      {currentView === View.TRANSACTIONS && <TransactionsManager accounts={accounts} transactions={transactions} setTransactions={setTransactions} />}
      {currentView === View.REPORTS && <Reports accounts={accounts} transactions={transactions} />}
    </MainLayout>
  );
};

export default App;
