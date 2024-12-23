import {MessageService} from "@/services/message/service";
import {MessageRemoveAllController} from "@/controllers/message/remove/all/controller";

export async function POST(request: Request) {
    const service = new MessageService()
    const controller = new MessageRemoveAllController()
    return controller.removeAll(request, service)
}
