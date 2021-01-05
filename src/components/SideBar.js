import React from 'react'
import { Link } from 'react-router-dom'

export default function SideBar() {
    return (
        <aside className="flex flex-col min-w-min pl-5 pr-5 bg-gray-200">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/users">Users</Link>
            <Link to="/campaigns">Campaigns</Link>
            <Link to="/programs">Programs</Link>
            <Link to="/products">Products</Link>
            <Link to="/reviews">Reviews</Link>
        </aside>
    )
}
