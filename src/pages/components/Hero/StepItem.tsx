interface StepItemProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

const StepItem = ({
  number,
  title,
  description,
  isLast = false,
}: StepItemProps) => {
  return (
    <div className="flex items-start relative">
      <div className="flex flex-col items-center mr-4">
        <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-heading font-bold text-lg">
          {number}
        </div>
        {!isLast && <div className="w-px h-16 bg-border mt-4"></div>}
      </div>
      <div className="flex-1 pb-8">
        <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default StepItem;
