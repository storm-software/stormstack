import { ContactDetail } from "../apis/contactApi";

export interface ContactState {
  formValues: Partial<ContactDetail>;
  createdDateTime: string | null;
}
