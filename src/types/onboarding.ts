export enum UserRole {
  ORG_ADMIN = "ORGANISATION ADMIN",
  MANAGER = "MANAGER",
}

export interface User {
  name: string;
  role: UserRole;
  email: string;
}

export interface Outlet {
  name: string;
  location: string;
  address: string;
}

export interface Org {
  name: string;
  logo: File | null;
  offerLetterPdf: File | null;
}

export interface OnboardingRequest {
  users: User[];
  outlets: Outlet[];
  org: Org;
}
