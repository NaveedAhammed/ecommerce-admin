import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER;

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

const publicAxios = axios.create({
	baseURL: BASE_URL,
	headers,
});

export const privateAxios = axios.create({
	baseURL: BASE_URL,
	headers,
	withCredentials: true,
});

export default publicAxios;
