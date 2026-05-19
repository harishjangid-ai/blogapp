import React from 'react'

const AdminCard2 = ({title, icon}: {title: string; icon: React.ReactNode}) => {
  return (
    <div className="md:w-1/2 w-full rounded-2xl border border-gray-400/50 p-4 flex gap-2 items-center">
      <p>{icon}</p>
      <h3 className="text-xl font-thin">{title}</h3>
    </div>
  )
}

export default AdminCard2