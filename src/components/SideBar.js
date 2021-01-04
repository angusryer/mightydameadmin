import React from 'react'
import { Link } from 'react-router-dom'

export default function SideBar() {
    return (
        <aside className="flex flex-column">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/users">Users</Link>
            <Link to="/campaigns">Campaigns</Link>
            <Link to="/programs">Programs</Link>
            <Link to="/products">Products</Link>
            <Link to="/reviews">Reviews</Link>
        </aside>
    )
}
