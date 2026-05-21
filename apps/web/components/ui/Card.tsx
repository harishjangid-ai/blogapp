
const Card = ({
  title,
  total,
  css,
}: {
  title: string;
  total: number | undefined;
  css: string;
}) => {
  return (
    <div className="w-full rounded-2xl border border-gray-400/50 py-3 px-4 flex gap-2 justify-center flex-col">
      <h3 className="font-thin">{title}</h3>
      <p className={`${css} text-2xl font-semibold`}>{total}</p>
    </div>
  );
};

export default Card;