export let user_phone_number;
export let user_phone_number_id;

export const userInfo = (req) => {
  user_phone_number_id =
    req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
  const contact = req.body.entry[0].changes[0].value.contacts[0];
  const profileName = contact.profile.name;
  const user_phone_number = contact.wa_id;
  console.log(user_phone_number, "   ", user_phone_number_id);
};
