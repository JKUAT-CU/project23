"use client"

import { useEffect, useState, useCallback } from "react"
import { Toaster, toast } from "react-hot-toast"
import { ContributionForm } from "@/components/ContributionForm"
import { TransactionTables } from "@/components/TransactionTables"
import { ProgressBar } from "@/components/ProgressBar"
import type { ApiResponse, ContributionFormData } from "@/types"
import { API_BASE_URL, PAYMENT_API_URL, CONTRIBUTION_TARGETS } from "@/constants"
import { CreditCard, RefreshCcw, Plus, AlertCircle } from "lucide-react"
import axios from "axios"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function App() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const amount = params.get("amount")
    const account = params.get("account")
    const name = params.get("name")

    if (amount && account) {
      setShowForm(true)
      // You'll need to pass these values to the ContributionForm component
    }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true)
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/publicity`)
      setData(response.data)
    } catch (error) {
      toast.error("Failed to fetch contribution data")
      console.error("Error fetching data:", error)
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleContribution = async (formData: ContributionFormData) => {
    try {
      await toast.promise(axios.post(PAYMENT_API_URL, formData), {
        loading: "Initiating payment...",
        success: "Check your phone to complete the payment",
        error: "Failed to initiate payment",
      })
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error("Error initiating payment:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Paybill Information */}
      <div className="bg-brand-maroon/10 border-b border-brand-maroon/20">
        <Alert className="max-w-7xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Use Paybill Number: <span className="font-bold">921961</span>. Account Number is shown next to each
            department name.
          </AlertDescription>
        </Alert>
      </div>

      {/* Header */}
      <header className="bg-brand-maroon text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-brand-brown mr-2 sm:mr-3" />
              <h1 className="text-xl sm:text-3xl font-bold">Contribution Tracker</h1>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <button
                onClick={() => fetchData()}
                disabled={refreshing}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-brand-green/80 rounded-md hover:bg-brand-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
              >
                <RefreshCcw className={`h-4 w-4 mr-1 sm:mr-2 ${refreshing ? "animate-spin" : ""}`} />
                <span className="sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-brand-brown rounded-md hover:bg-brand-brown/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown"
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span>Pay</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Progress Overview */}
        {data && (
          <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Contribution Progress</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full">
                <ProgressBar
                  current={data.GrandTotal}
                  target={CONTRIBUTION_TARGETS.total}
                  label="Overall Progress"
                  color="maroon"
                />
              </div>
              {Object.entries(data.AccountTotals).map(([department, total], index) => (
                <ProgressBar
                  key={department}
                  current={total}
                  target={CONTRIBUTION_TARGETS.departments[department] || 100000}
                  label={department}
                  color={index % 2 === 0 ? "brown" : "darkGreen"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 sm:gap-8">
          {/* Contribution Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Make Payment</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-500">
                    ×
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    <p className="mb-2">
                      Important: We prioritize your privacy and only collect essential payment information. No personal
                      data is stored beyond what's necessary for transaction verification.
                    </p>
                    <p>Please review your details carefully before entering your M-PESA PIN.</p>
                  </div>
                  <ContributionForm onSubmit={handleContribution} />
                </div>
              </div>
            </div>
          )}

          {/* Transaction Tables */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-maroon"></div>
            </div>
          ) : data ? (
            <TransactionTables
              accountTotals={data.AccountTotals}
              userTotals={data.UserTotals}
              transactions={data.Transactions}
              grandTotal={data.GrandTotal}
            />
          ) : (
            <div className="text-center text-gray-500">No data available</div>
          )}
        </div>
      </main>
    </div>
  )
}

