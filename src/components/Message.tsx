interface MessageProps {
  children: React.ReactNode;
  error: boolean;
  className?: string;
}

const Message: React.FC<MessageProps> = ({ children, error, className }) => {
  const messageClasses = "font-medium text-sm";
  return (
    <p
      className={`${messageClasses} ${
        error ? "text-destructive" : "text-foreground"
      } ${className ? className : ""}`}
    >
      {children}
    </p>
  );
};

export default Message;
