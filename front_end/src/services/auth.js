import Moment from 'moment'
export const TOKEN_KEY = "@w3inovA-toKen"

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;

export const getUser = (name = null) => { 
    const user = localStorage.getItem(TOKEN_KEY)
    return name ? user.name : user
}
export const login = (data) => {
    data.date_access = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss") 
    console.log(data) 
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data))
    
}

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/login'
}