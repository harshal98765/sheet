import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronDown, Search, Bell, User, EyeOff, ArrowUpDown, Filter, Download, Upload, Share2, Plus, MoreHorizontal } from 'lucide-react'

interface TableRow {
  id: number
  jobRequest: string
  submitted: string
  status: "In-progress" | "Need to start" | "Complete" | "Blocked"
  submitter: string
  url: string
  assigned: string
  priority: "High" | "Medium" | "Low"
  dueDate: string
  estValue: string
}

const initialData: TableRow[] = [
  {
    id: 1,
    jobRequest: "Launch social media campaign for pro...",
    submitted: "15-11-2024",
    status: "In-progress",
    submitter: "Aisha Patel",
    url: "www.aishapatel...",
    assigned: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "20-11-2024",
    estValue: "6,200,000",
  },
  {
    id: 2,
    jobRequest: "Update press kit for co...",
    submitted: "12-11-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "www.irfankhan...",
    assigned: "Tejas Pandey",
    priority: "High",
    dueDate: "30-10-2024",
    estValue: "3,500,000",
  },
  {
    id: 3,
    jobRequest: "Finalize user testing feedback for app...",
    submitted: "05-12-2024",
    status: "In-progress",
    submitter: "Mark Johnson",
    url: "www.markjohns...",
    assigned: "Rachel Lee",
    priority: "Medium",
    dueDate: "10-12-2024",
    estValue: "4,750,000",
  },
  {
    id: 4,
    jobRequest: "Design new features for the website",
    submitted: "10-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    url: "www.emilygreen...",
    assigned: "Tom Wright",
    priority: "Low",
    dueDate: "15-01-2025",
    estValue: "6,900,000",
  },
  {
    id: 5,
    jobRequest: "Prepare financial report for Q4",
    submitted: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "www.jessicabr...",
    assigned: "Kevin Smith",
    priority: "Low",
    dueDate: "30-01-2025",
    estValue: "2,800,000",
  },
]

const statusColors = {
  "In-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Need to start": "bg-blue-100 text-blue-800 border-blue-200",
  Complete: "bg-green-100 text-green-800 border-green-200",
  Blocked: "bg-red-100 text-red-800 border-red-200",
}

const priorityColors = {
  High: "text-red-600",
  Medium: "text-yellow-600",
  Low: "text-green-600",
}

