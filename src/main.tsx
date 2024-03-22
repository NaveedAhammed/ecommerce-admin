import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AdminContextProvider } from "./context/AdminContext.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<AdminContextProvider>
		<Provider store={store}>
			<Toaster />
			<App />
		</Provider>
	</AdminContextProvider>
);
