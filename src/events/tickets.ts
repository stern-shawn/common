import { Subjects } from './subjects';

interface TicketData {
  id: string;
  title: string;
  price: string;
  userId: string;
}

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: TicketData;
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: TicketData;
}
