import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./AdminLayout";
import ProtectedLayout from "./ProtectedLayout";
import PersistLogin from "./components/PersistLogin";
import { lazy } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Billboards = lazy(() => import("./pages/Billboards"));
const Categories = lazy(() => import("./pages/Categories"));
const Colors = lazy(() => import("./pages/Colors"));
const Orders = lazy(() => import("./pages/Orders"));
const Products = lazy(() => import("./pages/Products"));
const Settings = lazy(() => import("./pages/Settings"));
const Sizes = lazy(() => import("./pages/Sizes"));

const router = createBrowserRouter([
	{
		element: <PersistLogin />,
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						element: <ProtectedLayout />,
						children: [
							{
								path: "/",
								element: <Dashboard />,
							},
							{
								path: "billboards",
								element: <Billboards />,
							},
							{
								path: "categories",
								element: <Categories />,
							},
							{
								path: "colors",
								element: <Colors />,
							},
							{
								path: "sizes",
								element: <Sizes />,
							},
							{
								path: "products",
								element: <Products />,
							},
							{
								path: "orders",
								element: <Orders />,
							},
							{
								path: "settings",
								element: <Settings />,
							},
						],
					},
				],
			},
			{
				path: "login",
				element: <Login />,
			},
		],
	},
]);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
