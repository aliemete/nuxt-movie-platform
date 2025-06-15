<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const { user, isLoginMode, errors, showAuthModal, isRegistrationSuccess } = storeToRefs(authStore);
const modalContentRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (modalContentRef.value && !modalContentRef.value.contains(event.target as Node)) {
    closeModal();
  }
};

// Обработка входа или регистрации
const handleSubmit = async () => {
  console.log('handleSubmit');
  console.log(isLoginMode.value);
  if (isLoginMode.value) {
    await authStore.login();
  } else {
    console.log('to reg');
    await authStore.register();
  }
};
const capitalizeFirstLetter = (value) => {
  return value ? value.replace(/(^\s*\w|[А-ЯЁа-яё])/g, match => match.toUpperCase()) : '';
};


// Закрытие модального окна
const closeModal = () => {
  authStore.closeAuthModal();
  authStore.errors = {}; 
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

</script>

<template>
  <div class="auth-modal" v-show="showAuthModal">
    <div class="auth-modal-content" ref="modalContentRef" v-if="showAuthModal">
      <div class="auth-logo" name="logo">
        <img src="~/assets/img/logo.png" alt="Логотип" />
        <span class="logo-auth-text"></span>
        <svg xmlns="http://www.w3.org/2000/svg" width="93" height="20" viewBox="0 0 93 20" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M25.575 0.151855C27.331 0.151855 28.7094 0.704981 29.7103 1.81123C30.7287 2.89992 31.238 4.43638 31.238 6.42061V14.1117H28.9991L28.367 11.9519C27.9807 12.6016 27.41 13.1722 26.6549 13.6639C25.8999 14.138 25.0043 14.3751 23.9683 14.3751C23.0552 14.3751 22.2299 14.1907 21.4924 13.8219C20.7725 13.4532 20.2106 12.9352 19.8067 12.2679C19.4028 11.6007 19.2009 10.8456 19.2009 10.0028C19.2009 8.70335 19.7101 7.66733 20.7286 6.89471C21.7646 6.10453 23.2659 5.70945 25.2326 5.70945H28.1826C28.1124 4.79635 27.8314 4.07641 27.3398 3.54962C26.8656 3.00528 26.2247 2.73311 25.417 2.73311C24.7673 2.73311 24.2054 2.89114 23.7313 3.20721C23.2572 3.52328 22.906 3.90959 22.6777 4.36614L19.8857 3.89203C20.2194 2.73311 20.9042 1.82001 21.9402 1.15275C22.9938 0.485487 24.2054 0.151855 25.575 0.151855ZM24.6795 11.8202C25.7331 11.8202 26.5847 11.4777 27.2344 10.7929C27.8841 10.1081 28.2089 9.20379 28.2089 8.07998H25.338C23.2835 8.07998 22.2563 8.67701 22.2563 9.87105C22.2563 10.4681 22.4758 10.9422 22.9147 11.2934C23.3537 11.6446 23.942 11.8202 24.6795 11.8202ZM34.524 0.415248V19.5112H37.553V12.0309C38.0974 12.6981 38.7997 13.26 39.6602 13.7166C40.5206 14.1556 41.5039 14.3751 42.6102 14.3751C43.892 14.3751 45.0421 14.0766 46.0606 13.4795C47.0791 12.865 47.8692 12.0221 48.4311 10.951C49.0106 9.86227 49.3003 8.63311 49.3003 7.26346C49.3003 5.89382 49.0106 4.67343 48.4311 3.6023C47.8692 2.51361 47.0791 1.67075 46.0606 1.07373C45.0421 0.459147 43.892 0.151855 42.6102 0.151855C41.4688 0.151855 40.4591 0.397689 39.5811 0.889355C38.7032 1.36346 37.9832 1.94293 37.4213 2.62775L36.7892 0.415248H34.524ZM44.9544 10.4505C44.1642 11.2583 43.1369 11.6621 41.8727 11.6621C40.5908 11.6621 39.546 11.2583 38.7383 10.4505C37.9481 9.62522 37.553 8.56287 37.553 7.26346C37.553 5.96406 37.9481 4.91049 38.7383 4.10275C39.546 3.27745 40.5908 2.8648 41.8727 2.8648C43.1369 2.8648 44.1642 3.27745 44.9544 4.10275C45.7445 4.91049 46.1396 5.96406 46.1396 7.26346C46.1396 8.56287 45.7445 9.62522 44.9544 10.4505ZM68.6422 13.4795C69.7309 14.0766 70.9601 14.3751 72.3297 14.3751C73.8223 14.3751 75.1744 13.9975 76.386 13.2425C77.5976 12.4874 78.4492 11.4163 78.9409 10.0291L76.0962 9.55498C75.7802 10.1696 75.3061 10.67 74.6739 11.0563C74.0418 11.4251 73.3218 11.6094 72.5141 11.6094C71.2849 11.6094 70.284 11.2056 69.5114 10.3978C68.7388 9.5901 68.3525 8.54531 68.3525 7.26346C68.3525 5.98162 68.7388 4.93683 69.5114 4.12909C70.284 3.32135 71.2849 2.91748 72.5141 2.91748C73.2867 2.91748 73.9803 3.10186 74.5949 3.47061C75.227 3.83936 75.6924 4.32224 75.9909 4.91927L78.8355 4.44516C78.3439 3.07552 77.5098 2.02195 76.3333 1.28445C75.1744 0.529386 73.8398 0.151855 72.3297 0.151855C70.9601 0.151855 69.7309 0.459147 68.6422 1.07373C67.5535 1.67075 66.7019 2.51361 66.0873 3.6023C65.4903 4.67343 65.1918 5.89382 65.1918 7.26346C65.1918 8.63311 65.4903 9.86227 66.0873 10.951C66.7019 12.0221 67.5535 12.865 68.6422 13.4795ZM92.0648 14.1117V0.415248H85.9805C84.962 0.415248 84.0489 0.617183 83.2412 1.02105C82.4334 1.40736 81.8013 1.95171 81.3448 2.65409C80.8882 3.35647 80.6599 4.15543 80.6599 5.05096C80.6599 6.01674 80.9145 6.86837 81.4238 7.60587C81.933 8.34337 82.6354 8.88772 83.5309 9.23891L80.2648 14.1117H83.7153L86.6126 9.71302H89.0358V14.1117H92.0648ZM89.0358 3.04918V7.07909H85.9805C85.2957 7.07909 84.7425 6.89471 84.3211 6.52596C83.8997 6.15721 83.689 5.66555 83.689 5.05096C83.689 4.45394 83.8997 3.97105 84.3211 3.6023C84.7425 3.23355 85.2957 3.04918 85.9805 3.04918H89.0358ZM61.1689 0.415248H64.2506L58.6403 15.8237C58.1662 17.1231 57.5516 18.0626 56.7965 18.642C56.059 19.2215 55.0669 19.5112 53.8202 19.5112H51.7394L51.476 16.7456H54.0309C54.5401 16.7456 54.9264 16.6315 55.1898 16.4032C55.4708 16.1925 55.7078 15.815 55.901 15.2706L56.059 14.8492L49.9747 0.415248H53.2144L57.2443 10.2925H57.6657L61.1689 0.415248ZM0.365234 14.1117H3.26256V3.94471H3.68399L7.10809 14.1117H9.663L13.2451 3.94471H13.6666V14.1117H16.5639V0.415248H11.9545L8.66211 9.81837H8.24068L5.07997 0.415248H0.365234V14.1117Z" fill="black"/>
        </svg>
      </div>

      <!-- Сообщение после успешной регистрации -->
      <div v-if="isRegistrationSuccess" class="success-message">
        <h2 >Регистрация завершена</h2>
        <p>Используйте вашу электронную почту для входа</p>
        <button class="submit-button" @click="authStore.toggleMode">
          Войти
        </button>
      </div>

      <!-- Форма авторизации/регистрации -->
      <form class="auth-form" v-if="!isRegistrationSuccess" @submit.prevent="handleSubmit" novalidate>
        <div class="auth-inputs">
          <div class="input-group">
          <div class="input-wrapper">
            <span >
              <svg class="icon" :class="errors.email ? 'error-icon' : ''"
              xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" >
                <path d="M21 3.75C21.5523 3.75 22 4.19772 22 4.75V20.7566C22 21.3052 21.5447 21.75 21.0082 21.75H2.9918C2.44405 21.75 2 21.3051 2 20.7566V19.75H20V8.05L12 15.25L2 6.25V4.75C2 4.19772 2.44772 3.75 3 3.75H21ZM8 15.75V17.75H0V15.75H8ZM5 10.75V12.75H0V10.75H5ZM19.5659 5.75H4.43414L12 12.5593L19.5659 5.75Z" fill="" />
              </svg>
              <input
              id="email"
              name="email"
              v-model="user.email"
              type="email"
              placeholder="Электронная почта"
              :class="{ 'error-input': errors.email }"
              @input="authStore.clearFieldError('email')"
            />
            </span>

          </div>
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div v-if="!isLoginMode" class="input-group">
          <div class="input-wrapper">
            <span >
              <svg class="icon" :class="errors.name ? 'error-icon' : ''"
              xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
<path d="M4 22.75C4 18.3317 7.58172 14.75 12 14.75C16.4183 14.75 20 18.3317 20 22.75H18C18 19.4363 15.3137 16.75 12 16.75C8.68629 16.75 6 19.4363 6 22.75H4ZM12 13.75C8.685 13.75 6 11.065 6 7.75C6 4.435 8.685 1.75 12 1.75C15.315 1.75 18 4.435 18 7.75C18 11.065 15.315 13.75 12 13.75ZM12 11.75C14.21 11.75 16 9.96 16 7.75C16 5.54 14.21 3.75 12 3.75C9.79 3.75 8 5.54 8 7.75C8 9.96 9.79 11.75 12 11.75Z" fill="" />
</svg>
<input
              id="name"
              name="name"
              @input="(e) => user.name = capitalizeFirstLetter(e.target.value)"
              v-model="user.name"
              type="text"
              placeholder="Введите имя"
              :class="{ 'error-input': errors.name }"
              
            />
            </span>

          </div>
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>


        <div v-if="!isLoginMode" class="input-group">
          <div class="input-wrapper">
            <span >
              <svg class="icon" :class="errors.surname ? 'error-icon' : ''"
              xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
<path d="M4 22.75C4 18.3317 7.58172 14.75 12 14.75C16.4183 14.75 20 18.3317 20 22.75H18C18 19.4363 15.3137 16.75 12 16.75C8.68629 16.75 6 19.4363 6 22.75H4ZM12 13.75C8.685 13.75 6 11.065 6 7.75C6 4.435 8.685 1.75 12 1.75C15.315 1.75 18 4.435 18 7.75C18 11.065 15.315 13.75 12 13.75ZM12 11.75C14.21 11.75 16 9.96 16 7.75C16 5.54 14.21 3.75 12 3.75C9.79 3.75 8 5.54 8 7.75C8 9.96 9.79 11.75 12 11.75Z" fill="" />
</svg>
<input
            id="surname"
            name="surname"            
            v-model="user.surname"
            type="text"
            placeholder="Введите фамилию"
              :class="{ 'error-input': errors.surname }"
              @input="authStore.clearFieldError('surname')"
          />
            </span>

          </div>
          <span v-if="errors.surname" class="error-message">{{ errors.surname }}</span>

        </div>

        <div class="input-group">
          <div class="input-wrapper">
            <span >
              <svg class="icon" :class="errors.email ? 'error-icon' : ''"
              xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M12.917 13.75C12.441 16.5877 9.973 18.75 7 18.75C3.68629 18.75 1 16.0637 1 12.75C1 9.43629 3.68629 6.75 7 6.75C9.973 6.75 12.441 8.91229 12.917 11.75H23V13.75H21V17.75H19V13.75H17V17.75H15V13.75H12.917ZM7 16.75C9.20914 16.75 11 14.9591 11 12.75C11 10.5409 9.20914 8.75 7 8.75C4.79086 8.75 3 10.5409 3 12.75C3 14.9591 4.79086 16.75 7 16.75Z" fill=""/>
              </svg>
              <input
              id="password"
              name="password"
              v-model="user.password"
              type="password"
              placeholder="Пароль"
              :class="{ 'error-input': errors.password }"
              @input="authStore.clearFieldError('password')"
            />
            </span>

          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div v-if="!isLoginMode" class="input-group">
          <div class="input-wrapper">
            <span >
              <svg class="icon" :class="errors.email ? 'error-icon' : ''"
              xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M12.917 13.75C12.441 16.5877 9.973 18.75 7 18.75C3.68629 18.75 1 16.0637 1 12.75C1 9.43629 3.68629 6.75 7 6.75C9.973 6.75 12.441 8.91229 12.917 11.75H23V13.75H21V17.75H19V13.75H17V17.75H15V13.75H12.917ZM7 16.75C9.20914 16.75 11 14.9591 11 12.75C11 10.5409 9.20914 8.75 7 8.75C4.79086 8.75 3 10.5409 3 12.75C3 14.9591 4.79086 16.75 7 16.75Z" fill=""/>
              </svg>
              <input
            id="confirmPassword"
            name="confirmPassword"
            v-model="user.confirmPassword"
            type="password"
            placeholder="Подтвердите пароль"
              :class="{ 'error-input': errors.confirmPassword }"
              @input="authStore.clearFieldError('confirmPassword')"
            />
            </span>


          </div>
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>

        </div>
        </div>
        <button type="submit" class="submit-button">
          {{ isLoginMode ? 'Войти' : 'Создать аккаунт' }}
        </button>
        <div v-if="!isRegistrationSuccess" class="toggle-mode" @click="authStore.toggleMode">
          {{ isLoginMode ? 'Регистрация' : 'У меня есть пароль' }}
        </div>
      </form>
      <button class="close-modal-button" @click="closeModal">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path xmlns="http://www.w3.org/2000/svg" d="M11.9987 10.5865L16.9485 5.63672L18.3627 7.05093L13.4129 12.0007L18.3627 16.9504L16.9485 18.3646L11.9987 13.4149L7.04899 18.3646L5.63477 16.9504L10.5845 12.0007L5.63477 7.05093L7.04899 5.63672L11.9987 10.5865Z" fill="black"/>          
      </svg>
    </button>

    </div>

  </div>
</template>

<style scoped>
</style>