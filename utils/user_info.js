export let user_phone_number;
export let user_phone_number_id;
export let user_profile_Name

export const userInfo = (req) => {
  user_phone_number_id =
    req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
  const contact = req.body.entry[0].changes[0].value.contacts[0];
  user_profile_Name = contact.profile.name;
  user_phone_number = contact.wa_id;
};
