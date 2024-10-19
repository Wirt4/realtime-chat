'use client';

import {FC} from "react";
import Link from "next/link";
import {UserPlus} from "lucide-react";

const AddFriendListItem: FC =  () =>{
    return <li><Link href='/dashboard/add' className='link group'>
            <span className='link-icon group-hover:border-black group-hover:black'>
                <UserPlus className='icon' aria-label='add-user-icon'/>
            </span>
        <span className='truncate'>Add a Friend</span>
        </Link></li>
}

export default AddFriendListItem;
