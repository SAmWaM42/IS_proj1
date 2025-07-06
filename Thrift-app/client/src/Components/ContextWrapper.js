import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

export const GlobalContext=createContext();
export const ContextProvider=({children})=>
{
    const [loggedIn,setLoggedIn]=useState(false);
    const [gottenSelf,setGottenSelf]=useState(false);
    const [cartVisible,setCartVisible]= useState(false);
    const [myData,setMyData]=useState({});
    

    const getSelf=useCallback(async ()=>
    {
      try
      {
        const response=await fetch("http://localhost:5000/user/me",{credentials:'include'})
        if(!response.ok)
        {
          throw new Error("fetch self failed");
        }

        if(response)
        {
          setLoggedIn(true);
          const result=await response.json();
          setMyData(result);
        }

      }
      catch(err)
      {
            console.error("error validating self",err.message);
      }
      finally
      {
        setGottenSelf(true);
      }

    },[]);
    useEffect(()=>{
        getSelf();
    },[])

    const handleUpdate=({myData,loggedIn})=>
    {
      setMyData(myData);
      setLoggedIn(loggedIn);

    }
    const contextData=
    {
        cartVisible,
        setCartVisible,
        loggedIn,
        myData,
        handleUpdate

    }

    return(
        <GlobalContext.Provider value={contextData}>
            {children}
     </GlobalContext.Provider>

    );



}