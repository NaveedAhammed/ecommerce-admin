import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import { GoPerson } from "react-icons/go";
import useAdminContext from "../hooks/useAdminContext";
import { AdminContextType } from "../context/AdminContext";

const activeLink = ({ isActive }: { isActive: boolean }) => {
  return `text-sm font-medium transition-colors hover:text-primary ${
    isActive ? "text-black" : "text-mutedForeground"
  }`;
};

const Header = () => {
  const { adminState } = useAdminContext() as AdminContextType;
  const navigate = useNavigate();
  return (
    <header className="w-full border-b py-2 sticky top-0 left-0 z-[99] bg-background">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Ecommerce Admin
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={activeLink}>
            Dashboard
          </NavLink>
          <NavLink to="/billboards" className={activeLink}>
            Billboards
          </NavLink>
          <NavLink to="/categories" className={activeLink}>
            Categories
          </NavLink>
          <NavLink to="/sizes" className={activeLink}>
            Sizes
          </NavLink>
          <NavLink to="/colors" className={activeLink}>
            Colors
          </NavLink>
          <NavLink to="/products" className={activeLink}>
            Products
          </NavLink>
          <NavLink to="/orders" className={activeLink}>
            Orders
          </NavLink>
          <NavLink to="/settings" className={activeLink}>
            Settings
          </NavLink>
        </nav>
        <div className="flex items-center gap-4">
          {!adminState && (
            <Button onClick={() => navigate("/login")} size="sm" varient="link">
              Login
            </Button>
          )}
          {adminState && (
            <Button varient="outline" size="icon" className="rounded-[999px]">
              {adminState?.avatar && (
                <img
                  src={adminState.avatar}
                  alt={adminState.username}
                  className="w-full h-full rounded-[999px]"
                />
              )}
              {!adminState?.avatar && <GoPerson className="rounded-[999px]" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
