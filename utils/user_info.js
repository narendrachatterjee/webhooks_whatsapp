export let user_phone_number;
export let user_phone_number_id;

export const userInfo = (req) =>{
    
    user_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    user_phone_number = req.body.entry?.[0].changes?.[0].value?.statuses?.[0]?.recipient_id;
    console.log(user_phone_number, "   ",user_phone_number_id )
}