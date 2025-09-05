import axios from 'axios';

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const AxiosInstance = axios.create({
    baseURL: `${apiUrl}/api`,
    withCredentials: true,
});

let dispatch: React.Dispatch<any> | null;

export const setAxiosDispatch = (fn: React.Dispatch<any>) => {
    dispatch = fn;
};

AxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            (error.response?.status === 401 &&
                error.response?.data?.message?.toLowerCase().includes('token')) ||
            error.response?.data?.message?.toLowerCase().includes('invalid') ||
            error.response?.data?.message?.toLowerCase().includes('logged in')
        ) {
            const requestUrl = error.config.url || '';

            if (!requestUrl.includes('/auth/') && dispatch) {
                dispatch({ type: 'session-expired' });
            }
        }

        return Promise.reject(error);
    }
);
