const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <table className="w-full border">{children}</table>;
};

export const THead: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <thead className="text-mutedForeground font-medium">{children}</thead>;
};

export const TBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <tbody>{children}</tbody>;
};

export const TRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <tr className="border-b hover:bg-slate-50 transition-colors">{children}</tr>
  );
};

export const TRowData: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <td className="py-3 text-start px-4">{children}</td>;
};

export const THeadData: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <th className="py-3 text-start px-4 border-b">{children}</th>;
};

export default Table;
