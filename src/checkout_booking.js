import axios from "axios";
import { checkoutBody } from "../utils/checkout.js";

export let checkout_Request = async (data_) => {
  try {
    const token = await axios({
      method: "POST",
      url: `https://naptapgo-api.azurewebsites.net/v1/users/generateToken`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        userId: "9xcb8b91e2d383f2e0b3afb",
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
    return response.data.payurl;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Error checkout:", error.response.data);
    } else {
      console.error("Error checkout:", error.message);
    }
  }
};
