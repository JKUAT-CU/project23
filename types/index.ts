export interface AccountMapping {
  [key: string]: string
}

export interface Transaction {
  DepartmentName: string
  BillRefNumber: string
  UserName: string
  TransAmount: number
  TransTime: string
}

export interface AccountTotals {
  [department: string]: number
}

export interface UserTotals {
  [department: string]: {
    [username: string]: number
  }
}

export interface ApiResponse {
  Transactions: Transaction[]
  AccountTotals: AccountTotals
  UserTotals: UserTotals
  GrandTotal: number
}

export interface ContributionFormData {
  phone: string
  amount: number
  account_reference: string
  customName?: string
}

export interface ShareData {
  phone?: string
  amount: number
  account_reference: string
  customName?: string
}

