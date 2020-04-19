import React from 'react'
import { Link } from '@reach/router'

interface MenuLinkProps {
  label: string
  shortcut?: string
  to?: string
  onClick?(): void
}

const MenuLink = ({ onClick, label, to, shortcut }: MenuLinkProps) =>
  to ? (
    <Link
      to={to}
      tabIndex={-1}
      className="w-full px-2 h-8 rounded flex items-center justify-between font-medium hover:bg-blue-500"
      onClick={onClick}
    >
      <span className="text-white">{label}</span>
      <span className="">{shortcut}</span>
    </Link>
  ) : (
    <button
      tabIndex={-1}
      className="w-full px-2 h-8 rounded flex items-center justify-between font-medium hover:bg-blue-500"
      onClick={onClick}
    >
      <span className="text-white">{label}</span>
      <span className="">{shortcut}</span>
    </button>
  )

export default MenuLink