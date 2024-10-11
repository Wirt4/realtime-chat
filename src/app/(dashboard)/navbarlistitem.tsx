'use client'
import {FC} from "react";
import Link from "next/link";
import {Icon, Icons} from "@/components/Icons";

interface navbarListItemPrps {
    href: string;
    Icon: Icon;
}

const NavbarListItem: FC<navbarListItemPrps> =  (props) =>{
    const Icon = Icons[props.Icon]
    return <li>
        <Link href={props.href}><span><Icon/></span></Link>
    </li>
}

export default NavbarListItem