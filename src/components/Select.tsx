interface Option {
	id: string;
	name: string;
}

interface SelectProps {
	options: Option[];
	name: string;
	id: string;
	defaultValue?: string;
	required?: boolean;
	className?: string;
	onFocus?: () => void;
	onBlur?: () => void;
}

const Select: React.FC<SelectProps> = ({
	options,
	name,
	id,
	defaultValue,
	required,
	className,
	onBlur,
	onFocus,
}) => {
	return (
		<select
			className={`"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition duration-300 focus:shadow-inputFocus hover:shadow-inputHover placeholder:text-muted-foreground focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${
				className ? className : ""
			}`}
			name={name}
			id={id}
			defaultValue={defaultValue}
			required={required}
			onFocus={onFocus}
			onBlur={onBlur}
		>
			<option value="" className="text-base">
				select
			</option>
			{options.map((option) => (
				<option
					className="text-base"
					value={`${option.id}`}
					key={option.id}
				>
					{option.name}
				</option>
			))}
		</select>
	);
};

export default Select;
