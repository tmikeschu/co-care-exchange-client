export interface RegistrationModel {
  firstName?: string;
  lastName?: string;
  orgName?: string;
  isOrganization: boolean;
  email: string;
  phone?: string;
  houseHoldSize?: number;
  cityState: string;
  address: string;
  deliveryOrPickupRadius: number;
  password?: string;
}
