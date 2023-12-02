export interface Message {
  sender_id: string;
  text: string;
  date: string;
  time: string;
  name: any;
  avatar: any;
  displayDate?: string;
  edit: boolean;
  reactions: any;
  thread: any;
}
