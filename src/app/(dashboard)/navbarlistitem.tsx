'use client'
import {FC} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";

interface navbarListItemPrps {
    href: string;
}

const NavbarListItem: FC<navbarListItemPrps> =  (props) =>{
    const Icon = Icons.Logo
    return <li>
        <Link href={props.href}><span><Icon/></span></Link>
    </li>
}

export default NavbarListItem