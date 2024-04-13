import {
	FaFacebookF,
	FaInstagram,
	FaLinkedin,
	FaTwitter,
} from "react-icons/fa6";
import Button from "./Button";

const Footer = () => {
	return (
		<footer className="w-full bg-gray-50 py-10">
			<div className="flex flex-col items-center">
				<ul className="flex items-center gap-10 py-4">
					<li className="text-sm cursor-pointer hover:text-black text-mutedForeground">
						Terms Of Use
					</li>
					<li className="text-sm cursor-pointer hover:text-black text-mutedForeground">
						Privacy-Policy
					</li>
					<li className="text-sm cursor-pointer hover:text-black text-mutedForeground">
						About
					</li>
					<li className="text-sm cursor-pointer hover:text-black text-mutedForeground">
						Blog
					</li>
					<li className="text-sm cursor-pointer hover:text-black text-mutedForeground">
						FAQ
					</li>
				</ul>
				<div className="w-[50%] text-center mb-6 text-sm text-slate-400">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
					do eiusmod tempor incididunt ut labore et dolore magna
					aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
					Duis aute irure dolor in reprehenderit in voluptate velit
					esse cillum dolore eu fugiat nulla pariatur.
				</div>
				<div className="flex items-center gap-4">
					<Button
						varient="ghost"
						size="icon"
						className="hover:bg-facebook hover:text-white"
					>
						<FaFacebookF />
					</Button>
					<Button
						varient="ghost"
						size="icon"
						className="hover:bg-instagram hover:text-white"
					>
						<FaInstagram />
					</Button>
					<Button
						varient="ghost"
						size="icon"
						className="hover:bg-twitter hover:text-white"
					>
						<FaTwitter />
					</Button>
					<Button
						varient="ghost"
						size="icon"
						className="hover:bg-linkedin hover:text-white"
					>
						<FaLinkedin />
					</Button>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
