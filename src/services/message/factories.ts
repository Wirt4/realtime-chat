import { MessageRepositoryFacade } from "./repositoryFacade";

export function messageRepositoryFactory(): MessageRepositoryFacade {
    throw new Error('Not implemented');
}

export function messagePusherFactory(message: Message): MessageRepositoryFacade {
    throw new Error('Not implemented');
}
