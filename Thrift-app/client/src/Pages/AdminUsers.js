
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function AdminUser()
{


    const navigate = useNavigate();

    const url = "http://localhost:5000/user/get-users";
    const removeUrlBase="http://localhost:5000/user/remove-user";
    
 
   
    const [users,setUsers] = useState([]);
    const [LoadingUsers, setLoadingUsers] = useState(true); 
    const [searchValues,setSearchValues]=useState(null)
    
    

    useEffect(() => {
        try {
            fetch(url,{credentials:'include'}).then(response => response.json()).then(data => setUsers(data))
        }
        catch (error) {
            console.error('Error fetching   users:', error);
            setLoadingUsers(false);
        }
        finally {
            setLoadingUsers(false)
        }
    }, [url]);

   
        const Search=async (e)=>
        {
            e.preventDefault()
            try{
                let urlS;
                if(!searchValues || !searchValues.search || searchValues.search.trim() === '')
                {
                  urlS=url;
                }else
                {
                  urlS=`http://localhost:5000/user/search/${searchValues.search}`;
                }
            const response= await fetch(urlS,{credentials:'include'});
            if(!response.ok)
            {
                 throw new Error("error getting data");

            }
            const result= await response.json();
          
            setUsers(result);
            

            }
            catch(err)
            {
                console.log(err.message);
               
            }
            
           

        }
           const handleInputChange = (e) => {
        const { name, value } = e.target;
          console.log(`Input changed: Name=${name}, Value=${value}`);
        setSearchValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }))
    };
    


    const removeUser =async (id)=>
    {
        try
        {
         const response = await fetch(`${removeUrlBase}/${id}`,{credentials:'include'});
         if(!response.ok)
         {
            throw new Error("error removing product")

         }

         const result=await response.json();
         alert(result.message); 


        }
        catch(err)
        {
            alert("error removing product",err)
        }
           

    }
    if(LoadingUsers)
    {
        return(
            <div>
                Loading Users......
            </div>

        );
    }

    return (

        <div className="browse-container">
            <h1>Your current    users</h1>
            {
               
                (   users.length) ? (
                    <div>
                        <form onSubmit={Search} >
                            <input type='text' name='search' onChange={handleInputChange}></input>
                            <button  type='submit'>Search</button>
                        </form>
                    <div className="product-list">
                        {

                        users.map((data) =>
                         <div>
                            <h1>{data.name}</h1>
                            <p>{data.role}</p>
                            <p>{data.email}</p>
                            <p>{data.phoneNumber}</p>
                            
       
                                <button  onClick={()=>removeUser(data._id)}>Remove User</button>
                        </div>
                            )
                        }
                    </div>


                    </div>
                ) :
                    (<div>

                        <p>No   users available</p>
                    </div>
                    )

            }

        </div>

    )

}


export default  AdminUser;