import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import './App.css'

interface Todo {
  id: number
  title: string
  status: 'problem' | 'completed' | 'created' | 'on_going'
  description?: string
  dueDate?: string
}

const API_BASE = 'http://localhost:3000/api/todos'

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const formatStatus = (status: string) => {
  return status
    .split('_')
    .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    .join(' ')
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    status: 'problem' as 'problem' | 'completed' | 'created' | 'on_going'
  })

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setError(null)
        setIsLoading(true)
        const { data } = await axiosInstance.get('')
        setTodos(data)
        setFilteredTodos(data)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to load todos'
        setError(`Cannot connect to server. Make sure backend is running on http://localhost:3000`)
        setTodos([])
        setFilteredTodos([])
      } finally {
        setIsLoading(false)
      }
    }
    loadTodos()
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    setSearchValue(query)
    if (!query.trim()) {
      setFilteredTodos(todos)
      return
    }

    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get('', { 
        params: { search: query } 
      })
      setFilteredTodos(data)
    } catch (error) {
      console.error('Search failed:', error)
      setFilteredTodos(todos)
    } finally {
      setIsLoading(false)
    }
  }, [todos])

  const handleAddTodo = async () => {
    if (inputValue.trim() === '') return

    try {
      const { data } = await axiosInstance.post('', {
        title: inputValue,
      })

      setTodos([...todos, data])
      setFilteredTodos([...todos, data])
      setInputValue('')
    } catch (error) {
      console.error('Failed to add todo:', error)
      alert('Failed to add todo')
    }
  }

  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo)
    setEditMode(false)
    setEditForm({
      title: todo.title,
      status: todo.status,
    })
  }

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveEdit = async () => {
    if (!selectedTodo || editForm.title.trim() === '') return

    try {
      const { data } = await axiosInstance.patch(`/${selectedTodo.id}`, {
        status: editForm.status,
      })

      setTodos(todos.map(t => (t.id === selectedTodo.id ? data : t)))
      setFilteredTodos(filteredTodos.map(t => (t.id === selectedTodo.id ? data : t)))
      setSelectedTodo(data)
      setEditMode(false)
    } catch (error) {
      console.error('Failed to save todo:', error)
      alert('Failed to save todo')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  return (
    <div className="app-container">
      <div className="main-content">
        {error && (
          <div className="error-banner">
            <strong> Error:</strong> {error}
          </div>
        )}

        {/* Add Todo Section */}
        <div className="add-todo-section">
          <input
            type="text"
            placeholder="Add a new todo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="todo-input"
          />
          <button onClick={handleAddTodo} className="btn btn-primary">
            Add
          </button>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
            disabled={isLoading}
          />
          {isLoading && <span className="loading-indicator">Loading...</span>}
        </div>

        {/* Todo Table */}
        <div className="table-section">
          <table className="todo-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan={4} className="empty-message">
                    {searchValue ? 'No todos found matching your search' : 'No todos yet. Add one to get started!'}
                  </td>
                </tr>
              ) : (
                filteredTodos.map((todo, index) => (
                  <tr key={todo.id} className={`todo-row ${todo.status === 'completed' ? 'completed' : ''}`}>
                    <td className="row-number">{index + 1}</td>
                    <td
                      className="todo-title"
                      onClick={() => handleSelectTodo(todo)}
                      style={{ cursor: 'pointer' }}
                    >
                      {todo.title}
                    </td>
                    <td>
                      <span className={`status-badge status-${todo.status}`}>
                        {formatStatus(todo.status)}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleSelectTodo(todo)}
                        className="btn btn-sm btn-info"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedTodo && (
        <div className="detail-panel">
          <div className="detail-header">
            <h2>{editMode ? 'Edit Todo' : 'Todo Details'}</h2>
            <button
              onClick={() => {
                setSelectedTodo(null)
                setEditMode(false)
              }}
              className="close-btn"
            >
              ✕
            </button>
          </div>
          <div className="detail-content">
            {editMode ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="edit-form">
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => handleEditFormChange('title', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => handleEditFormChange('status', e.target.value)}
                    className="form-select"
                  >

                    <option value="created">Created</option>
                    <option value="on_going">On Going</option>
                    <option value="problem">Problem</option>
                    <option value="completed">Completed</option>

                  </select>
                </div>
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-block btn-success"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="btn btn-block btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="detail-field">
                  <label>Title:</label>
                  <p>{selectedTodo.title}</p>
                </div>
                <div className="detail-field">
                  <label>Status:</label>
                  <p>
                    <span className={`status-badge status-${selectedTodo.status}`}>
                      {formatStatus(selectedTodo.status)}
                    </span>
                  </p>
                </div>
                <div className="detail-actions">
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn btn-block btn-info"
                  >
                    Edit Todo
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
