"use client"

import type React from "react"
import { useState } from "react"
import { PhoneCall, CreditCard, User, Banknote } from "lucide-react"
import { ACCOUNT_MAPPING } from "@/constants"
import type { ContributionFormData } from "@/types"

interface ContributionFormProps {
  onSubmit: (data: ContributionFormData) => void
}

export const ContributionForm: React.FC<ContributionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContributionFormData>({
    phone: "",
    amount: 0,
    account_reference: "",
    customName: "",
  })
  const [useCustomName, setUseCustomName] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalAccountReference = formData.customName
      ? `${formData.account_reference}#${formData.customName}`
      : formData.account_reference

    onSubmit({
      ...formData,
      account_reference: finalAccountReference,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <div className="relative">
          <PhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="tel"
            required
            pattern="^254[0-9]{9}$"
            placeholder="254XXXXXXXXX"
            className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
        <div className="relative">
          <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="number"
            required
            min="1"
            step="1"
            placeholder="Enter amount"
            className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.amount || ""}
            onChange={(e) => setFormData({ ...formData, amount: Number.parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            required
            className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.account_reference}
            onChange={(e) => setFormData({ ...formData, account_reference: e.target.value })}
          >
            <option value="">Select Account</option>
            {Object.entries(ACCOUNT_MAPPING).map(([key, value]) => (
              <option key={key} value={key}>
                {value} ({key})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="useCustomName"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={useCustomName}
          onChange={(e) => setUseCustomName(e.target.checked)}
        />
        <label htmlFor="useCustomName" className="ml-2 block text-sm text-gray-700">
          Add custom name
        </label>
      </div>

      {useCustomName && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              required
              placeholder="Enter your name"
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.customName}
              onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-brand-maroon text-white py-2 px-4 rounded-md hover:bg-brand-maroon/90 transition duration-200"
      >
        Make Payment
      </button>
    </form>
  )
}

