import {MessageSendController} from "@/controllers/message/send/controller";
import {MessageService} from "@/services/message/service";

export async function POST(request: Request) {
    const controller = new MessageSendController()
    const service = new MessageService()
    return controller.send(request, service)
}
