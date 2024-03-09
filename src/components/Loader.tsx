interface LoaderProps {
  width: string;
  height: string;
  color: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ width, height, color, className }) => {
  return (
    <div
      className={`loader loader-${color} ${className ? className : ""}`}
      style={{ width, height }}
    ></div>
  );
};

export default Loader;
