import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  FormControlLabel,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import githubService from '../src/services/githubService'

const Input = styled('input')({
  display: 'none',
})

const JsonUploader = () => {
  const [file, setFile] = useState(null)
  const [routeName, setRouteName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile)
      setError('')
    } else {
      setError('Please upload a valid JSON file')
      setFile(null)
    }
  }

  const handleRouteNameChange = (event) => {
    const value = event.target.value
    if (/^[a-zA-Z0-9-]*$/.test(value)) {
      setRouteName(value)
      setError('')
    } else {
      setError('Route name can only contain letters, numbers, and hyphens')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!file || !routeName) {
        throw new Error('Please provide both a JSON file and a route name')
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result)
          await githubService.createNewRoute(routeName, jsonContent)
          setSuccess(
            'Route created successfully! The changes have been deployed to the main branch.',
          )
          setFile(null)
          setRouteName('')
        } catch (error) {
          setError('Error creating route: ' + error.message)
        } finally {
          setLoading(false)
        }
      }
      reader.readAsText(file)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Route
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload your JSON content and specify a route name to create a new page
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Input
                  accept=".json"
                  id="json-file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
              }
              label={
                <Button variant="outlined" component="span" fullWidth>
                  Upload JSON File
                </Button>
              }
            />
            {file && (
              <Typography variant="body2" color="text.secondary">
                Selected file: {file.name}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            label="Route Name"
            value={routeName}
            onChange={handleRouteNameChange}
            placeholder="e.g., hire-ai-developer"
            sx={{ mb: 3 }}
            helperText="Use only letters, numbers, and hyphens"
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !file || !routeName}
          >
            {loading ? 'Processing...' : 'Create Route'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default JsonUploader
