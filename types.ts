
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  currency: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}

export const CATEGORIES = {
  INCOME: ['薪資', '獎金', '投資回報', '租金收入', '其他收入'],
  EXPENSE: ['飲食', '交通', '購物', '娛樂', '居住', '醫療', '教育', '保險', '稅金', '其他支出']
};
