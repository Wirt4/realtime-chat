import myGetServerSession from "@/lib/myGetServerSession";

export async function POST(req:string) {
    const session = await myGetServerSession()
    if (!session){
        return new Response('Unauthorized', { status: 401 })
    }
    return new Response('OK')
}
