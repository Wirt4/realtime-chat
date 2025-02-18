export interface Database {
    zrange: (key: string, start: number, stop: number) => Promise<string[]>;
}
