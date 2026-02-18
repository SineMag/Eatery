import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

type AuthResult = { success: boolean; error?: string };
type StaffLoginResult = { success: boolean; error?: string; user?: User };
type StaffCreationResult = {
  success: boolean;
  error?: string;
  credentials?: { email: string; staffId: string; password: string };
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  loginStaff: (email: string, password: string, staffId?: string) => Promise<StaffLoginResult>;
  createStaffAccount: (name: string, surname: string) => Promise<StaffCreationResult>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = '@eatery_users';
const STAFF_USERS_KEY = '@eatery_staff_users';
const CURRENT_USER_KEY = '@eatery_current_user';
const COMPANY_DOMAIN = 'company.com';
const COMPANY_EMAIL_SUFFIX = `@${COMPANY_DOMAIN}`;
const DEFAULT_ADMIN_EMAIL = `admin@${COMPANY_DOMAIN}`;
const DEFAULT_ADMIN_PASSWORD = 'Admin456';
const DEFAULT_TEST_USER_EMAIL = 's@m.com';
const DEFAULT_TEST_USER_PASSWORD = '123456';

type StoredUser = User & { password: string };

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const staffEmailRegex = new RegExp(`^[a-z]+(?:[._-][a-z]+)+@${COMPANY_DOMAIN.replace('.', '\\.')}$`);
const isValidStaffEmail = (email: string) =>
  email === DEFAULT_ADMIN_EMAIL || staffEmailRegex.test(email);

const toLocalPart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '');

