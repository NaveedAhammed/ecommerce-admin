interface Option {
	id: string;
	name: string;
}

interface SelectProps {
	options: Option[];
	name: string;
	id: string;
	required?: boolean;
	className?: string;
	onFocus?: () => void;
	onBlur?: () => void;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ControlledSelect: React.FC<SelectProps> = ({
	options,
	name,
	id,
	required,
	className,
	onBlur,
	onFocus,
	value,
	onChange,
}) => {
	return (
		<select
			className={`"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${
				className ? className : ""
			}`}
			name={name}
			id={id}
			required={required}
			onFocus={onFocus}
			onBlur={onBlur}
			value={value}
			onChange={onChange}
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

export default ControlledSelect;
