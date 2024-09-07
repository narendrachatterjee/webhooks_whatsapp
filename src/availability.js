import axios from "axios";
import logger from "../logger/data_logger.js";
export const RoomAvailability = async (hotel, checkInDateTime, checkOutDateTime) => {
    try {
      const token = await axios({
        method: 'POST',
        url: `https://naptapgo-api.azurewebsites.net/v1/users/generateToken`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
            "userId":"9xcb8b91e2d383f2e0b3afb"
          }
      });
      const response = await axios({
      method: 'POST',
      url: `https://naptapgo-api.azurewebsites.net/v1/hotels/searchHotel`,
      headers: {
        'Authorization': `Bearer ${token.data.accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
          hotelId: hotel,
          checkInDateTime: checkInDateTime,
          checkOutDateTime: checkOutDateTime,
          discountCoupon: ""
      }
    });
    return response.data.roomTypeMap;
    } 
    catch (error) {
      if (error.response && error.response.data) {
        logger.error(`Error sending message: ${error.response.data}`);
      } else {
        logger.error(`Error sending message: ${error.message}`);
      }
    }
  };