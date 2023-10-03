import {
    authentication,
    cleanAndTrimToLastSix,
    cleanString,
    random,
} from "../helpers";
import { createUser, getUserByUserName, getUsersByEmail } from "../db/users";
import express from "express";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).send("Missing fields");
        }
        const user = await getUsersByEmail(email).select(
            "+authentication.salt +authentication.password"
        );
        if (!user) {
            return res.status(402).send("Not registered");
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.status(402).send("Incorrect Password");
        }
        const salt = random();
        user.authentication.sessionToken = authentication(
            salt,
            user._id.toString()
        );
        await user.save();
        res.cookie("sccse-cookie", user.authentication.sessionToken);
        return res.status(200).json(user).end();
    } catch (error) {
        console.error(error);
        return res.status(400).send("Try again please");
    }
};

//! only sub-admin registration through admin app
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, fullName, rollNumber, phoneNumber } = req.body;
        const existingUser = await getUsersByEmail(email);
        const username = `${cleanString(fullName)}${cleanAndTrimToLastSix(
            rollNumber
        )}`;
        console.log(username);
        const usernameTaken = await getUserByUserName(username);
        if (existingUser) {
            return res.status(401).send("already existing user");
        }
        if (usernameTaken) {
            return res.status(401).send("userName in use");
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            rollNumber,
            phoneNumber,
            isAdmin: false,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.status(400).send("try again");
    }
};
