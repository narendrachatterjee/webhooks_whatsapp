import { getRoomId } from "./roomIDStrorage.js";



export const getRoomDetails = (response) => {
    /* Private Pod Data Start */
        let setvisible_Firstroom = true,
          Firstroom_name,
          Firstroom_id,
          Firstroom_availableRooms,
          Firstroom_price,
          Firstroom_taxes,
          FirstRoom_img;

        const FirstRoomData = response[getRoomId("privatepod")];
        if (FirstRoomData != undefined) {
          Firstroom_name = FirstRoomData.roomTypeName;
          Firstroom_id = FirstRoomData.roomTypeId;
          const combos = FirstRoomData.combos;
          Firstroom_availableRooms = combos[0].availableRooms.toString();
          Firstroom_price = Object.values(
            combos[0].rates[0].priceMap
          )[0].toString();

          Firstroom_taxes = Object.values(
            combos[0].rates[0].taxes
          )[0].toString();

          FirstRoomAmount_withTax = Firstroom_price + Firstroom_taxes;
          FirstRoom_img = process.env.firstpodimg;
        } else {
          setvisible_Firstroom = false;
        }
        /* Private Pod Data End */

        /* Single Room Data Start */
        let setvisible_Secondroom = true,
          Secondroom_name,
          Secondroom_id,
          Secondroom_availableRooms,
          Secondroom_price,
          Secondroom_taxes,
          Secondroom_img;
        const SecondroomData = response[getRoomId("singleroom")];
        if (SecondroomData != undefined) {
          Secondroom_name = SecondroomData.roomTypeName;
          Secondroom_id = SecondroomData.roomTypeId;
          const combos = SecondroomData.combos;
          Secondroom_availableRooms = combos[0].availableRooms.toString();
          Secondroom_price = Object.values(
            combos[0].rates[0].priceMap
          )[0].toString();

          Secondroom_taxes = Object.values(
            combos[0].rates[0].taxes
          )[0].toString();

          SecondRoomAmount_withTax = Secondroom_price + Secondroom_taxes;

          Secondroom_img = process.env.secondpodimg;
        } else {
          setvisible_Secondroom = false;
        }
        /* Single Room Data End */

        /* Double Room Data Start */
        let setvisible_Thirdroom = true,
          Thirdroom_name,
          Thirdroom_id,
          Thirdroom_availableRooms,
          Thirdroom_price,
          Thirdroom_taxes,
          Thirdroom_img;
        const ThirdroomData = response[getRoomId("doubleroom")];
        if (ThirdroomData != undefined) {
          Thirdroom_name = ThirdroomData.roomTypeName;
          Thirdroom_id = ThirdroomData.roomTypeId;
          const combos = ThirdroomData.combos;
          Thirdroom_availableRooms = combos[0].availableRooms.toString();
          Thirdroom_price = Object.values(
            combos[0].rates[0].priceMap
          )[0].toString();

          Thirdroom_taxes = Object.values(
            combos[0].rates[0].taxes
          )[0].toString();

          ThirdRoomAmount_withTax = Thirdroom_price + Thirdroom_taxes;
          Thirdroom_img = process.env.thirdpodimg;
        } else {
          setvisible_Thirdroom = false;
        }
        /* Double Room Data End */

  return {
      data : {
            setvisible_Firstroom,
            ...(Firstroom_id ? { Firstroom_id } : {}),
            ...(Firstroom_name ? { Firstroom_name } : {}),
            ...(Firstroom_availableRooms ? { Firstroom_availableRooms } : {}),
            ...(Firstroom_price ? { Firstroom_price } : {}),
            ...(Firstroom_taxes ? { Firstroom_taxes } : {}),
            ...(FirstRoom_img ? {FirstRoom_img} : {}),
            setvisible_Secondroom,
            ...(Secondroom_id ? { Secondroom_id } : {}),
            ...(Secondroom_name ? { Secondroom_name } : {}),
            ...(Secondroom_availableRooms ? { Secondroom_availableRooms } : {}),
            ...(Secondroom_price ? { Secondroom_price } : {}),
            ...(Secondroom_taxes ? { Secondroom_taxes } : {}),
            ...(Secondroom_img ? {Secondroom_img} : {}),
            setvisible_Thirdroom,
            ...(Thirdroom_id ? { Thirdroom_id } : {}),
            ...(Thirdroom_name ? { Thirdroom_name } : {}),
            ...(Thirdroom_availableRooms ? { Thirdroom_availableRooms } : {}),
            ...(Thirdroom_price ? { Thirdroom_price } : {}),
            ...(Thirdroom_taxes ? { Thirdroom_taxes } : {}),
            ...(Thirdroom_img ? {Thirdroom_img} : {}),
          }
  };
};
