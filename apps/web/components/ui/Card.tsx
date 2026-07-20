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
    <div className="w-full rounded-2xl border border-gray-300/60 dark:border-gray-700 bg-white dark:bg-gray-900 py-3 px-4 flex gap-2 justify-center flex-col">
      <h3 className="font-thin text-gray-700 dark:text-gray-300">
        {title}
      </h3>

      <p className={`${css} text-2xl font-semibold`}>
        {total}
      </p>
    </div>
  );
};

export default Card;