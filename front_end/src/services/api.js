import axios from 'axios'
//import { getToken } from './auth'

const api = axios.create({
  baseURL: 'http://localhost:3005'     
})


export default api