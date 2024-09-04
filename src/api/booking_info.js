import axios from "axios";

export const sendWhatsAppMessage = async (data) => {
    try {
        const url = process.env.msgURL;
        const headers = {
            'Authorization': `Bearer ${process.env.metatoken}`,
            'Content-Type': 'application/json'
        };

        console.log(url, data, headers);

        const response = await axios.post(url, data, { headers });
        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.message);
        if (error.response) {
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request error:', error.message);
        }
    }
};
