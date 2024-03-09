import axios from "axios";

const errorHandler = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") {
      console.log("connection problems..");
    } else if (error.code === "ERR_CANCELED") {
      console.log("connection canceled..");
    }
  }
};

export { errorHandler };
