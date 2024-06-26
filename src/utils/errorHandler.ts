import axios from "axios";
import toast from "react-hot-toast";

export const errorHandler = (err: unknown) => {
	if (err === null) throw new Error("Unrecoverable error!! Error is null!");
	if (axios.isAxiosError<{ message: string }>(err)) {
		console.log(err.code);
		console.log(err.message);
		if (err.code === "ERR_NETWORK") {
			return toast.error("Network connection problem...");
		} else if (err.code !== "ERR_CANCELED") {
			if (err.code === "ERR_BAD_RESPONSE") {
				return toast.error("Something went wrong");
			} else if (!err?.response) {
				toast.error("Something went wrong");
			} else {
				toast.error(err.response?.data.message);
			}
		}
	}
};
