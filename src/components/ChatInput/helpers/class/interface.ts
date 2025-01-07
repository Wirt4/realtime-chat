export interface IHelpers {
    HandleKeystroke(event: React.KeyboardEvent<HTMLTextAreaElement>, input: string): void;
    SendMessage(input: string): Promise<void>;
    setFocus(): void;
}