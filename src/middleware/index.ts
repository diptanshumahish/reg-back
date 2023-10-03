import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, "identity._id") as string;
        if (!currentUserId) {
            return res.status(400).send("can't delete");
        }
        if (currentUserId.toString() !== id) {
            return res.status(300).send("can'ty delete others");
        }
        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const isAuthenticated = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const sessionToken = req.cookies["sccse-cookie"];
        if (!sessionToken) {
            return res.status(301).send("Session expired");
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.status(305).send("invalid token");
        }
        merge(req, { identity: existingUser });
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
