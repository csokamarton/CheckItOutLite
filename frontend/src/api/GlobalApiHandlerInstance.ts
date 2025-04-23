import axios from "axios";

const GlobalApiHandlerInstance = axios.create({
    baseURL: "http://backend.vm1.test/api",
    headers:{
        "Accept": "application/json",
        "Content-Type": "application/json" 
    }
});

export default GlobalApiHandlerInstance;