export default function App() {
  const [data, setData] = useState<TableRow[]>(initialData)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [activeTab, setActiveTab] = useState("All Orders")
  const [hiddenFields, setHiddenFields] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const tabs = ["All Orders", "Pending", "Reviewed", "Arrived"]

  const columns = [
    { key: "jobRequest", label: "Job Request", width: "w-80" },
    { key: "submitted", label: "Submitted", width: "w-32" },
    { key: "status", label: "Status", width: "w-32" },
    { key: "submitter", label: "Submitter", width: "w-36" },
    { key: "url", label: "URL", width: "w-36" },
    { key: "assigned", label: "Assigned", width: "w-36" },
    { key: "priority", label: "Priority", width: "w-24" },
    { key: "dueDate", label: "Due Date", width: "w-32" },
    { key: "estValue", label: "Est. Value", width: "w-32" },
  ]

  const visibleColumns = columns.filter((col) => !hiddenFields.includes(col.key))

  const handleSort = useCallback(
    (key: string) => {
      console.log(`Sorting by ${key}`)
      let direction: "asc" | "desc" = "asc"
      if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc"
      }
      setSortConfig({ key, direction })

      const sortedData = [...data].sort((a, b) => {
        const aVal = a[key as keyof TableRow]
        const bVal = b[key as keyof TableRow]

        if (aVal < bVal) return direction === "asc" ? -1 : 1
        if (aVal > bVal) return direction === "asc" ? 1 : -1
        return 0
      })

      setData(sortedData)
    },
    [data, sortConfig],
  )

  const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex })
    console.log(`Selected cell: Row ${rowIndex + 1}, Column ${colIndex + 1}`)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedCell) return

      const { row, col } = selectedCell
      let newRow = row
      let newCol = col

      switch (e.key) {
        case "ArrowUp":
          newRow = Math.max(0, row - 1)
          break
        case "ArrowDown":
          newRow = Math.min(data.length - 1, row + 1)
          break
        case "ArrowLeft":
          newCol = Math.max(0, col - 1)
          break
        case "ArrowRight":
          newCol = Math.min(visibleColumns.length - 1, col + 1)
          break
        default:
          return
      }

      e.preventDefault()
      setSelectedCell({ row: newRow, col: newCol })
    },
    [selectedCell, data.length, visibleColumns.length],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const handleButtonClick = (action: string) => {
    console.log(`${action} button clicked`)
  }

  const toggleFieldVisibility = (fieldKey: string) => {
    console.log(`Toggling visibility for ${fieldKey}`)
    setHiddenFields((prev) => (prev.includes(fieldKey) ? prev.filter((f) => f !== fieldKey) : [...prev, fieldKey]))
  }

  const renderCell = (row: TableRow, column: any, rowIndex: number, colIndex: number) => {
    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
    const value = row[column.key as keyof TableRow]

    let cellContent

    switch (column.key) {
      case "status":
        cellContent = (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[value as keyof typeof statusColors]}`}
          >
            {value}
          </span>
        )
        break
      case "priority":
        cellContent = (
          <span className={`font-medium ${priorityColors[value as keyof typeof priorityColors]}`}>{value}</span>
        )
        break
      case "url":
        cellContent = <span className="text-blue-600 hover:underline cursor-pointer truncate">{value}</span>
        break
      case "estValue":
        cellContent = <span className="font-mono">{value}</span>
        break
      default:
        cellContent = <span className="truncate">{value}</span>
    }

    return (
      <td
        key={`${rowIndex}-${colIndex}`}
        className={`px-3 py-2 border-r border-gray-200 cursor-cell ${column.width} ${
          isSelected ? "bg-blue-50 ring-2 ring-blue-500" : "hover:bg-gray-50"
        }`}
        onClick={() => handleCellClick(rowIndex, colIndex)}
      >
        {cellContent}
      </td>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>📁 Workspace</span>
            <ChevronDown className="w-4 h-4" />
            <span>Folder 2</span>
            <ChevronDown className="w-4 h-4" />
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Spreadsheet 3</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search within sheet"
                className="pl-10 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">John Doe</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Tool bar</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  handleButtonClick("Hide fields")
                  toggleFieldVisibility("url") // Example usage
                }}
                className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                <EyeOff className="w-4 h-4" />
                <span>Hide fields</span>
              </button>

              <button
                onClick={() => handleButtonClick("Sort")}
                className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort</span>
              </button>

              <button
                onClick={() => handleButtonClick("Filter")}
                className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleButtonClick("Import")}
              className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>

            <button
              onClick={() => handleButtonClick("Export")}
              className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={() => handleButtonClick("Share")}
              className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={() => handleButtonClick("New Action")}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Action</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header Actions */}
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">📊 Q3 Financial Overview</span>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>ABC</span>
              <span>Answer a question</span>
              <span>Extract</span>
              <Plus className="w-4 h-4" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto" ref={tableRef}>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    #
                  </th>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100 ${column.width}`}
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="w-12 px-3 py-2 text-sm text-gray-500 border-r border-gray-200 bg-gray-50">
                      {row.id}
                    </td>
                    {visibleColumns.map((column, colIndex) => renderCell(row, column, rowIndex, colIndex))}
                  </tr>
                ))}

                {/* Empty rows */}
                {Array.from({ length: 19 }, (_, index) => (
                  <tr key={`empty-${index}`} className="hover:bg-gray-50">
                    <td className="w-12 px-3 py-2 text-sm text-gray-500 border-r border-gray-200 bg-gray-50">
                      {data.length + index + 1}
                    </td>
                    {visibleColumns.map((column, colIndex) => (
                      <td
                        key={`empty-${index}-${colIndex}`}
                        className={`px-3 py-2 border-r border-gray-200 cursor-cell hover:bg-gray-50 ${column.width}`}
                        onClick={() => handleCellClick(data.length + index, colIndex)}
                      >
                        <span className="text-gray-300">—</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="mt-4 flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                console.log(`Switched to ${tab} tab`)
              }}
              className={`px-4 py-2 text-sm rounded-t-lg border-b-2 ${
                activeTab === tab
                  ? "bg-white border-blue-500 text-blue-600"
                  : "bg-gray-100 border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
          <button onClick={() => handleButtonClick("Add Tab")} className="px-2 py-2 text-gray-400 hover:text-gray-600">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}