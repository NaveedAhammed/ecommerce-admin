import { Suspense, lazy, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ManageCategoryModal from "./modals/ManageCategoryModal";
import ManageColorModal from "./modals/ManageColorModal";
import ManageSizeModal from "./modals/ManageSizeModal";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

const ManageProductModal = lazy(() => import("./modals/ManageProductModal"));

const AdminLayout = () => {
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await Promise.all([
          axiosPrivate.get("/categories"),
          axiosPrivate.get("/colors"),
          axiosPrivate.get("/sizes"),
        ]);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [axiosPrivate]);

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
          <ManageCategoryModal />
          <ManageColorModal />
          <ManageSizeModal />
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;