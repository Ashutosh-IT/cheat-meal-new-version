import { createContext, useEffect, useState } from "react";
import axios from "axios"

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [CartItem,setCartItem] = useState({});
    const url = "https://cheat-meal-backend.onrender.com";
    const [token,setToken] = useState("");

    const [food_list, setFoodList] = useState([]);
    
    
    const addToCart = async(itemId) => {
        if(!CartItem[itemId]){
            setCartItem((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }

        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
        }
    }

    const removeFromCart = async(itemId) => {
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
        }

    }

    const getTotalCartAmount = ()=>{
        let totalAmount = 0;
        for(const item in CartItem){
            if(CartItem[item] > 0){
                let itemInfo = food_list.find((product)=>product._id === item)
                totalAmount += itemInfo.price*CartItem[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async()=>{
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }

    const loadCartData = async(token)=>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItem(response.data.cartData);
    }

    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[]);
    


    const contextValue = {
        food_list,
        CartItem,
        setCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }


 

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
