import React, { useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import mammoth from 'mammoth'
import FileIcon from '../../../../assets/icons/fileIcon'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const ChatFileInput = ({ setUserInput }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const content = await parseFileContent(file)
      setUserInput(content)
    }
  }

  const parsePdfContent = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result)
        const pdf = await pdfjs.getDocument(typedArray).promise
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i += 1) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          fullText += textContent.items.map((item) => item.str).join(' ')
        }
        resolve(fullText)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const parseWordContent = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result
        const result = await mammoth.extractRawText({ arrayBuffer })
        resolve(result.value)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const parseTextContent = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsText(file)
    })
  }

  const parseFileContent = async (file) => {
    if (file.type === 'application/pdf') {
      return parsePdfContent(file)
    }
    if (
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      return parseWordContent(file)
    }
    return parseTextContent(file)
  }

  return (
    <div className="px-3">
      <label htmlFor="file-input" className="cursor-pointer">
        <FileIcon className="h-6" />
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
          ref={fileInputRef}
          className="hidden"
        />
      </label>
    </div>
  )
}

export default ChatFileInput
