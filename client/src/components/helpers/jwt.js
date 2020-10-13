export const getToken =()=>{
    return localStorage.getItem('access_token');
}

export const clearToken=()=>{
    localStorage.clear('access_token')
}