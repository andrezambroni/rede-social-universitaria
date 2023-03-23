// acesso a api
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import useFlashMessage from './useFlashMessage'

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAuthenticated(true)
    }
  }, [])

  async function register(user) {
    let msgText = 'Cadastro realizado com sucesso!'
    let msgType = 'success'

    try {
      const data = await api
        .post('/api/users/register', user)
        .then(response => {
          return response.data
        })

      await authUser(data)
    } catch (err) {
      msgText = err.response.data.message
      msgType = 'error'
      console.log(err.response.data)
    }

    setFlashMessage(msgText, msgType)
  }

  const login = async user => {
    let msgText = 'Login realizado com sucesso!'
    let msgType = 'success'

    try {
      const data = await api.post('/api/users/login', user).then(response => {
        return response.data
      })

      await authUser(data)
    } catch (err) {
      msgText = err.response.data.message
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType)
  }

  const authUser = async data => {
    setAuthenticated(true)

    localStorage.setItem('token', JSON.stringify(data.token))
    await navigate('/')
    window.location.reload()
  }

  const logout = () => {
    const msgText = 'Logout realizado com sucesso!'
    const msgType = 'success'

    setAuthenticated(false)
    localStorage.removeItem('token')
    api.defaults.headers.Authorization = undefined
    navigate('/')

    setFlashMessage(msgText, msgType)
  }

  return {
    authenticated,
    register,
    logout,
    login
  }
}

export default useAuth
