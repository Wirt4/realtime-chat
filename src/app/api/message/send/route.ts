import { MessageSendController } from "@/controllers/message/send/controller";
import { MessageService } from "@/services/message/service";
import { MessageValidator } from "@/services/message/validator/implementation";

export async function POST(request: Request) {
    const controller = new MessageSendController()
    const validator = new MessageValidator()
    const service = new MessageService(validator)
    return controller.send(request, service)
}
