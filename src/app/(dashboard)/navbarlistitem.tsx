'use client'
import {FC} from "react";
import Link from "next/link";

interface navbarListItemPrps {}

const NavbarListItem: FC<navbarListItemPrps> =  ({}) =>{
    return <li>
        <Link href='/contact'>stub</Link>
    </li>
}

export default NavbarListItem