export const useAuth = () => {
  const user = useState<any | null>('user', () => null)
  const isLoading = useState<boolean>('auth-loading', () => false)
  const authError = useState<string | null>('auth-error', () => null)

  const login = async (email: string, password: string) => {
    isLoading.value = true
    authError.value = null
    
    try {
      // Реальный запрос к API
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      
      user.value = data
      return data
    } catch (e: any) {
      authError.value = e.statusMessage || 'Ошибка входа'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: {
    email: string
    password: string
    fullName: string
    phone: string
    region: string
    city: string
  }) => {
    isLoading.value = true
    authError.value = null
    
    try {
      const data = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData
      })
      
      return data
    } catch (e: any) {
      authError.value = e.statusMessage || 'Ошибка регистрации'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    navigateTo('/')
  }

  const forgotPassword = async (email: string) => {
    isLoading.value = true
    
    try {
      const res = await $fetch<{ message: string }>('/api/auth/forgot', {
        method: 'POST',
        body: { email }
      })
      
      return res
    } catch (e: any) {
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading: readonly(isLoading),
    authError: readonly(authError),
    login,
    register,
    logout,
    forgotPassword
  }
}