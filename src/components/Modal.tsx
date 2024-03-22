import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	body: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, body, description }) => {
	const [showModal, setShowModal] = useState<boolean>(isOpen);

	useEffect(
		function () {
			setShowModal(isOpen);
		},
		[isOpen]
	);

	if (!isOpen) return null;

	return createPortal(
		<div className="w-[100vw] h-[100vh] fixed top-0 left-0 z-[99]">
			<div className="w-[100%] h-[100%] bg-black/70 relative"></div>
			<div
				className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-all bg-background p-6 rounded-md ${
					showModal ? "" : ""
				}`}
			>
				<div className="flex flex-col w-full">
					<div className="mb-6">
						<h2 className="text-2xl font-bold tracking-tight mb-1">
							{title}
						</h2>
						<p className="text-sm text-mutedForeground">
							{description}
						</p>
					</div>
					<div className="mb-4">{body}</div>
				</div>
			</div>
		</div>,
		document.getElementById("modal")!
	);
};

export default Modal;
