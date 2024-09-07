import { arrival_time_, stay_duration } from "../utils/timeAndDuration.js";
import { RoomAvailability } from "./availability.js";
import { getRoomId } from "../utils/roomIDStrorage.js";
import { SCREEN_RESPONSES } from "./flow.js";
import { sendWhatsAppMessage } from "./api/booking_info.js";
import {
  validateEmail,
  validateRoomCount,
  validateStay,
  validGuestToRoomCount,
} from "../utils/validation.js";
import { guestCount } from "../utils/total_guest.js";
import { convertTimestampToDate, convertTimestampToDateAMPM } from "../utils/convertDateTime.js";
import { booking_data, summary } from "./summary.js";
import { checkout_Request } from "./checkout_booking.js";
import logger from "../logger/data_logger.js";

let currDate;

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;
  logger.info(`${new Date()} ${user_phone_number} ${action}: ${JSON.stringify(data)}`);
  console.log(JSON.stringify(data));
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
    logger.error(`Received client error: ${data}`);
    return {
      version,
      data: {
        acknowledged: true,
      },
    };
  }

  // handle initial request when opening the flow and display APPOINTMENT screen
  if (action === "INIT") {
    currDate = new Date();    
    return {
      ...SCREEN_RESPONSES.DETAILS,
    };
  }

  if (action === "data_exchange") {
    switch (screen) {
      case "DETAILS":
        let dataForward = { ...data };
        
        const phone = user_phone_number
        const nightstay_visible_status = data.staytype === "nightstay";
        const hourlystay_visible_status = data.staytype === "hourlystay";
        return {
          data: {
            nightstay_visible: nightstay_visible_status,
            hourlystay_visible: hourlystay_visible_status,
            arrivalTime: arrival_time_,
            stayDuration: stay_duration,
            totalGuest: guestCount,
            phone_number : phone, 
            ...data,
            ...dataForward,
          },
          ...SCREEN_RESPONSES.Stay,
        };

      case "Stay":
        let dataForward1 = { ...data };
        let check_in, check_out, check_in_text, check_out_text;
        const error = validateStay(data);
        if (error) {
          return {
            data: {
              error_head: error.message,
              error_text: error.message1,
              ...data,
            },
            ...SCREEN_RESPONSES.Error,
          };
        }

        if (data.staytype === "hourlystay") {
          check_in = convertTimestampToDate(
            Number(data.check_in_date),
            data.arrival_time
          );
          check_in_text = convertTimestampToDateAMPM(
            Number(data.check_in_date),
            data.arrival_time
          );
          check_out = convertTimestampToDate(
            Number(data.check_in_date),
            data.arrival_time,
            data.stay_duration
          );
          check_out_text = convertTimestampToDateAMPM(
            Number(data.check_in_date),
            data.arrival_time,
            data.stay_duration
          );
        } else if (data.staytype === "nightstay") {
          check_in = convertTimestampToDate(
            Number(data.check_in_date),
            data.arrival_time
          );
          check_in_text = convertTimestampToDateAMPM(
            Number(data.check_in_date),
            data.arrival_time
          );
          check_out = convertTimestampToDate(
            Number(data.check_out_date),
            data.arrival_time
          );
          check_out_text = convertTimestampToDateAMPM(
            Number(data.check_out_date),
            data.arrival_time
          );
        }

        const response = await RoomAvailability(
          data.location,
          check_in,
          check_out
        );
        let total_guest = Number(data.number_of_guests);
        // Fetch room details
        const FirstRoomData = response[getRoomId("privatepod")];
        const SecondRoomData = response[getRoomId("singleroom")];
        const ThirdRoomData = response[getRoomId("doubleroom")];

        const FirstRoomDetails = FirstRoomData
          ? {
              Firstroom_name: FirstRoomData.roomTypeName,
              Firstroom_id: FirstRoomData.roomTypeId,
              Firstroom_availableRooms:
                FirstRoomData.combos[0].availableRooms.toString(),
              Firstroom_ratePlanId: FirstRoomData.combos[0].rates[0].ratePlanId,
              Firstroom_price: Object.values(
                FirstRoomData.combos[0].rates[0].priceMap
              )[0].toString(),
              FirstRoomPrice_text:
                "Rate: \u20B9 " +
                (
                  Object.values(FirstRoomData.combos[0].rates[0].priceMap)[0] +
                  Object.values(FirstRoomData.combos[0].rates[0].taxes)[0]
                ).toFixed(2) +
                " (Click Here)",

              Firstroom_taxes: Object.values(
                FirstRoomData.combos[0].rates[0].taxes
              )[0].toString(),
              FirstRoom_img: process.env.privatePodImg,
              firstRoom_dropdown: validateRoomCount(
                FirstRoomData.combos[0].availableRooms,
                "firstRoom"
              ),
              setvisible_Firstroom: true,
            }
          : { setvisible_Firstroom: false };
        const SecondRoomDetails = SecondRoomData
          ? {
              Secondroom_name: SecondRoomData.roomTypeName,
              Secondroom_id: SecondRoomData.roomTypeId,
              Secondroom_availableRooms:
                SecondRoomData.combos[0].availableRooms.toString(),
              Secondroom_ratePlanId:
                SecondRoomData.combos[0].rates[0].ratePlanId,
              Secondroom_price: Object.values(
                SecondRoomData.combos[0].rates[0].priceMap
              )[0].toString(),
              SecondRoomPrice_text:
                "Rate: \u20B9 " +
                (
                  Object.values(SecondRoomData.combos[0].rates[0].priceMap)[0] +
                  Object.values(SecondRoomData.combos[0].rates[0].taxes)[0]
                ).toFixed(2) +
                " (Click Here)",

              Secondroom_taxes: Object.values(
                SecondRoomData.combos[0].rates[0].taxes
              )[0].toString(),
              SecondRoom_img: process.env.secondpodimg,
              secondRoom_dropdown: validateRoomCount(
                SecondRoomData.combos[0].availableRooms,
                "SecondRoom"
              ),
              setvisible_Secondroom: true,
            }
          : { setvisible_Secondroom: false };

        const ThirdRoomDetails = ThirdRoomData && Number(data.number_of_guests) > 1
          ? {
              Thirdroom_name: ThirdRoomData.roomTypeName,
              Thirdroom_id: ThirdRoomData.roomTypeId,
              Thirdroom_availableRooms:
                ThirdRoomData.combos[0].availableRooms.toString(),
              Thirdroom_ratePlanId: ThirdRoomData.combos[0].rates[0].ratePlanId,
              Thirdroom_ratePlanId: Object.values(
                FirstRoomData.combos[0].rates[0].ratePlanId
              )[0].toString(),
              Thirdroom_price: Object.values(
                ThirdRoomData.combos[0].rates[0].priceMap
              )[0].toString(),
              ThirdRoomPrice_text:
                "Rate: \u20B9 " +
                (
                  Object.values(ThirdRoomData.combos[0].rates[0].priceMap)[0] +
                  Object.values(ThirdRoomData.combos[0].rates[0].taxes)[0]
                )
                  .toFixed(2)
                  .toString() +
                " (Click Here)",
              Thirdroom_taxes: Object.values(
                ThirdRoomData.combos[0].rates[0].taxes
              )[0].toString(),
              ThirdRoom_img: process.env.thirdpodimg,
              thirdRoom_dropdown: validateRoomCount(
                ThirdRoomData.combos[0].availableRooms,
                "ThirdRoom"
              ),
              setvisible_Thirdroom: true,
            }
          : { setvisible_Thirdroom: false };
          
        return {
          data: {
            check_in_dateTime: check_in_text,
            check_out_dateTime: check_out_text,
            total_guest,            
            ...FirstRoomDetails,
            ...SecondRoomDetails,
            ...ThirdRoomDetails,
            ...dataForward1,
            ...data,
          },
          ...SCREEN_RESPONSES.Availability,
        };

      case "Availability":
        const firstRoomSelected = data.First_pod === "PRIVATEPOD";
        const secondRoomSelected = data.Second_pod === "ROOMPOD";
        const thirdRoomSelected = data.Third_pod === "DOUBLEPOD";

        const selection_count =
          (data.numberOfFirstPodSelected && firstRoomSelected
            ? Number(data.numberOfFirstPodSelected)
            : 0) +
          (data.numberOfSecondPodSelected && secondRoomSelected
            ? Number(data.numberOfSecondPodSelected)
            : 0) +
          (data.numberOfThirdPodSelected && thirdRoomSelected
            ? Number(data.numberOfThirdPodSelected * 2)
            : 0);

        const firstroomdata =
          data.First_pod === "PRIVATEPOD"
            ? {
                First_pod: data.First_pod,
                numberOfFirstPodSelected: data.numberOfFirstPodSelected,
                Firstroom_name: data.Firstroom_name,
                Firstroom_id: data.Firstroom_id,
                Firstroom_availableRooms: data.Firstroom_availableRooms,
                Firstroom_price: data.Firstroom_price,
                Firstroom_ratePlanId: data.Firstroom_ratePlanId,
                Firstroom_taxes: data.Firstroom_taxes,
                setvisible_Firstroom: data.setvisible_Firstroom,
              }
            : { setvisible_Firstroom: data.setvisible_Firstroom };

        const secondroomdata =
          data.Second_pod === "ROOMPOD"
            ? {
                Second_pod: data.Second_pod,
                numberOfSecondPodSelected: data.numberOfSecondPodSelected,
                Secondroom_name: data.Secondroom_name,
                Secondroom_id: data.Secondroom_id,
                Secondroom_availableRooms: data.Secondroom_availableRooms,
                Secondroom_price: data.Secondroom_price,
                Secondroom_ratePlanId: data.Secondroom_ratePlanId,
                Secondroom_taxes: data.Secondroom_taxes,
                setvisible_Secondroom: data.setvisible_Secondroom,
              }
            : { setvisible_Secondroom: data.setvisible_Secondroom };

        const thirdroomdata =
          data.Third_pod === "DOUBLEPOD"
            ? {
                Third_pod: data.Third_pod,
                numberOfThirdPodSelected: data.numberOfThirdPodSelected,
                Thirdroom_name: data.Thirdroom_name,
                Thirdroom_id: data.Thirdroom_id,
                Thirdroom_availableRooms: data.Thirdroom_availableRooms,
                Thirdroom_price: data.Thirdroom_price,
                Thirdroom_ratePlanId: data.Thirdroom_ratePlanId,
                Thirdroom_taxes: data.Thirdroom_taxes,
                setvisible_Thirdroom: data.setvisible_Thirdroom,
              }
            : { setvisible_Thirdroom: data.setvisible_Thirdroom };
        const error_ = validGuestToRoomCount(
          selection_count,
          Number(data.number_of_guests)
        );
        if (error_.status) {
          return {
            data: {
              error_head: error_.message,
              error_text: error_.message1,
              ...data,
            },
            ...SCREEN_RESPONSES.Error,
          };
        } else {
          return {
            data: {
              staytype: data.staytype,
              location: data.location,
              number_of_guests: data.number_of_guests,
              check_in_dateTime: data.check_in_dateTime,
              check_out_dateTime: data.check_out_dateTime,
              phone_number : data.phone_number,
              phone_number_text : Number(data.phone_number.substring(2)),
              ...firstroomdata,
              ...secondroomdata,
              ...thirdroomdata,
            },
            ...SCREEN_RESPONSES.Personal_details,
          };
        }

      case "Personal_details":
        let dataForward3 = { ...data };
        const email = data.email_main;
        const error_email = validateEmail(email);
        const fname_label = "First Name : " + data.first_name_main;
        const lname_label = "Last Name : " + data.last_name_main;

        if (error_email.status === false) {
          return {
            data: {
              error_head: error_email.message,
              error_text: error_email.message1,
              ...data,
            },
            ...SCREEN_RESPONSES.Error,
          };
        } else {
          return {
            data: {
              totalguest: Number(data.number_of_guests),
              fname_label,
              lname_label,
              ...dataForward3,
              ...data,
            },
            ...SCREEN_RESPONSES.Guest_details,
          };
        }

      case "Guest_details":
        let dataForward4 = { ...data };
        let firstGuest_fname, firstGuest_lname;
        firstGuest_fname =
          data.first_name_guest1 != undefined
            ? data.first_name_guest1
            : data.first_name_main;
        firstGuest_lname =
          data.last_name_guest1 != undefined
            ? data.last_name_guest1
            : data.last_name_main;

        return {
          data: {
            firstGuest_fname: firstGuest_fname,
            firstGuest_lname: firstGuest_lname,
            ...dataForward4,
            ...data,
            ...summary(data),
          },
          ...SCREEN_RESPONSES.summary,
        };

      case "summary":
        let url = await checkout_Request(data);
        sendWhatsAppMessage(booking_data(data, url));
        return {
          data: {},
          ...SCREEN_RESPONSES.completeBooking,
        };

      default:
        return {
          data: {
            error_head: "Screen does not exist",
            error_text: "Please try again",
            ...data,
          },
          ...SCREEN_RESPONSES.Error,
        };
    }
  }
};
