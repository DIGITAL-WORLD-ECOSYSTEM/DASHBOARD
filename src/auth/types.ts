export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  did?: string;
  role: string;
  username?: string;
  photoURL?: string;
  phoneNumber?: string;
  country?: string;
  address?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  about?: string;
  isPublic?: boolean;
}

export interface UserProfileViewModel {
  displayName: string;
  displayEmail: string;
  walletAddress?: string;
  isWeb3Account: boolean;
  photoURL?: string;
}

export type UserType = AuthUser | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
  updateSimulatedRole?: (role: string | null) => void;
};
