import userModel from "../schema/userSchema";

export async function getUser(req, res) {

    const { username, password } = req.body;

    const user = await userModel.findOne({ username: username }, "-password");
    return user;



}