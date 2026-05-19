"use client"
import React from 'react'
import AdminCard from '../ui/AdminCard'
import { FileTextOutlined, HighlightOutlined, UserOutlined } from '@ant-design/icons'
import UserCard from '../ui/UserCard'
import { Input } from 'antd'

const Users = () => {
  return (
    <main className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <UserCard
          title="Total Users"
          total={7}
        />
        <UserCard
          title="Admins"
          total={1}
        />
        <UserCard
          title="Writers"
          total={5}
        />
        <UserCard
          title="Readers"
          total={1}
        />
      </div>
      <div className="flex flex-col border border-gray-400/50 rounded-2xl py-2 px-3 bg-white/50">
        <h3 className="text-xl font-thin">All Users</h3>
        <Input placeholder="Search by name or email..." className='w-75!'/>
      </div>
    </main>
  )
}

export default Users