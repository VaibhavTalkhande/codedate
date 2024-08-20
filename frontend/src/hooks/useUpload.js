import axios from "axios";
export const useUpload = async({image,onUploadProgress})=>{
    const upload = async()=>{
        try {
            const formData = new FormData();
            formData.append("file",image);
            formData.append("upload_preset","codedate");
            formData.append("api_key","996145574391251");
            const config ={
                headers:{
                    "Content-Type":"multiple/form-data",
                },
                onUploadProgress:onUploadProgress,
                withCredentials:false,
            };
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dmy2vzkgj/image/upload",
                formData,
                config
              );
              const data = await res.data;
              if (!data) throw new Error("Error uploading image");
        
              return {
                public_id: data.public_id,
                url: data.secure_url,
              };
        }catch(error){
            return error.message;
        }
    }
    const {public_id,url} = await upload();
    return {public_id,url};
}