const generateStaffId = () =>
  `ID${Math.floor(10000 + Math.random() * 90000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

const generateStaffPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 10; i += 1) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await ensureDefaultStaffData();
      await ensureDefaultUserData();
      const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInUser = async (nextUser: User) => {
    setUser(nextUser);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
  };

  const getUsers = async (): Promise<StoredUser[]> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = async (users: StoredUser[]) => {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const getStaffUsers = async (): Promise<StoredUser[]> => {
    try {
      const usersData = await AsyncStorage.getItem(STAFF_USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch {
      return [];
    }
  };

  const saveStaffUsers = async (users: StoredUser[]) => {
    await AsyncStorage.setItem(STAFF_USERS_KEY, JSON.stringify(users));
  };

  const ensureDefaultStaffData = async () => {
    const staffUsers = await getStaffUsers();

    if (!staffUsers.some((u) => normalizeEmail(u.email) === DEFAULT_ADMIN_EMAIL)) {
      const adminUser: StoredUser = {
        id: `staff-admin-${Date.now()}`,
        name: 'Admin',
        surname: 'User',
        email: DEFAULT_ADMIN_EMAIL,
        contactNumber: '',
        address: '',
        isAdmin: true,
        isStaff: true,
        staffId: 'IDADMIN1',
        password: DEFAULT_ADMIN_PASSWORD,
      };

      await saveStaffUsers([adminUser, ...staffUsers]);
    }
  };

  const ensureDefaultUserData = async () => {
    const users = await getUsers();
    if (users.some((u) => normalizeEmail(u.email) === DEFAULT_TEST_USER_EMAIL)) {
      return;
    }

    const demoUser: StoredUser = {
      id: `demo-user-${Date.now()}`,
      name: 'Demo',
      surname: 'User',
      email: DEFAULT_TEST_USER_EMAIL,
      contactNumber: '0000000000',
      address: 'Demo Address',
      cardNumber: '',
      cardExpiry: '',
      cardCVV: '',
      isAdmin: false,
      isStaff: false,
      password: DEFAULT_TEST_USER_PASSWORD,
    };

    await saveUsers([demoUser, ...users]);
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const users = await getUsers();
      const foundUser = users.find(
        (u) => normalizeEmail(u.email) === normalizeEmail(email) && u.password === password
      );
      
      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      await signInUser(userWithoutPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const loginStaff = async (email: string, password: string, staffId?: string): Promise<StaffLoginResult> => {
    try {
      const normalizedEmail = normalizeEmail(email);
      if (!isValidStaffEmail(normalizedEmail)) {
        return { success: false, error: `Use staff email format: name.surname@${COMPANY_DOMAIN}` };
      }

      const staffUsers = await getStaffUsers();
      const foundUser = staffUsers.find((u) => normalizeEmail(u.email) === normalizedEmail);

      if (!foundUser) {
        return { success: false, error: 'Staff account not found' };
      }

      if (foundUser.password !== password) {
        return { success: false, error: 'Invalid password' };
      }

      if (!foundUser.isAdmin && foundUser.staffId !== staffId?.trim().toUpperCase()) {
        return { success: false, error: 'Invalid staff ID' };
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      await signInUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    } catch {
      return { success: false, error: 'Unable to sign in staff account' };
    }
  };

  const createStaffAccount = async (name: string, surname: string): Promise<StaffCreationResult> => {
    try {
      const cleanName = toLocalPart(name);
      const cleanSurname = toLocalPart(surname);

      if (!cleanName || !cleanSurname) {
        return { success: false, error: 'Name and surname are required for staff account creation' };
      }

      const email = `${cleanName}.${cleanSurname}@${COMPANY_DOMAIN}`;
      const staffUsers = await getStaffUsers();
      if (staffUsers.some((u) => normalizeEmail(u.email) === email)) {
        return { success: false, error: 'Staff account already exists' };
      }

      const staffId = generateStaffId();
      const generatedPassword = generateStaffPassword();
      const newStaff: StoredUser = {
        id: `staff-${Date.now()}`,
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        surname: cleanSurname.charAt(0).toUpperCase() + cleanSurname.slice(1),
        email,
        contactNumber: '',
        address: '',
        isAdmin: false,
        isStaff: true,
        staffId,
        password: generatedPassword,
      };

      staffUsers.push(newStaff);
      await saveStaffUsers(staffUsers);

      return {
        success: true,
        credentials: { email, staffId, password: generatedPassword },
      };
    } catch {
      return { success: false, error: 'Unable to create staff account' };
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<AuthResult> => {
    try {
      const normalizedEmail = normalizeEmail(userData.email);
      if (normalizedEmail.endsWith(COMPANY_EMAIL_SUFFIX)) {
        return {
          success: false,
          error: 'Staff accounts cannot register here. Use Staff Entry with admin-issued credentials.',
        };
      }

      const users = await getUsers();
      
      if (users.some((u) => normalizeEmail(u.email) === normalizedEmail)) {
        return { success: false, error: 'Email already registered' };
      }

      const newUser: StoredUser = {
        ...userData,
        id: Date.now().toString(),
        isAdmin: false,
        isStaff: false,
      };

      users.push(newUser);
      await saveUsers(users);

      const { password: _, ...userWithoutPassword } = newUser;
      await signInUser(userWithoutPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during registration' };
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error removing CURRENT_USER_KEY from storage:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<AuthResult> => {
    try {
      if (!user) return { success: false, error: 'Not logged in' };

      if (user.isStaff) {
        const staffUsers = await getStaffUsers();
        const staffIndex = staffUsers.findIndex((u) => u.id === user.id);

        if (staffIndex === -1) return { success: false, error: 'Staff user not found' };

        staffUsers[staffIndex] = { ...staffUsers[staffIndex], ...userData };
        await saveStaffUsers(staffUsers);

        const { password: _, ...userWithoutPassword } = staffUsers[staffIndex];
        await signInUser(userWithoutPassword);
        return { success: true };
      }

      const users = await getUsers();
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex === -1) return { success: false, error: 'User not found' };

      users[userIndex] = { ...users[userIndex], ...userData };
      await saveUsers(users);

      const { password: _, ...userWithoutPassword } = users[userIndex];
      await signInUser(userWithoutPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred updating profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, loginStaff, createStaffAccount, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
