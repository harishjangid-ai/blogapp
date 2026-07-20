const UserCard = ({
  title,
  total,
}: {
  title: string;
  total: number | undefined;
}) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-400/50 dark:border-gray-700 bg-white/50 dark:bg-gray-900 py-2 px-3">
      <div className="flex flex-col">
        <h3 className="text-xl font-thin text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-2xl font-normal text-gray-900 dark:text-gray-100">
          {total}
        </p>
      </div>
    </div>
  );
};

export default UserCard;