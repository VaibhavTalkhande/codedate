/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import { useState,useEffect,useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { IoClose, IoHeartSharp } from 'react-icons/io5';
import toast from 'react-hot-toast';

const Profile = () => {
  const [currentUserIndex,setCurrentUserIndex] = useState(0);
  const [users,setUsers] = useState([]);
  const {user} = useContext(AppContext);
  const getUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/getUsers");
    const { data } = await res.data;
    console.log(data);
    const filteredUsers = data.filter(
      (u) =>
        u._id !== user?._id &&
        !user?.disliked?.includes(u._id) &&
        !user?.favourites?.includes(u._id)
    );
    setUsers(filteredUsers);
    console.log(users);
  };
  const refilterUsers = () => {
    const filteredUsers = users.filter(
      (u) =>
        u._id !== user?._id &&
        !user?.disliked?.includes(u._id) &&
        !user?.favourites?.includes(u._id)
    );
    setUsers(filteredUsers);
  };
  const nextProfile = () =>{
    if(currentUserIndex<users.length-1){
      setCurrentUserIndex(currentUserIndex+1);
    }else{
      setCurrentUserIndex(0);
    }
  }
  const addToFav = async(id)=>{
    const res= await axios.put(
      "http://localhost:5000/api/addToFav/"+id,
      null,
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.data;
    if(data.success===true){
      toast.success(data.message);
      refilterUsers();
      nextProfile();
    }
    else{
      toast.error(data.message);
    }
  }
  const addToDis = async(id)=>{
    const res = await axios.put(
      "http://localhost:5000/api/addToDis/"+id,
      null,
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.data;
    if(data.success===true){
      toast.success(data.message);
      refilterUsers();
      nextProfile();
    }else{
      toast.error(data.message);
    }
  };
  useEffect(()=>{
    getUsers();
    refilterUsers();
  }, [user]);

  return (
    
    <div className="flex justify-center items-center my-10 sm:my-32">
        {users.length>0 ? (
              <div className="rounded-lg shadow-primaryLight shadow-sm w-[75vw] h-[80vw] sm:w-[25vw] sm:h-[60vh] overflow-hidden relative">
              <img
                src={users[currentUserIndex]?.profile}
                alt={users[currentUserIndex]?.profile}
                className="rounded-lg object-coverw-full h-full transition-all duration-300 ease-in-out transfrom hover:scale-105 cusor-pointer"
              />
              <div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h1 className="text-white text-2xl font-semibold">
                    {users[currentUserIndex]?.name}
                  </h1>
                  <p className="text-white">{users[currentUserIndex]?.email}</p>
                  <div className="flex justify-between items-center mt-2">
                    {/* close button */}
                    <div className="bg-gray-800 rounded-full overflow-hidden hover:bg-red-500 p-2 transition-all duration-300 ease-in-out cursor-pointer">
                      <IoClose
                        onClick={() => addToDis(users[currentUserIndex]?._id)}
                        className="text-red-500 text-3xl hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer hover:text-white"
                      />
                    </div>
                    {/* like button */}
                    <div className="bg-gray-800 rounded-full overflow-hidden hover:bg-blue-500 p-2 transition-all duration-300 ease-in-out cursor-pointer">
                      <IoHeartSharp
                        onClick={() => addToFav(users[currentUserIndex]?._id)}
                        className="text-blue-500 text-3xl hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer hover:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              
              <h1 className="text-3xl font-bold text-white">No users found</h1>
            
            )}
    </div> 
  )
}

export default Profile