import { cn } from "../../lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input p-4 bg-[var(--surface-1)] border border-[var(--border-soft)] flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:-translate-y-2 transition duration-200 mt-auto">
        {icon}
        <div className="font-sans font-bold text-[var(--text-primary)] mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-[var(--text-secondary)] text-sm">
          {description}
        </div>
      </div>
    </div>
  );
};
