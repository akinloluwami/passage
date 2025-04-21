const TitleBar = ({ title }: { title: string }) => {
  return (
    <div
      className="h-7 w-full bg-accent/10 flex items-center justify-between fixed top-0 left-0 right-0 z-10"
      data-tauri-drag-region
    >
      <div className=""></div>
      <p className="text-sm font-medium">{title}</p>
      <div className=""></div>
    </div>
  );
};

export default TitleBar;
