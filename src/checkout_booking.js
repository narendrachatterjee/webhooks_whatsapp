import axios from "axios";
import { checkoutBody } from "../utils/checkout.js";
import logger from "../logger/data_logger.js";

export let checkout_Request = async (data_) => {
  try {
    const token = await axios({
      method: "POST",
      url: `https://naptapgo-api.azurewebsites.net/v1/users/generateToken`,
      headers: {
        "Content-Type": "application/json",   
      },
      data: {
        userId: process.env.userId,
      },
    });

    const response = await axios({
      method: "POST",
      url: `https://naptapgo-api.azurewebsites.net/v1/bookings/checkout`,
      headers: {
        Authorization: `Bearer ${token.data.accessToken}`,
        "Content-Type": "application/json",
      },
      data: checkoutBody(data_),
    });
    logger.info(`${new Date()} "user_phone: : ${response}`)
    return response.data.payurl;
  } catch (error) {
    if (error.response && error.response.data) {
      logger.error(`Error checkout: ${error.response.data}`);
    } else {
      logger.error(`Error checkout: ${error.message}`);
    }
  }
};
