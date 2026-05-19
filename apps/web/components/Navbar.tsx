"use client";

import { UserOutlined } from '@ant-design/icons'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-100 flex justify-center py-2">
        <div className="w-full flex items-center justify-between px-4">
            <div className="nav-brand">
                <h2 className='text-2xl font-bold'>Inkflow</h2>
            </div>
            <div className="flex gap-5">
                <Link href="/admin">Dashboard</Link>
                <Link href="/admin/users">Users</Link>
                <Link href="/admin/blogs">Blogs</Link>
                <Link href="/admin/requests">Requests</Link>
                <Link href="/admin/reports">Reports</Link>
            </div>
            <div className="flex gap-5">
                <UserOutlined className='p-2 bg-gray-300/50 rounded-full'/>
            </div>
        </div>
    </nav>
  )
}

export default Navbar