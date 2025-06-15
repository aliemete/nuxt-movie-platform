import { defineStore } from 'pinia';
import type { User, AuthState } from '~/types/types';
import { fetchLogin, fetchRegister, fetchProfile, fetchLogout } from '~/composables/fetch';
import { computed, reactive, toRefs } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const state = reactive<AuthState>({
    user: {
      email: '',
      name: '',
      surname: '',
      password: '',
      confirmPassword: '',
      favorites: [],
    },
    isLoginMode: true,
    isRegistrationSuccess: false,
    errors: {},
    showAuthModal: false,
    isAuthenticated: false,
    isLoading: false,
  });

  // Геттеры
  const isAuthenticated = computed(() => state.isAuthenticated);
  const currentUser = computed(() => state.user);

  // Основное действие: проверка аутентификации
  const refreshProfile = async () => {
    console.log('refreshProfile');
    try {
      const profile = await fetchProfile();
      if (profile) {
        // Сохраняем текущее состояние модальных окон
        const prevAuthModalState = state.showAuthModal;
        
        state.user = { 
          ...state.user,
          ...profile,
          favorites: profile.favorites || []
        };
        state.isAuthenticated = true;
        
        // Восстанавливаем состояние модалок
        state.showAuthModal = prevAuthModalState;
      }
      console.log('[AuthStore] Профиль получен:', profile);
    } catch (error) {
      state.isAuthenticated = false;
    }
  };
  // const validateFields = () => {
  //   console.log('validateFields');
  //   state.errors = {};
    
  //   if (!state.user.email) state.errors.email = 'Поле обязательно';
  //   if (!state.user.password) state.errors.password = 'Поле обязательно';
    
  //   if (!state.isLoginMode) {
  //     if (!state.user.name) state.errors.name = 'Поле обязательно';
  //     if (state.user.password !== state.user.confirmPassword) {
  //       state.errors.confirmPassword = 'Пароли не совпадают';
  //     }
  //   }
    
  //   return Object.keys(state.errors).length === 0;
  // };
  const validateFields = () => {
    console.log('validateFields');
    state.errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-zА-Яа-яЁё'\-\s]{2,}$/;
  
    // проверка Email 
    if (!state.user.email.trim()) {
      state.errors.email = 'Поле обязательно';
    } 
    else if (!emailRegex.test(state.user.email)) {
      state.errors.email = 'Некорректный формат email';
    }
  
    // Проверка пароля
    if (!state.user.password.trim()) {
      state.errors.password = 'Поле обязательно';
    } else if (state.user.password.length < 6) {
      state.errors.password = 'Минимум 6 символов';
    } else if (/\s/.test(state.user.password)) {
      state.errors.password = 'Пароль не должен содержать пробелов';
    }
    console.log(state.isLoginMode);
    // Для регистрации
    if (!state.isLoginMode) {
      console.log(state.isLoginMode);
      // Name 
      if (!state.user.name?.trim()) {
        state.errors.name = 'Поле обязательно';
      } else if (!nameRegex.test(state.user.name)) {
        state.errors.name = 'Допустимы только буквы и дефисы';
      } else if (state.user.name.length < 2) {
        state.errors.name = 'Минимум 2 символа';
      }
  
      // Surname 
      if (!state.user.surname?.trim()) {
        state.errors.surname = 'Поле обязательно';
      } else if (!nameRegex.test(state.user.surname)) {
        state.errors.surname = 'Допустимы только буквы и дефисы';
      } else if (state.user.surname.length < 2) {
        state.errors.surname = 'Минимум 2 символа';
      }
  
      // Подтверждение
      if (state.user.password !== state.user.confirmPassword) {
        state.errors.confirmPassword = 'Пароли не совпадают';
      }
    }
    return Object.keys(state.errors).length === 0;
  }
  const clearFieldError = (field: string) => {
    console.log('clearFieldError');
    if (state.errors[field]) {
      delete state.errors[field];
    }
  };
  const checkAuthState = async () => {
    await new Promise(resolve => setTimeout(resolve, 50)); // костыль для обновления статуса авторизации на клиенте

  try {
    const profile = await fetchProfile();
    state.isAuthenticated = !!profile;
    
    if (profile) {
      state.user = { 
        ...state.user,
        ...profile,
        favorites: profile.favorites || []
      };
      console.log(state.user.favorites);
    } 
   
    return !!profile;
  } catch (error) {
    state.isAuthenticated = false;
    return false;
  }
  };
  
  const login = async () => {
    console.log('login');
    state.isLoading = true;
    try {
      state.errors = {}; // Сбрасываем ошибки перед запросом
      console.log(state.errors);
      if (!validateFields()) return;
      const success = await fetchLogin({
        email: state.user.email,
        password: state.user.password
      });
      if (success) {
        // Принудительное обновление данных
        await checkAuthState();
        state.showAuthModal = false;
        // Обновление страницы после успешной авторизации
        window.location.reload();
      } else {
        state.errors.email = 'Ошибка авторизации';
      }
    } catch (error: any) {
      // Обработка ошибок бэкенда
      if (error.response?.data?.errors) {
        state.errors = { 
          ...state.errors,
          ...error.response.data.errors // Мерджим ошибки с бэкенда
        };
      }
    } finally  {
      state.isLoading = false;
    }
  };

  const register = async () => {
    try {
      if (!validateFields()) return;
      state.errors = {}; // Сбрасываем ошибки перед запросом
      const success = await fetchRegister({
        email: state.user.email,
        password: state.user.password,
        name: state.user.name,
        surname: state.user.surname,
      });
      if (success) {
        console.log(success);
        state.isRegistrationSuccess = true;
        console.log(state.isRegistrationSuccess);
      }
    } catch (error: any) {
      // Обработка ошибок бэкенда
      if (error.response?.data?.errors) {
        state.errors = { 
          ...state.errors,
          ...error.response.data.errors // Мерджим ошибки с бэкенда
        };
      }
    }

  };

  const logout = async () => {
    try {
      await fetchLogout();
      state.isAuthenticated = false;
      state.user = { 
        email: '',
        name: '',
        surname: '',
        password: '',
        confirmPassword: '',
        favorites: [],
      };
      state.showAuthModal = false;
      await refreshProfile();
      navigateTo('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMode = () => {
    state.isLoginMode = !state.isLoginMode;
    state.errors = {};
    state.isRegistrationSuccess = false; 
  };
  const openAuthModal = () => {
    state.showAuthModal = true;
  };

  const closeAuthModal = () => {
    state.showAuthModal = false;
  };

  return {
    ...toRefs(state),
    isAuthenticated,
    currentUser,
    refreshProfile,
    checkAuthState,
    validateFields,
    login,
    register,
    logout,
    toggleMode,
    openAuthModal,
    closeAuthModal,
    clearFieldError
  };
});