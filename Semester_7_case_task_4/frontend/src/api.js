import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
    validateStatus: function (status) {
        return status < 400;
    },
});

// Добавление токена в заголовки для всех запросов
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Обработка ошибок авторизации
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Если ошибка 401, можно перенаправить на страницу входа
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
