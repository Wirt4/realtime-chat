import {StateSetters} from "@/components/ChatInput/helpers/class/helpers";
import {IHelpers} from "@/components/ChatInput/helpers/class/interface";

export interface IHelpersFactory {
    createHelpers(setterParams: StateSetters, chatId: string): IHelpers;
}