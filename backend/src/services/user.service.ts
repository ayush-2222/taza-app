import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import crypto from "crypto";

type SaveLocationInput = {
  userId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  state: string;
  location?: string;
  isGuest?: boolean;
};

type SignupInput = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  location?: string;
  city?: string;
  state?: string;
};

type LoginInput = {
  identifier: string;
  password: string;
};

type UpdateProfileInput = {
  id: string;
  name?: string;
  location?: string;
  city?: string;
  state?: string;
  preferredCategory?: string;
};

type UpdatePasswordInput = {
  id: string;
  currentPassword: string;
  nextPassword: string;
};

function resolveLocation(city?: string, state?: string, location?: string) {
  if (location) {
    return location;
  }

  return [city, state].filter(Boolean).join(", ") || null;
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) {
    return false;
  }

  const [salt, hash] = storedHash.split(":");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

function sanitizeUser<T extends { passwordHash?: string | null }>(user: T) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function saveUserLocation(input: SaveLocationInput) {
  const nextLocation = resolveLocation(input.city, input.state, input.location);

  if (input.userId) {
    const existingUser = await prisma.user.findUnique({
      where: { id: input.userId }
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    return prisma.user.update({
      where: { id: input.userId },
      data: {
        city: input.city,
        state: input.state,
        location: nextLocation,
        ...(input.email ? { email: input.email } : {}),
        ...(input.phoneNumber ? { phoneNumber: input.phoneNumber } : {}),
        ...(input.name ? { name: input.name } : {})
      }
    });
  }

  return sanitizeUser(
    await prisma.user.create({
      data: {
        name: input.name ?? "Guest User",
        email: input.email,
        phoneNumber: input.phoneNumber,
        city: input.city,
        state: input.state,
        location: nextLocation,
        isGuest: input.isGuest ?? true
      }
    })
  );
}

export async function signupUser(input: SignupInput) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { phoneNumber: input.phoneNumber }]
    }
  });

  if (existingUser) {
    throw new ApiError(409, "A user with this email or phone number already exists");
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phoneNumber: input.phoneNumber,
      passwordHash: hashPassword(input.password),
      city: input.city,
      state: input.state,
      location: resolveLocation(input.city, input.state, input.location),
      isGuest: false,
      role: "user"
    }
  });

  return sanitizeUser(user);
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.identifier }, { phoneNumber: input.identifier }]
    }
  });

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new ApiError(401, "Invalid login credentials");
  }

  return sanitizeUser(user);
}

export async function getUserProfile(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
}

export async function updateUserProfile(input: UpdateProfileInput) {
  const existingUser = await prisma.user.findUnique({ where: { id: input.id } });
  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const user = await prisma.user.update({
    where: { id: input.id },
    data: {
      ...(input.name ? { name: input.name } : {}),
      ...(input.city ? { city: input.city } : {}),
      ...(input.state ? { state: input.state } : {}),
      ...(input.location || input.city || input.state
        ? { location: resolveLocation(input.city ?? existingUser.city ?? undefined, input.state ?? existingUser.state ?? undefined, input.location) }
        : {}),
      ...(input.preferredCategory ? { preferredCategory: input.preferredCategory } : {})
    }
  });

  return sanitizeUser(user);
}

export async function updateUserPassword(input: UpdatePasswordInput) {
  const existingUser = await prisma.user.findUnique({
    where: { id: input.id },
    select: { id: true, passwordHash: true, isGuest: true }
  });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }
  if (existingUser.isGuest) {
    throw new ApiError(400, "Guest users cannot change password");
  }
  if (!verifyPassword(input.currentPassword, existingUser.passwordHash)) {
    throw new ApiError(401, "Current password is incorrect");
  }

  await prisma.user.update({
    where: { id: input.id },
    data: { passwordHash: hashPassword(input.nextPassword) }
  });

  return { updated: true };
}

export async function listRegisteredUsers() {
  const users = await prisma.user.findMany({
    where: { isGuest: false },
    orderBy: { createdAt: "desc" }
  });

  return users.map(sanitizeUser);
}
