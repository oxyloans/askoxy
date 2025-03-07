const userType = "live"

const BASE_URL = userType === "live" 
    ? "https://meta.oxyloans.com/api" 
    : "https://meta.oxyglobal.tech/api";

export default BASE_URL;

