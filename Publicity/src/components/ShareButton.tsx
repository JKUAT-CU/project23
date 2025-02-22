import type React from "react"
import { Share2 } from "lucide-react"
import type { ShareData } from "../types"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"

interface ShareButtonProps {
  data: ShareData
}

export const ShareButton: React.FC<ShareButtonProps> = ({ data }) => {
  const generateShareImage = async () => {
    const template = document.createElement("div")
    template.innerHTML = `
      <div style="
        width: 600px;
        height: 315px;
        background: linear-gradient(135deg, #800000 0%, #f7a306 100%);
        padding: 20px;
        color: white;
        font-family: system-ui;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      ">
        <h2 style="margin: 0 0 10px 0; font-size: 24px;">JKUAT CU Contribution</h2>
        <p style="margin: 5px 0; font-size: 18px;">Amount: KES ${data.amount}</p>
        <p style="margin: 5px 0; font-size: 18px;">Account: ${data.account_reference}</p>
        ${data.customName ? `<p style="margin: 5px 0; font-size: 18px;">Name: ${data.customName}</p>` : ""}
        <p style="margin: 15px 0 5px 0; font-size: 16px;">Paybill: 921961</p>
      </div>
    `
    document.body.appendChild(template)

    try {
      const canvas = await html2canvas(template.firstElementChild as HTMLElement)
      const imageUrl = canvas.toDataURL("image/png")

      // Create share data
      const shareData = {
        title: "JKUAT CU Contribution",
        text: `Contribute to JKUAT CU\nAmount: KES ${data.amount}\nAccount: ${data.account_reference}${data.customName ? `\nName: ${data.customName}` : ""}\nPaybill: 921961`,
        url: `${window.location.origin}?amount=${data.amount}&account=${data.account_reference}${data.customName ? `&name=${encodeURIComponent(data.customName)}` : ""}`,
      }

      if (navigator.share && navigator.canShare(shareData)) {
        try {
          const blob = await (await fetch(imageUrl)).blob()
          const file = new File([blob], "contribution.png", { type: "image/png" })
          await navigator.share({
            ...shareData,
            files: [file],
          })
        } catch (error) {
          await navigator.share(shareData)
        }
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareData.text)
        alert("Share info copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      document.body.removeChild(template)
    }
  }

  return (
    <Button onClick={generateShareImage} variant="outline" size="sm" className="flex items-center gap-2">
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  )
}

