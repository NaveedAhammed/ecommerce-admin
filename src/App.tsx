import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./AdminLayout";
import ProtectedLayout from "./ProtectedLayout";
import PersistLogin from "./components/PersistLogin";
import { lazy } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Billboards = lazy(() => import("./pages/Billboards"));
const ParentCategories = lazy(() => import("./pages/ParentCategories"));
const Categories = lazy(() => import("./pages/ChildCategories"));
const Colors = lazy(() => import("./pages/Colors"));
const Orders = lazy(() => import("./pages/Orders"));
const Products = lazy(() => import("./pages/Products"));
const Settings = lazy(() => import("./pages/Settings"));
const Units = lazy(() => import("./pages/Units"));

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
								path: "parentCategories",
								element: <ParentCategories />,
							},
							{
								path: "childCategories",
								element: <Categories />,
							},
							{
								path: "colors",
								element: <Colors />,
							},
							{
								path: "units",
								element: <Units />,
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
