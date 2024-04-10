interface ButtonProps {
	varient:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	children: React.ReactNode;
	size: "default" | "sm" | "lg" | "icon";
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	type?: "submit" | "button";
}

const Button: React.FC<ButtonProps> = ({
	varient,
	children,
	size,
	onClick,
	className,
	disabled,
	type = "button",
}) => {
	const buttonClasses =
		"inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none transition duration-300 focus:shadow-inputFocus hover:shadow-inputHover disabled:pointer-events-none disabled:opacity-50";
	let varientClasses;
	let sizeClasses;
	switch (varient) {
		case "default":
			varientClasses =
				"bg-primary text-primaryForeground hover:bg-primary/90";
			break;
		case "destructive":
			varientClasses =
				"bg-destructive text-destructiveForeground hover:bg-destructive/90";
			break;
		case "outline":
			varientClasses =
				"border border-input bg-background hover:bg-accent hover:text-accentForeground";
			break;
		case "secondary":
			varientClasses =
				"bg-secondary text-secondaryForeground hover:bg-secondary/80";
			break;
		case "ghost":
			varientClasses = "hover:bg-accent hover:text-accentForeground";
			break;
		case "link":
			varientClasses = "text-primary underline-offset-4 hover:underline";
			break;
		default:
			break;
	}
	switch (size) {
		case "default":
			sizeClasses = "h-10 rounded-md px-4 py-2";
			break;
		case "sm":
			sizeClasses = "h-9 rounded-md px-3";
			break;
		case "lg":
			sizeClasses = "h-11 rounded-md px-8";
			break;
		case "icon":
			sizeClasses = "h-10 w-10 rounded-full";
			break;
		default:
			break;
	}
	return (
		<button
			className={`${buttonClasses} ${varientClasses} ${sizeClasses} ${
				className ? className : ""
			}`}
			onClick={onClick}
			disabled={disabled}
			type={type}
		>
			{children}
		</button>
	);
};

export default Button;
