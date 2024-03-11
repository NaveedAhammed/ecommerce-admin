interface InputProps {
	type: "text" | "password" | "email" | "number";
	name: string;
	id: string;
	placeholder?: string;
	autoComplete: "off" | "on";
	innerRef?: React.RefObject<HTMLInputElement>;
	required?: boolean;
	pattern?: string;
	className?: string;
	disabled?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	defaultValue?: string | number;
}

const Input: React.FC<InputProps> = ({
	type,
	name,
	id,
	placeholder,
	autoComplete,
	innerRef,
	required,
	pattern,
	className,
	onBlur,
	onFocus,
	disabled,
	defaultValue,
}) => {
	const inputClasses =
		"flex w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
	return (
		<input
			type={type}
			name={name}
			id={id}
			placeholder={placeholder}
			className={`${className ? className : ""} ${inputClasses}`}
			autoComplete={autoComplete}
			ref={innerRef}
			required={required}
			pattern={pattern}
			onFocus={onFocus}
			onBlur={onBlur}
			disabled={disabled}
			defaultValue={defaultValue}
		/>
	);
};

export default Input;
