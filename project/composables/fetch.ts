
import fallbackImage from '../assets/img/no-poster.jpg';
import type { Movie, User } from '../types/types'; 

const API_URL = 'https://cinemaguide.skillbox.cc';

// Регистрация
export const fetchRegister = async (user: User): Promise<boolean> => {
  // console.log('fetchRegister');
  try {
    const { data, error } = await useFetch(`${API_URL}/user`, {
      method: 'POST',
      body: {
        email: user.email,
        password: user.password,
        name: user.name, // Преобразуем firstName в name
        surname: user.surname, // Преобразуем lastName в surname
      },
    });

    if (error.value) {
      console.error('Ошибка при регистрации:', error.value);
      return false;
    }

    console.log('Успешная регистрация:', data.value);
    return true;
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return false;
  }
};
// Авторизация
export const fetchLogin = async (user: User): Promise<boolean> => {
  try {
    // console.log('fetchLogin');
    const { data, error } = await useFetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: {
        email: user.email,
        password: user.password,
      },
    });

    console.log('Успешная авторизация:', data.value);
    return true;
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    return false;
  }
};


// Profile 
export const fetchProfile = async (): Promise<User | null> => {
  try {
    // console.log('fetchProfile');
    return await $fetch<User>(`${API_URL}/profile`, {
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });
  } catch (error) {
    console.log('Ошибка при загрузке профиля, например если пользователь не авторизован');
    console.error('Profile error:', error);
    return null;
  }
};
export const fetchLogout = async (): Promise<boolean> => {
  try {
    await $fetch(`${API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include'
    });
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};
//Фильмы
export const fetchRandomMovie = async (): Promise<Movie[]> => {
  // console.log('fetchRandomMovie');
  const { data, error } = await useFetch<Movie[]>(`${API_URL}/movie/random`);
  if (error.value) {
    console.error('Ошибка при получении фильмов:', error.value);
    throw new Error('Не удалось загрузить фильмы');
  }
  // console.log(data.value);
  return data.value || [];
};

export const fetchTopMovies = async (): Promise<Movie[]> => {
  console.log('fetchTopMovies');

  const { data, error } = await useFetch<Movie[]>(`${API_URL}/movie/top10`);
  if (error.value) {
    console.error('Ошибка при получении фильмов:', error.value);
    throw new Error('Не удалось загрузить фильмы');
  }
  // console.log(data.value);
  return data.value || [];
};

//Поиск фильмов по запросу

export const fetchMovies = async (params?: {
  title?: string
  genre?: string
  count?: number
  page?: number
}): Promise<Movie[]> => {
  try {
    const response = await $fetch(`${API_URL}/movie`, {
      params: {
        title: params?.title,
        genre: params?.genre,
        count: params?.count,
        page: params?.page
      }
    })
    
    // Добавляем проверку структуры ответа
    return Array.isArray(response) ? response : []
    
  } catch (error) {
    console.error('Fetch movies error:', error)
    return []
  }
}
// Получить детали фильма по ID

export const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  // console.log('fetchMovieDetails');
  // console.log(movieId);
  try {
    return await $fetch<Movie>(`${API_URL}/movie/${movieId}`);
  } catch (error) {
    console.error('Movie details error:', error);
    throw error;
  }
};

// Избранное
// Добавить фильм в избранное
export const fetchAddToFavorites = async (id: number): Promise<void> => {
  // console.log('fetchAddToFavorites');
  const { error } = await useFetch(`${API_URL}/favorites`, {
    method: 'POST',
    body: new URLSearchParams({ id: String(id) }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',
  });
  if (error.value) {
    console.error('Ошибка при добавлении в избранное:', error.value);
    throw new Error('Не удалось добавить в избранное');
  }
};

//Удалить фильм из избранного

export const fetchRemoveFromFavorites = async (movieId: number): Promise<void> => {
  // console.log('fetchRemoveFromFavorites');
  try {
    await $fetch(`${API_URL}/favorites/${movieId}`, {
      method: 'DELETE',
      body: { id: String(movieId) },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    throw error;
  }
};
// Жанры
export const fetchGenres = async (): Promise<string[]> => {
  const { data, error, pending } = await useFetch<string[]>(`${API_URL}/movie/genres`);
  if (error.value) throw new Error('Не удалось загрузить жанры');
  console.log('fetchGenres');
  // console.log(data.value);
  return data.value || [];
};

export const fetchMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  // console.log('fetchMoviesByGenre');
  const { data, error } = await useFetch<Movie[]>(`${API_URL}/movie`, {
    params: { genre }
  });
  if (error.value) throw new Error(error.value.message);
  // console.log(data.value);
  return data.value || [];
};
export const fetchBestMoviesByGenre = async (): Promise<{ genre: string; movie: Movie }[]> => {
  try {
    // 1. Получаем все фильмы
    const allMovies = await $fetch<Movie[]>(`${API_URL}/movie`);
    
    // 2. Группируем фильмы по жанрам
    const genreMap = new Map<string, Movie[]>();
    
    allMovies.forEach(movie => {
      movie.genres.forEach(genre => {
        if (!genreMap.has(genre)) {
          genreMap.set(genre, []);
        }
        genreMap.get(genre)?.push(movie);
      });
    });

    // 3. Выбираем лучший фильм для каждого жанра
    const result: { genre: string; movie: Movie }[] = [];
    
    genreMap.forEach((movies, genre) => {
      if (movies.length === 0) return;

      // Сортируем по рейтингу и дате
      const bestMovie = movies.sort((a, b) => {
        // Сначала сравниваем по рейтингу
        const ratingDiff = (b.tmdbRating || 0) - (a.tmdbRating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        
        // Если рейтинги равны - сравниваем по дате релиза
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      })[0];

      result.push({ genre, movie: bestMovie });
    });
    // console.log(result);
    return result;
  } catch (error) {
    console.error('Error fetching best movies by genre:', error);
    return [];
  }
};
export const fetchGenresWithPosters = async (): Promise<{ genre: string; posterUrl: string }[]> => {
  try {
    const bestMovies = await fetchBestMoviesByGenre();
    
    return bestMovies.map(({ genre, movie }) => ({
      genre,
      posterUrl: movie.posterUrl || fallbackImage // Используем fallback при отсутствии постера
    }));

  } catch (error) {
    console.error('Error fetching genres with posters:', error);
    return [];
  }
};