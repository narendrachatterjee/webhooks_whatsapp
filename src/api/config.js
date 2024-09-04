// Make sure this file is located at: D:\NapTapGo\ntg-whatsapp\Whatsapp flow endpoint\src\api\axios.config.js
import axios from 'axios';

const axiosConfig = {
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    "Content-type": "application/json",
  },
};

export default axiosConfig;
