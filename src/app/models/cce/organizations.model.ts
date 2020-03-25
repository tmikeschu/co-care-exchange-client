export interface Organization {
  name: string;
  id: string;
  contact: OrgContactInfo;
}

export interface OrgContactInfo {
  poc: string; // email, name
  phone?: string;
  url?: string;
}
