export interface Movie {
    id: number;
    title: string;
    originalTitle: string;
    releaseDate: string;
    releaseYear: number;
    director: string;
    runtime: number;
    genres: string[];
    tmdbRating?: number;
    backdropUrl: string;
    posterUrl: string;
    budget: number;
    plot: string;
    searchL: string;
    trailerUrl: string;
    trailerYouTubeId: string;
    awardsSummary: string;
    language: string;
    production: string;
    cast: string[];
  }
  
  export interface Genre {
    name: string;
  }
  
  export interface SearchResults {
    results: Movie[];
    total: number;
  }

  export interface User {
    email: string;
    name?: string;
    surname?: string;
    password?: string;
    confirmPassword?: string;
    favorites?: string[];
  }
  export interface AuthState {
    user: User;
    isLoginMode: boolean;
    isRegistrationSuccess: boolean;
    errors: Record<string, string>;
    showAuthModal: boolean;
    isAuthenticated: boolean; // Убираем возможный undefined
    isHydrated?: boolean;     // Опциональный флаг, если нужен
  }
  