interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
  error?: boolean;
}

const Label: React.FC<LabelProps> = ({ children, htmlFor, error }) => {
  const labelClasses = "font-medium text-sm";
  return (
    <label
      htmlFor={htmlFor}
      className={`${labelClasses} ${
        error ? "text-destructive" : "text-foreground"
      }`}
    >
      {children}
    </label>
  );
};

export default Label;
