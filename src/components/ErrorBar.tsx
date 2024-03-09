const ErrorBar: React.FC<{
  children: React.ReactNode;
  innerRef: React.RefObject<HTMLParagraphElement>;
  className?: string;
}> = ({ children, innerRef, className }) => {
  return (
    <p
      ref={innerRef}
      className={`bg-red-200 px-4 py-2 rounded-md text-sm hidden text-destructive ${
        className ? className : ""
      }`}
    >
      {children}
    </p>
  );
};

export default ErrorBar;
