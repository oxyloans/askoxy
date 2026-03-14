// const userType = "live"

// const BASE_URL = userType === "live" 
//     ? "https://meta.oxyloans.com/api" 
//     : "https://meta.oxyglobal.tech/api";

// export default BASE_URL;

const userType = localStorage.getItem("userType") || "live";

const BASE_URL =
  userType === "live"
    ? "https://meta.oxyloans.com/api"
    : "https://meta.oxyglobal.tech/api";
    
// encrypted URL
const encryptedUploadUrl =
"aHR0cHM6Ly9veHlicmlja3N2MS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vbnVsbC80NTg4MGU2Mi1hY2FmLTQ2NDUtYTgzZS1kMWM4NDk4ZTkyM2U="

// decrypt function
export const uploadurlwithId = atob(encryptedUploadUrl);

export default BASE_URL;

