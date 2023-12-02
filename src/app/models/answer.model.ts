export interface Answer {
    sender_id: string,
    text: string,
    date: string,
    time: string
    timestamp: Date;
    edit: boolean;
    reactions: [];
}