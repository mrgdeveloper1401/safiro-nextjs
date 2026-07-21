import { V1_PUBlIC_BASE_URL } from "@/utils/config";
import axios from "axios";

export const api = axios.create({
  baseURL: V1_PUBlIC_BASE_URL,
  timeout: Number(process.env.AXIOS_TIMEOUT) || 10000,
});

export const selfApi = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: Number(process.env.selfApiTimeOut) || 10000,
});

export const slefHttpsApi = axios.create({
  baseURL: "https://safiro.ir",
  timeout: Number(process.env.selfApiTimeOut) || 10000,
})