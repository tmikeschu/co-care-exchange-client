export interface SaveUserInput {
  address: string;
  city: string;
  currentUserEmail: string;
  emailAddress: string;
  firstName: string;
  householdSize?: number;
  lastName: string;
  matchRadius: number;
  organizationId?: unknown;
  phoneNumber: string;
  postalCode?: string;
  sendEmailMatchNotifications: boolean;
  sendEmailMessageNotifications: boolean;
  state: string;
  userId?: string;
  // TODO deprecate
  pickupRadius: number;
  dropOffRadius: number;
}
