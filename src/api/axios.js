// Make sure this file is located at: D:\NapTapGo\ntg-whatsapp\Whatsapp flow endpoint\src\api\axios.js
import axios from 'axios';
import axiosConfig from './config';

const axiosInstance = axios.create(axiosConfig);

export default axiosInstance;
