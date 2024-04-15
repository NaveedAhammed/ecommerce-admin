import { Suspense, lazy, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ManageColorModal from "./modals/ManageColorModal";
import ManageSizeModal from "./modals/ManageUnitModal";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { setUnits } from "./redux/slices/unitSlice";
import { setChildCategories } from "./redux/slices/childCategorySlice";
import { setColors } from "./redux/slices/colorSlice";
import { useAppDispatch } from "./redux/store";
import ManageBillboardModal from "./modals/ManageBillboardModal";
import { setBillboards } from "./redux/slices/billboardSlice";
import { setParentCategories } from "./redux/slices/parentCategorySlice";
import ManageChildCategoryModal from "./modals/ManageChildCategoryModal";
import ManageParentCategoryModal from "./modals/ManageParentCategoryModal";
import ManageOrderModal from "./modals/ManageOrderModal";

const ManageProductModal = lazy(() => import("./modals/ManageProductModal"));

const AdminLayout = () => {
	const axiosPrivate = useAxiosPrivate();

	const dispatch = useAppDispatch();

	useEffect(() => {
		let isMounted: boolean = true;
		const getData = async () => {
			try {
				const res = await Promise.all([
					axiosPrivate.get("/categories/child"),
					axiosPrivate.get("/categories/parent"),
					axiosPrivate.get("/colors"),
					axiosPrivate.get("/units"),
					axiosPrivate.get("/billboards"),
				]);
				dispatch(setChildCategories(res[0].data.data.childCategories));
				dispatch(
					setParentCategories(res[1].data.data.parentCategories)
				);
				dispatch(setColors(res[2].data.data.colors));
				dispatch(setUnits(res[3].data.data.units));
				dispatch(setBillboards(res[4].data.data.billboards));
				isMounted && console.log(res);
			} catch (err) {
				console.log(err);
			}
		};

		getData();

		return () => {
			isMounted = false;
		};
	}, [axiosPrivate, dispatch]);

	return (
		<div className="w-full h-full min-h-[100vh] flex flex-col">
			<Header />
			<main className="w-full max-w-[1400px] mx-auto h-full flex-1 relative py-2">
				<Suspense
					fallback={
						<Loader
							width="3rem"
							height="3rem"
							color="black"
							className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
						/>
					}
				>
					<ManageProductModal />
					<ManageParentCategoryModal />
					<ManageColorModal />
					<ManageSizeModal />
					<ManageBillboardModal />
					<ManageChildCategoryModal />
					<ManageOrderModal />
					<Outlet />
				</Suspense>
			</main>
			<Footer />
		</div>
	);
};

export default AdminLayout;
