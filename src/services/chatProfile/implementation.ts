import { aChatProfileService } from "./abstract";

export class ChatProfileServce implements aChatProfileService {
    createChatId(): string {
        const array = new Uint8Array(74);
        crypto.getRandomValues(array);
        console.log(array);
        console.log(array.length);
        return this.arrToString(array);
    }

    private arrToString(arr: Uint8Array): string {
        const allowed = "-abcdefghijklmnopqrstuvwxyz0123456789";
        let s = ""
        for (let i = 0; i < arr.length; i++) {
            if (i === 36 || i === 37) {
                s += "-";
            } else {
                s += allowed[arr[i] % allowed.length];
            }
        }
        return s;
    }
}
