import axios , {type AxiosInstance } from "axios"
import type { Category, Content, LinkType, AuthResponse } from "../types";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers : {
    "Content-Type":"application/json"
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') ;
  if(token && config.headers){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config ;
})

export const authApi = {
  register : (username : string , password : string) => api.post<AuthResponse>("/auth/register",{username , password}).then(res => res.data) ,
  login : (username: string , password: string) => 
    api.post<AuthResponse>("/auth/login", {username, password})
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.response?.data?.message || 'Login failed');
      })
}

export const categoriesApi = {
  getAll : () => api.get<Category[]>("/category").then(res => res.data) ,
  create : (name : string) => api.post<Category>("/category",{name}).then(res => res.data) ,
  update : (categoryId : string , name : string) => api.patch<Category>(`/category/${categoryId}`,{name}).then(res => res.data) ,
  delete : (categoryId : string) => api.delete<void>(`/category/${categoryId}`).then(res => res.data)
}

export const contentApi = {
  getAll : () => api.get<Content[]>("/content").then(res => res.data) ,
  create : (data : Partial<Content>) => api.post<Content>("/content",data).then(res => res.data) ,
  update : (contentId : string , data : Partial<Content>) => api.patch<Content>(`/content/${contentId}`,data).then(res => res.data) ,
  delete : (contentId : string) => api.delete<void>(`/content/${contentId}`).then(res => res.data)
}

export default api ;