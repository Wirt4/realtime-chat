import myGetServerSession from "@/lib/myGetServerSession";

export async function POST(req:Request) {
    if ( await myGetServerSession()){
        return new Response('Invalid Request payload', { status: 421 })
    }
    return new Response('Unauthorized', { status: 401 })
}
