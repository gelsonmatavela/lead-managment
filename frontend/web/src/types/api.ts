// Auto-generated types from Prisma Schema

export enum AuthPermissionAction {
  View = "View",
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
  // Add more custom actions = "// Add more custom actions",
}

export interface Address {
  id: string;
  country: string;
  state: string;
  city: string;
  neighborhood?: string;
  street?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  companies: Company[];
  users: User[];
}

export interface AuthPermission {
  id: string;
  resource: string;
  action: AuthPermissionAction;
  roleId: string;
  role: AuthRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRole {
  id: string;
  name: string;
  description?: string;
  permissions: AuthPermission[];
  users: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  logo: string;
  leaders: Staff[];
  staffs: Staff[];
  addressId: string;
  address: Address;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
}

export interface Staff {
  id: string;
  userId: string;
  companyCode: string;
  companyId: string;
  company: Company;
  user: User;
  companyAsLeader: Company[];
}

export interface UserRole {
  id: string;
  userId: string;
  user: User;
  roleId: string;
  role: AuthRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  password: string;
  addressId: string;
  address: Address;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
  isSuperUser: boolean;
  isStaff: boolean;
  deletedSelfAccountAt?: Date;
  isActive: boolean;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
  staff?: Staff;
}

