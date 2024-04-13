import axios from "axios";
import toast from "react-hot-toast";

export const errorHandler = (err: unknown) => {
	if (err === null) throw new Error("Unrecoverable error!! Error is null!");
	if (axios.isAxiosError<{ message: string }>(err)) {
		if (err.code === "ERR_NETWORK") {
			console.log("connection problems..");
			return toast.error("Network connection problem...");
		} else if (err.code === "ERR_CANCELED") {
			console.log("connection canceled..");
			toast.error("connection canceled..");
		} else if (!err?.response) {
			toast.error("Something went wrong");
		} else {
			toast.error(err.response?.data.message);
		}
	}
};
