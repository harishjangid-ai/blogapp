
const AdminCard = ({title, total, icon}: {title: string; total: number | undefined; icon: React.ReactNode}) => {
  return (
    <div className="flex justify-between border border-gray-400/50 rounded-2xl py-2 px-3 bg-white/50 items-center">
      <div className="flex flex-col">
        <h3 className="text-xl font-thin">{title}</h3>
        <p className="text-2xl font-normal">{total}</p>
      </div>
      <p>{icon}</p>
    </div>
  )
}

export default AdminCard