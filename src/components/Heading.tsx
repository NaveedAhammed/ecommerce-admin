import Button from "./Button";

import { GoPlus } from "react-icons/go";

interface HeadingProps {
	title: string;
	description: string;
	action: () => void;
	actionLabel: string;
	actionLabelNotRequired?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
	title,
	description,
	action,
	actionLabel,
	actionLabelNotRequired,
}) => {
	return (
		<div className="flex items-center justify-between w-full py-4 border-b mb-8">
			<div className="flex flex-col">
				<h1 className="text-3xl font-bold tracking-tight mb-1">
					{title}
				</h1>
				<p className="text-sm text-mutedForeground">{description}</p>
			</div>
			{!actionLabelNotRequired && (
				<Button
					size="default"
					onClick={action}
					varient="default"
					className="gap-2"
				>
					<GoPlus className="font-bold text-lg" />
					{actionLabel}
				</Button>
			)}
		</div>
	);
};

export default Heading;
