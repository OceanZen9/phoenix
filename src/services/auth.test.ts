/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { login, register, refreshToken, logout } from './auth';
import type {
  PasswordLoginPayload,
  RegisterPayload,
  RefreshTokenPayload,
  LogoutPayload,
} from '@/types/auth';
import apiClient from './apiClient'; // Import the actual apiClient to mock it

// Mock the apiClient module
vi.mock('./apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Cast the mocked apiClient.post to a Mock type for easier testing
const mockApiClientPost = apiClient.post as Mock;

describe('auth service', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockApiClientPost.mockReset();
  });

  // --- Test cases for login function ---
  describe('login', () => {
    it('should successfully log in a user with correct credentials', async () => {
      // Mock successful API response
      const mockLoginResponse = {
        user: {
          userId: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        tokens: {
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
        },
      };
      mockApiClientPost.mockResolvedValueOnce({ data: mockLoginResponse });

      const payload: PasswordLoginPayload = {
        loginType: 'password',
        email: 'test@example.com',
        password: 'password123',
      };
      const result = await login(payload);

      expect(mockApiClientPost).toHaveBeenCalledWith('/api/v1/auth/login', payload);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should throw an error if login fails', async () => {
      const mockError = { message: 'Invalid credentials', status: 401 };
      mockApiClientPost.mockRejectedValueOnce(mockError); // apiClient's interceptor will convert to ApiError

      const payload: PasswordLoginPayload = {
        loginType: 'password',
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      await expect(login(payload)).rejects.toEqual(mockError);
    });
  });

  // --- Test cases for register function ---
  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockRegisterResponse = {
        userId: '2',
        username: 'newuser',
        email: 'new@example.com',
        role: 'user',
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };
      mockApiClientPost.mockResolvedValueOnce({ data: mockRegisterResponse });

      const payload: RegisterPayload = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword123',
        verificationCode: '123456',
      };
      const result = await register(payload);

      expect(mockApiClientPost).toHaveBeenCalledWith('/api/v1/auth/register', payload);
      expect(result).toEqual(mockRegisterResponse);
    });

    it('should throw an error if registration fails', async () => {
      const mockError = { message: 'Email already in use', status: 409 };
      mockApiClientPost.mockRejectedValueOnce(mockError);

      const payload: RegisterPayload = {
        username: 'existinguser',
        email: 'test@example.com',
        password: 'password123',
        verificationCode: '123456',
      };

      await expect(register(payload)).rejects.toEqual(mockError);
    });
  });

  // --- Test cases for refreshToken function ---
  describe('refreshToken', () => {
    it('should successfully refresh the access token', async () => {
      const mockRefreshTokenResponse = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };
      mockApiClientPost.mockResolvedValueOnce({ data: mockRefreshTokenResponse });

      const payload: RefreshTokenPayload = { refreshToken: 'oldRefreshToken' };
      const result = await refreshToken(payload);

      expect(mockApiClientPost).toHaveBeenCalledWith('/api/v1/auth/refreshToken', payload);
      expect(result).toEqual(mockRefreshTokenResponse);
    });

    it('should throw an error if refreshing token fails', async () => {
      const mockError = { message: 'Invalid refresh token', status: 401 };
      mockApiClientPost.mockRejectedValueOnce(mockError);

      const payload: RefreshTokenPayload = { refreshToken: 'invalidRefreshToken' };

      await expect(refreshToken(payload)).rejects.toEqual(mockError);
    });
  });

  // --- Test cases for logout function ---
  describe('logout', () => {
    it('should successfully log out a user', async () => {
      mockApiClientPost.mockResolvedValueOnce({ data: {} }); // Logout usually returns empty data or a success message

      const payload: LogoutPayload = { refreshToken: 'userRefreshToken' };
      await logout(payload);

      expect(mockApiClientPost).toHaveBeenCalledWith('/api/v1/auth/logout', payload);
    });

    it('should throw an error if logout fails', async () => {
      const mockError = { message: 'Logout failed', status: 500 };
      mockApiClientPost.mockRejectedValueOnce(mockError);

      const payload: LogoutPayload = { refreshToken: 'userRefreshToken' };

      await expect(logout(payload)).rejects.toEqual(mockError);
    });
  });
});
