export enum UserRole {
  ORG_ADMIN = "ORG_ADMIN",
  MANAGER = "OUTLET_MANAGER",
}

export interface User {
  name: string;
  role: UserRole;
  email: string;
}
export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
export interface Outlet {
  name: string;
  location: Location;
  managerUser: User;
}

export interface Org {
  name: string;
  logo: string | null;
  offerLetterPdf: string | null;
  adminUser: User;
}

export interface OnboardingRequest {
  token: string;
  outlets: Outlet[];
  org: Org;
}
