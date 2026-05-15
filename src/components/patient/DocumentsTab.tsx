import { format } from 'date-fns'
import { FileText, Image, File, Download, Trash2 } from 'lucide-react'

interface Document {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
}

function getFileIcon(fileType: string) {
  if (fileType === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />
  if (fileType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />
  return <File className="w-5 h-5 text-slate-500" />
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

interface DocumentsTabProps {
  documents: Document[]
  onUpload: (file: File) => Promise<void>
  uploading: boolean
}

export function DocumentsTab({ documents, onUpload, uploading }: DocumentsTabProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-blue-200 rounded-2xl p-12 text-center bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input id="file-upload" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.dcm" onChange={handleFileInput} />
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 mx-auto mb-4">
          <FileText className="w-7 h-7 text-blue-600" />
        </div>
        <p className="text-base font-semibold text-slate-700">Drop your medical records here</p>
        <p className="text-sm text-slate-500 mt-1">or <span className="text-blue-600 font-medium">browse files</span></p>
        <p className="text-xs text-slate-400 mt-3">PDF, JPG, PNG, DICOM · Up to 50MB each</p>
        {uploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Uploading securely...</span>
          </div>
        )}
      </div>

      {/* Document List */}
      {documents.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Uploaded Records ({documents.length})</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{doc.fileName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatFileSize(doc.fileSize)} · Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-slate-400 py-4">No documents uploaded yet.</p>
      )}
    </div>
  )
}
