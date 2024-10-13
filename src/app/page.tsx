import {FC} from "react";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

interface pageProps {}

const page: FC<pageProps> = ({}) =>{
  return <Link href='/login'><Button>Go To Login</Button></Link>
}

export default page
