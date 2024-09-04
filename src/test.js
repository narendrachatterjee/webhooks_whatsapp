import {
  convertTo24HourFormat,
  formatTimestamp,
  monthformat,
  addHoursToDate,
} from "./utils.js";
import { RoomAvailability } from "./availability.js";
import { getRoomId } from "./roomIDStrorage.js";
import { imageLinkToBase64 } from "./imgToBase64.js";
import { SCREEN_RESPONSES } from "./flow.js";
import { sendWhatsAppMessage } from "./api/booking_info.js";

let hotel;
let stay_type;
let room_type;
let check_in;
let check_out;
let amount;
let tax;

export const getNextScreen = async (decryptedBody) => {
  try {
    const { screen, data, version, action, flow_token } = decryptedBody;

    // handle health check request
    if (action === "ping") {
      return {
        version,
        data: {
          status: "active",
        },
      };
    }

    // handle error notification
    if (data?.error) {
      console.warn("Received client error:", data);
      return {
        version,
        data: {
          acknowledged: true,
        },
      };
    }

    // handle initial request when opening the flow and display APPOINTMENT screen
    if (action === "INIT") {
      return {
        ...SCREEN_RESPONSES.DETAILS,
      };
    }

    if (action === "data_exchange") {
      switch (screen) {
        case "DETAILS":
            //console.log("Hello",SCREEN_RESPONSES.DETAILS);
          return {
            ...SCREEN_RESPONSES.DETAILS,
          };
      }
    }
  } catch (error) {
    //console.log(error.message);
  }
};
