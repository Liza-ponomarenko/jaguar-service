export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const isLoading = useState<boolean>('auth-loading', () => false)
  const authError = useState<string | null>('auth-error', () => null)

  const fetchUser = async () => {
    try {
      const data = await $fetch<User>('/api/auth/me', {
        credentials: 'include'
      })
      user.value = data
    } catch {
      user.value = null
    }
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    authError.value = null
    
    try {
      const data = await $fetch<User>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
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

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } finally {
      user.value = null
      navigateTo('/')
    }
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

  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isUser = computed(() => user.value?.role === 'USER')
  const isAuthenticated = computed(() => !!user.value)

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    authError: readonly(authError),
    isAdmin,
    isUser,
    isAuthenticated,
    fetchUser,
    login,
    register,
    logout,
    forgotPassword
  }
}

export interface User {
  id: number
  email: string
  fullName: string
  phone: string
  region: string
  city: string
  role: 'USER' | 'ADMIN'
}