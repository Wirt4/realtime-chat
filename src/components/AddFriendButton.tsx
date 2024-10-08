"use client"

import {FC} from "react";
import Button from "@/components/ui/button/Button";

const AddFriendButton: FC = ()=>{
    return <form>
        <div>
        <label>Add a Friend by Email:</label>
            <input type="text"/>
            <Button>Add</Button>
        </div>
    </form>
}
export default AddFriendButton
