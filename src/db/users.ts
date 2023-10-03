import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    rollNumber: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
});

export const userModel = mongoose.model("User", UserSchema);

export const getUsersByEmail = (email: string) => userModel.findOne({ email });
export const getUserByUserName = (username: string) =>
    userModel.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) =>
    userModel.findOne({
        "authentication.sessionToken": sessionToken,
    });
export const getUserById = (id: string) => userModel.findById(id);
export const createUser = (values: Record<string, any>) =>
    new userModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
    userModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
    userModel.findByIdAndUpdate(id, values);
