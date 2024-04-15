import { BsThreeDots } from "react-icons/bs";
import Button from "./Button";
import { TRowData } from "./Table";
import { useEffect, useRef, useState } from "react";

interface TableActionProps {
	onEdit: () => void;
	onDelete: () => void;
}

const TableAction: React.FC<TableActionProps> = ({ onDelete, onEdit }) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e) => {
			if (!menuRef.current?.contains(e.target)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handler);

		return () => {
			document.removeEventListener("mousedown", handler);
		};
	}, []);

	return (
		<TRowData>
			<div className="relative">
				<Button
					onClick={() => setIsMenuOpen((prev) => !prev)}
					size="icon"
					varient="ghost"
					className="w-8 h-8 p-2"
				>
					<BsThreeDots className="w-full h-full" />
				</Button>
				{isMenuOpen && (
					<div
						className="absolute left-0 top-[100%] py-2 rounded-md bg-white shadow-md border flex flex-col w-24 z-10"
						ref={menuRef}
					>
						<span
							onClick={onEdit}
							className="flex items-center gap-2 py-2 px-4 hover:bg-muted text-sm cursor-pointer"
						>
							Edit
						</span>
						<span
							onClick={onDelete}
							className="flex items-center gap-2 py-2 px-4 hover:bg-muted text-sm cursor-pointer"
						>
							Delete
						</span>
					</div>
				)}
			</div>
		</TRowData>
	);
};

export default TableAction;
