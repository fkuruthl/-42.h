"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotification } from "@/components/notification-provider"

interface CSVRow {
  [key: string]: string
}

interface CSVImportPreviewProps {
  csvContent: string
  onImport: (validRows: CSVRow[]) => void
  onCancel: () => void
}

export default function CSVImportPreview({ csvContent, onImport, onCancel }: CSVImportPreviewProps) {
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<CSVRow[]>([])
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string[] }>({})
  const { addNotification } = useNotification()

  // Required fields for validation
  const requiredFields = ["title", "description", "location", "date", "category", "duration"]

  useEffect(() => {
    if (!csvContent) return

    try {
      // Parse CSV content
      const lines = csvContent.trim().split("\n")
      const parsedHeaders = lines[0].split(",").map((header) => header.trim().toLowerCase())
      setHeaders(parsedHeaders)

      // Parse rows
      const parsedRows = lines.slice(1).map((line) => {
        const values = line.split(",")
        const row: CSVRow = {}
        parsedHeaders.forEach((header, index) => {
          row[header] = values[index]?.trim() || ""
        })
        return row
      })
      setRows(parsedRows)

      // Validate rows
      const errors: { [key: number]: string[] } = {}
      parsedRows.forEach((row, index) => {
        const rowErrors: string[] = []
        requiredFields.forEach((field) => {
          if (!parsedHeaders.includes(field)) {
            rowErrors.push(`Missing required column: ${field}`)
          } else if (!row[field]) {
            rowErrors.push(`Missing value for ${field}`)
          }
        })
        if (rowErrors.length > 0) {
          errors[index] = rowErrors
        }
      })
      setValidationErrors(errors)
    } catch (error) {
      console.error("Error parsing CSV:", error)
      addNotification("Error parsing CSV file. Please check the format.", "error")
    }
  }, [csvContent, addNotification])

  const handleImport = () => {
    // Filter out rows with validation errors
    const validRows = rows.filter((_, index) => !validationErrors[index])
    onImport(validRows)
  }

  const downloadSampleTemplate = () => {
    const sampleHeaders = ["title", "description", "location", "date", "category", "duration", "countdown"]
    const sampleRow = [
      "Sample Event",
      "This is a sample event description",
      "42 Abu Dhabi Campus",
      "June 15, 2025",
      "Workshop",
      "2h",
      "in 30 days",
    ]

    const csvContent = [sampleHeaders.join(","), sampleRow.join(",")].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "events_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const hasErrors = Object.keys(validationErrors).length > 0
  const validRowCount = rows.length - Object.keys(validationErrors).length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold font-mono text-white">CSV Import Preview</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadSampleTemplate}
          className="text-xs border-[#333333] text-[#f5f5f5]"
        >
          <Download className="h-3 w-3 mr-1" /> Sample Template
        </Button>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333333] rounded-md overflow-hidden">
        {rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#252525] border-b border-[#333333]">
                  <th className="px-4 py-2 text-left text-[#f5f5f5]">Status</th>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className={`px-4 py-2 text-left ${
                        requiredFields.includes(header) ? "text-[#00eaff]" : "text-[#f5f5f5]"
                      }`}
                    >
                      {header}
                      {requiredFields.includes(header) && "*"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-[#333333] ${
                      validationErrors[index] ? "bg-[#ff6b6b]/10" : "hover:bg-[#252525]"
                    }`}
                  >
                    <td className="px-4 py-2">
                      {validationErrors[index] ? (
                        <div className="flex items-center text-[#ff6b6b]">
                          <X className="h-4 w-4 mr-1" />
                          <span>Error</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-[#1ed760]">
                          <Check className="h-4 w-4 mr-1" />
                          <span>Valid</span>
                        </div>
                      )}
                    </td>
                    {headers.map((header) => (
                      <td
                        key={`${index}-${header}`}
                        className={`px-4 py-2 ${
                          requiredFields.includes(header) && !row[header] ? "text-[#ff6b6b]" : "text-[#f5f5f5]"
                        }`}
                      >
                        {row[header] || (requiredFields.includes(header) ? "Missing" : "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-[#666666]">No data to preview</div>
        )}
      </div>

      {hasErrors && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ff6b6b]/10 border border-[#ff6b6b] rounded-md p-4 flex items-start"
        >
          <AlertCircle className="h-5 w-5 text-[#ff6b6b] mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[#ff6b6b] font-medium">Validation errors found</p>
            <p className="text-[#f5f5f5] text-sm mt-1">
              {Object.keys(validationErrors).length} of {rows.length} rows have errors. Please fix the issues or proceed
              with only valid rows.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between items-center pt-2">
        <div className="text-sm text-[#f5f5f5]">
          <span className="font-medium">{validRowCount}</span> of <span className="font-medium">{rows.length}</span>{" "}
          rows ready to import
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="border-[#333333] text-[#f5f5f5]">
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            className="bg-[#00eaff] hover:bg-[#00eaff]/80 text-black"
            disabled={validRowCount === 0}
          >
            Import {validRowCount} Events
          </Button>
        </div>
      </div>
    </div>
  )
}
