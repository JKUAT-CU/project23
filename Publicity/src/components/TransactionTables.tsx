// Update the import to use the constant from constants.ts
import { ACCOUNT_MAPPING } from "../constants"

// Remove the local ACCOUNT_MAPPING constant and use the imported one

// In the render method, update how we find the account number:
const getAccountNumber = (departmentName: string): string => {
  return Object.entries(ACCOUNT_MAPPING).find(([key, value]) => value === departmentName)?.[0] || "N/A"
}

// Then in the JSX where we show the account number:
;(<span className="text-sm text-gray-500">(Account: {getAccountNumber(department)})</span>) <
  // And in the ShareButton:
  ShareButton
\
  data=
{
  amount: 0, account_reference
  : getAccountNumber(department)
}
;/>

