import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  name: z.string().optional(),
  bio: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const updateUserSchema = z.object({
  name: z.string().max(100, 'Name must be less than 100 characters').optional().nullable(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable(),
  avatar: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  location: z.string().max(100, 'Location must be less than 100 characters').optional().nullable(),
  website: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  github: z.string().max(100, 'GitHub username must be less than 100 characters').optional().nullable(),
  twitter: z.string().max(100, 'Twitter username must be less than 100 characters').optional().nullable(),
  linkedin: z.string().max(100, 'LinkedIn username must be less than 100 characters').optional().nullable(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
}).transform((data) => {
  // Convert empty strings to null
  const transformed: any = {};
  Object.keys(data).forEach((key) => {
    const value = data[key as keyof typeof data];
    if (value === '') {
      transformed[key] = null;
    } else if (value !== undefined) {
      transformed[key] = value;
    }
  });
  return transformed;
});

export const createInvitationSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
});

export const createHackathonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  logo: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const createHackathonHistorySchema = z.object({
  hackathonId: z.string().min(1, 'Hackathon ID is required'),
  role: z.string().max(100, 'Role must be less than 100 characters').optional(),
  result: z.string().max(100, 'Result must be less than 100 characters').optional(),
  projectUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});
