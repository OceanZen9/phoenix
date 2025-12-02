import { http, HttpResponse, delay } from "msw";
import type {
  LoginPayload,
  AuthSuccessResponse,
  RegisterPayload,
} from "@/types/auth";
import type { UserProfile, UpdateProfilePayload } from "@/types/user";

// Mock database
let mockUser: UserProfile = {
  userId: "1",
  role: "customer",
  username: "Mock User",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  email: "test@test.com",
  address: "123 Mockingbird Lane",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const users: UserProfile[] = [mockUser];

export const handlers = [
  // Login handler
  http.post("*/api/v1/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginPayload;
    await delay(1000);

    if (email === "test@test.com" && password === "password") {
      const response: AuthSuccessResponse = {
        user: mockUser,
        tokens: {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
        },
      };
      return HttpResponse.json(response);
    } else {
      return new HttpResponse(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }
  }),

  // Register handler
  http.post("*/api/v1/auth/register", async ({ request }) => {
    const { username, email } = (await request.json()) as RegisterPayload;
    await delay(1000);

    const newUser: UserProfile = {
      userId: String(users.length + 1),
      role: "customer",
      username: username,
      email: email,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      address: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  // Get User Profile handler
  http.get("*/api/v1/users/profile", async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    await delay(500);

    if (!authHeader) {
      return new HttpResponse(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
    }
    
    return HttpResponse.json(mockUser);
  }),

  // Update User Profile handler
  http.patch("*/api/v1/users/profile", async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new HttpResponse(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
    }

    const payload = (await request.json()) as UpdateProfilePayload;
    await delay(1000);
    
    // Update the mock user data
    mockUser = {
      ...mockUser,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(mockUser);
  }),
];
