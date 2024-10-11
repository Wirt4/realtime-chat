'use client'
import {FC} from "react";
import Link from "next/link";

interface navbarListItemPrps {
    href: string;
}

const NavbarListItem: FC<navbarListItemPrps> =  (props) =>{
    return <li>
        <Link href={props.href}>stub</Link>
    </li>
}

export default NavbarListItem