export const checkoutBody = (data) => {
  // Create roomGuest array dynamically based on the number of guests
  const roomGuest = [];
  for (let i = 1; i <= data.number_of_guests; i++) {
    const guest = {
      firstName: String(data[`first_name_guest${i}`]),
      lastName: String(data[`last_name_guest${i}`]),
    };

    roomGuest.push({
      roomNumber: i,
      guest: [guest],
    });
  }

  // Calculate total number of selected rooms
  const totalRoomsSelected =
    parseInt(data.numberOfFirstPodSelected || 0) +
    parseInt(data.numberOfSecondPodSelected || 0) +
    parseInt(data.numberOfThirdPodSelected || 0);

  // Create roomStayDetail array dynamically based on the room selections
  const roomStayDetail = [];
  let roomCount = 1;

  // Helper function to add rooms
  const addRooms = (count, roomData) => {
    for (let i = 1; i <= parseInt(count || 0); i++) {
      roomStayDetail.push({
        numAdults: roomData.numAdults,
        numChildren: 0,
        numChildren1: 0,
        ratePlanId: String(roomData.ratePlanId),
        roomIdAssigned: `RM_${roomCount++}`,
        roomName: String(roomData.roomName),
        roomTypeId: String(roomData.roomTypeId),
        roomRatePlanName: "EP",
        roomRatePrice: parseFloat(roomData.price).toFixed(2), // Keep as float with 2 decimals
        roomRateTax: parseFloat(roomData.taxes).toFixed(2), // Keep as float with 2 decimals
      });
    }
  };

  // Add first pod rooms
  addRooms(data.numberOfFirstPodSelected, {
    numAdults: 1,
    ratePlanId: data.Firstroom_ratePlanId,
    roomName: data.Firstroom_name,
    roomTypeId: data.Firstroom_id,
    price: parseFloat(data.Firstroom_price).toFixed(2),
    taxes: parseFloat(data.Firstroom_taxes).toFixed(2),
  });

  // Add second pod rooms
  addRooms(data.numberOfSecondPodSelected, {
    numAdults: 1,
    ratePlanId: data.Secondroom_ratePlanId,
    roomName: data.Secondroom_name,
    roomTypeId: data.Secondroom_id,
    price: parseFloat(data.Secondroom_price).toFixed(2),
    taxes: parseFloat(data.Secondroom_taxes).toFixed(2),
  });

  // Add third pod rooms
  addRooms(data.numberOfThirdPodSelected, {
    numAdults: 2,
    ratePlanId: data.Thirdroom_ratePlanId,
    roomName: data.Thirdroom_name,
    roomTypeId: data.Thirdroom_id,
    price: parseFloat(data.Thirdroom_price).toFixed(2),
    taxes: parseFloat(data.Thirdroom_taxes).toFixed(2),
  });

  const result = {
    checkoutRequest: {
      mainGuest: {
        mgFirstName: String(data.first_name_main),
        mgLastName: String(data.last_name_main),
        mgEmailId: String(data.email_main),
        mgMobileNo: String(data.phone_main),
      },
      roomGuest: {
        roomGuest: roomGuest.map((guest) => ({
          roomNumber: guest.roomNumber,
          guest: guest.guest.map((g) => ({
            firstName: String(g.firstName),
            lastName: String(g.lastName),
          })),
        })),
      },
      roomStayDetail: roomStayDetail.map((room) => ({
        numAdults: room.numAdults,
        numChildren: room.numChildren,
        numChildren1: room.numChildren1,
        ratePlanId: String(room.ratePlanId),
        roomIdAssigned: String(room.roomIdAssigned),
        roomName: String(room.roomName),
        roomTypeId: String(room.roomTypeId),
        roomRatePlanName: String(room.roomRatePlanName),
        roomRatePrice: parseFloat(room.roomRatePrice), // Keep as float
        roomRateTax: parseFloat(room.roomRateTax), // Keep as float
      })),
      hotelInfo: {
        checkIn: String(data.check_in_dateTime),
        checkOut: String(data.check_out_dateTime),
        hotelId: String(data.location),
      },
    },
  };
  return result;
};
