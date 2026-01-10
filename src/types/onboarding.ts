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
    lon: number;
  };
}
export interface Outlet {
  name: string;
  location: Location;
  managerUser: User;
}

export interface Org {
  name: string;
  adminUser: User;
}

export interface SignedUrlInfo {
  signedUrl: string;
  path: string;
  token: string;
}

export interface OnboardingResponse {
  logo: SignedUrlInfo;
  offer_letter: SignedUrlInfo;
}

export interface OnboardingRequest {
  token: string;
  outlets: Outlet[];
  org: Org;
}
