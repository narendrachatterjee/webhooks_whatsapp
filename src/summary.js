import { locations } from "../utils/location.js";
import { staytypes } from "../utils/typeOfStay.js";
import { user_phone_number } from "../utils/user_info.js";

export const summary = (data) => {
  let hotel = locations.find(location => location.id == data.location).title;
  let stay_type = staytypes.find(staytype => staytype.id == data.staytype).title;

  let room_type = (data.First_pod === 'PRIVATEPOD') ? "Private Pod " : "";
  let room_type_1 = (data.Second_pod === 'ROOMPOD') ? "Private Pod Suite " : "";
  let room_type_2 = (data.Third_pod === 'DOUBLEPOD') ? "Double Pod Suite " : "";
  let final_room_type = [room_type, room_type_1, room_type_2].filter(Boolean).join(" & ");

  let amount = (Number((data.First_pod == 'PRIVATEPOD') ? data.Firstroom_price * data.numberOfFirstPodSelected : 0)
  + 
  Number((data.Second_pod == 'ROOMPOD') ? data.Secondroom_price * data.numberOfSecondPodSelected : 0 )
  + 
  ((data.Third_pod == 'DOUBLEPOD') ? data.Thirdroom_price * data.numberOfThirdPodSelected : 0))
  let tax = 
    (data.First_pod === 'PRIVATEPOD') ? data.Firstroom_taxes * data.numberOfFirstPodSelected : 0 + 
    (data.Second_pod === "ROOMPOD") ? data.Secondroom_taxes * data.numberOfSecondPodSelected : 0 + 
    (data.Third_pod === "DOUBLEPOD") ? data.Thirdroom_taxes * data.numberOfThirdPodSelected : 0;

  let total = (amount + tax).toFixed(2);
 
  return {
    hotel,
    stay_type,
    final_room_type,
    amount,
    tax,
    total,
    summaryHeading: "Booking Summary\n\n",
    bookingDetail: `Hotel: ${hotel}\nStay Type : ${stay_type}\nRoom Type : ${final_room_type}\nCheck In : ${data.check_in_dateTime}\nCheck Out : ${data.check_out_dateTime}\nAmount: \u20B9 ${amount.toFixed(2)}\nTax: \u20B9 ${tax.toFixed(2)}\nTotal Payable: \u20B9 ${total}`,
  };
};

export const booking_data = (data, url) => {
  const {
    hotel,
    stay_type,
    final_room_type,
    amount,
    tax,
    total,
  } = summary(data);
  let phone_number = (data.phone_main).toString();

  return {
    messaging_product: "whatsapp",
    to: phone_number,
    type: "template",
    template: {
      name: "ntg_booking_payment",
      language: {
        code: "en_US",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: data.first_name_main,
            },
            {
              type: "text",
              text: data.check_in_dateTime,
            },
            {
              type: "text",
              text: data.check_out_dateTime,
            },
            {
              type: "text",
              text: final_room_type,
            },
            {
              type: "text",
              text: `\u20B9 ${total}`,
            },
            {
              type: "text",
              text: hotel,
            },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: url.slice(url.indexOf("links")),
            },
          ],
        },
      ],
    },
  };
}
