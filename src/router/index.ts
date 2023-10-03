import express from "express";
import authentication from "../router/authentication";
const router = express.Router();

export default (): express.Router => {
    authentication(router);
    return router;
};
