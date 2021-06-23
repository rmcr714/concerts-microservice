import { Subjects } from './subjects';
export interface TicketUpdated {
    subject: Subjects.TicketUpdated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
    };
}
