import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getme} from '../services/auth.api';

export const useAuth = ()=>{

    const context = useContext(AuthContext)

    const {user,setUser,loading,setLoading} = context

    const handleLogin = async ({email,password}) =>{
        setLoading(true)
        try {
            const data = await login({email, password})
            setUser(data.user)   
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({username, email, password})=>{
        setLoading(true)
        try {
            const data = await register({username, email,password})
            setUser(data.user)
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    const handleLogout = async ()=>{
        setLoading(true)
        await logout()
        setUser(null)
        setLoading(false)
    }

    async function handleGetMe(){
        setLoading(true)
        const data = await getme()
        setUser(data.user)
        setLoading(false)
    }   
    
    useEffect(()=>{
        
        const getAndSetUser = async ()=>{
            try{
                const data = await getme()
                setUser(data.user)
            }catch(err){
                console.log(error)
            }finally{
                setLoading(false)
            }
    }
        getAndSetUser()
    },[])
    return {user,loading,handleRegister,handleLogin,handleLogout,handleGetMe}
}