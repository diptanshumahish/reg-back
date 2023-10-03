import crypto from "crypto";

const SECRET = "STUDENTS-CHAPTER-CSE";

export const random = () => crypto.randomBytes(128).toString("base64");

export function cleanString(input: string): string {
    const cleanedString = input.replace(/[\s\W]/g, "");
    const lowercaseString = cleanedString.toLowerCase();
    return lowercaseString;
}
export function cleanAndTrimToLastSix(input: string): string {
    const cleanedString = input.replace(/[\s\W]/g, "");
    const lowercaseString = cleanedString.toLowerCase();
    const lastSixDigits = lowercaseString.slice(-6);
    return lastSixDigits;
}

export const authentication = (salt: string, password: string) => {
    return crypto
        .createHmac("sha256", [salt, password].join("/"))
        .update(SECRET)
        .digest("hex");
};
