import {getServerSession} from "next-auth";

export async function POST() {

    const session = await getServerSession()

    if (!session?.user?.id) {
        return respond('Unauthorized', 401)
    }

    return new Response('OK')
}

function respond(message: string, status: number) {
    return new Response(message, {status});
}
