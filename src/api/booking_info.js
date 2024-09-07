import axios from "axios";
import logger from "../../logger/data_logger.js";

export const sendWhatsAppMessage = async (data) => {
    try {
        const url = process.env.msgURL;
        const headers = {
            'Authorization': `Bearer ${process.env.metatoken}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(url, data, { headers });
        logger.info(`Message sent: ${JSON.stringify(response.data)}`);
    } catch (error) {
        logger.error(`Error sending message: ${error.message}`);
        if (error.response) {
            logger.error(`Response error: ${error.response.data}`);
        } else if (error.request) {
            logger.error(`No response received: ${error.request}`);
        } else {
            logger.error(`Request error: ${error.message}`);
        }
    }
};
