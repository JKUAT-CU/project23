"use client"

import type React from "react"
import { useState } from "react"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import type { AccountTotals, Transaction, UserTotals } from "@/types"
import { ACCOUNT_MAPPING } from "@/constants"
import { isAfterDate, formatTransactionDate } from "@/utils/date"
import { ShareButton } from "@/components/ShareButton"

interface TransactionTablesProps {
  accountTotals: AccountTotals
  userTotals: UserTotals
  transactions: Transaction[]
  grandTotal: number
}

export const TransactionTables: React.FC<TransactionTablesProps> = ({
  accountTotals,
  userTotals,
  transactions,
  grandTotal,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedUsers, setExpandedUsers] = useState<{ [key: string]: boolean }>({})

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount)
  }

  // Filter departments based on search
  const filteredDepartments = Object.entries(accountTotals).filter(([department]) => {
    const searchLower = searchTerm.toLowerCase()

    // Search in department name
    if (department.toLowerCase().includes(searchLower)) return true

    // Search in usernames
    const departmentUsers = userTotals[department] || {}
    return Object.keys(departmentUsers).some((username) => username.toLowerCase().includes(searchLower))
  })

  const toggleUserExpansion = (department: string) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [department]: !prev[department],
    }))
  }

  const renderUserList = (department: string, users: { [username: string]: number }) => {
    const userEntries = Object.entries(users)
    const isExpanded = expandedUsers[department]
    const displayUsers = isExpanded ? userEntries : userEntries.slice(0, 5)
    const hasMore = userEntries.length > 5

    return (
      <div className="pl-6 py-2 space-y-2 bg-gray-50">
        {displayUsers.map(([username, amount]) => (
          <div key={`${department}-${username}`} className="flex justify-between items-center text-sm px-4 py-1.5">
            <span className="text-gray-600">{username}</span>
            <span className="text-gray-700 font-medium">{formatAmount(amount)}</span>
          </div>
        ))}
        {hasMore && (
          <button
            onClick={() => toggleUserExpansion(department)}
            className="w-full text-sm text-brand-maroon hover:text-brand-maroon/80 flex items-center justify-center py-2 mt-1 border-t border-gray-200"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More ({userEntries.length - 5} more)
              </>
            )}
          </button>
        )}
      </div>
    )
  }

  // Filter transactions after Nov 5, 2024 and sort by most recent
  const filteredTransactions = transactions
    .filter((trans) => isAfterDate(trans.TransTime, "2024-11-05"))
    .sort((a, b) => b.TransTime.localeCompare(a.TransTime))
    .slice(0, 20)

  const getAccountNumber = (departmentName: string): string => {
    return Object.entries(ACCOUNT_MAPPING).find(([_, value]) => value === departmentName)?.[0] || "N/A"
  }

  return (
    <div className="space-y-8">
      {/* Department Totals Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-brand-maroon text-white">
          <h2 className="text-xl font-semibold mb-4">Department Totals</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
            <input
              type="text"
              placeholder="Search departments or contributors..."
              className="w-full pl-10 p-2 rounded-md bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDepartments.map(([department, total]) => (
            <div key={department} className="bg-white">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-0">
                  <h3 className="text-lg font-medium text-gray-900">{department}</h3>
                  <span className="text-sm text-gray-500">(Account: {getAccountNumber(department)})</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShareButton
                    data={{
                      amount: 0,
                      account_reference: getAccountNumber(department),
                    }}
                  />
                  <span className="text-lg font-semibold text-brand-maroon">{formatAmount(total)}</span>
                </div>
              </div>
              {userTotals[department] && renderUserList(department, userTotals[department])}
            </div>
          ))}
          <div className="bg-brand-maroon/5 px-6 py-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Grand Total</span>
            <span className="text-lg font-bold text-brand-maroon">{formatAmount(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-brand-brown text-white">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full divide-y divide-gray-200">
            {/* Mobile view */}
            <div className="sm:hidden">
              {filteredTransactions.map((transaction, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{transaction.DepartmentName}</span>
                    <span className="text-sm font-semibold text-brand-maroon">
                      {formatAmount(transaction.TransAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{transaction.UserName}</span>
                    <span>{formatTransactionDate(transaction.TransTime)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view */}
            <table className="hidden sm:table min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contributor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTransactionDate(transaction.TransTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.DepartmentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.UserName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatAmount(transaction.TransAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

