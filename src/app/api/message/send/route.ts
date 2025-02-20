import { MessageSendController } from "@/controllers/message/send/controller";
import { MessageService } from "@/services/message/service";

export async function POST(request: Request) {
    const controller = new MessageSendController()
    const service = new MessageService()
    console.log('sending request in api...')
    console.log('request', request)
    return controller.send(request, service)
}
