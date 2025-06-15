module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.nuxt/',
    '\\.(jpg|jpeg|png|gif|webp|svg)$' // Игнорируем только картинки
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^@composables/(.*)$': '<rootDir>/composables/$1' // Добавляем алиас для composables
  }
}