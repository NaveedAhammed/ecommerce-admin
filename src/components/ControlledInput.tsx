interface InputProps {
	type: "text" | "password" | "email" | "number";
	name: string;
	id: string;
	placeholder?: string;
	autoComplete: "off" | "on";
	required?: boolean;
	pattern?: string;
	className?: string;
	disabled?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlledInput: React.FC<InputProps> = ({
	type,
	name,
	id,
	placeholder,
	autoComplete,
	required,
	pattern,
	className,
	onBlur,
	onFocus,
	disabled,
	value,
	onChange,
}) => {
	const inputClasses =
		"flex w-full h-10 rounded-md border border-mutedForeground focus:border-blue bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground focus-visible:outline-none transition duration-300 focus:shadow-inputFocus hover:shadow-inputHover disabled:cursor-not-allowed disabled:opacity-50";
	return (
		<input
			type={type}
			name={name}
			id={id}
			placeholder={placeholder}
			className={`${inputClasses} ${className ? className : ""}`}
			autoComplete={autoComplete}
			required={required}
			pattern={pattern}
			onFocus={onFocus}
			onBlur={onBlur}
			disabled={disabled}
			value={value}
			onChange={onChange}
		/>
	);
};

export default ControlledInput;
