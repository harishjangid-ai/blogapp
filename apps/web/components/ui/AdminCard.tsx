const AdminCard = ({ title, total, icon }: { title: string; total: number | undefined; icon: React.ReactNode; }) => {
  return (
    <div className="flex justify-between border border-gray-300/60 dark:border-gray-700 rounded-2xl py-2 px-3 bg-white/50 dark:bg-gray-900 items-center">
      <div className="flex flex-col">
        <h3 className="text-xl font-thin text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-2xl font-normal text-gray-900 dark:text-white">
          {total}
        </p>
      </div>

      <p className="text-gray-700 dark:text-gray-300">{icon}</p>
    </div>
  );
};

export default AdminCard;