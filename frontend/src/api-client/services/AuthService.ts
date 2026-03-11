/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAuthUserDto } from '../models/ApiResponseAuthUserDto';
import type { ApiResponseLoginResponse } from '../models/ApiResponseLoginResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { SocialLoginRequest } from '../models/SocialLoginRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Đăng nhập Google/Facebook
     * Xác thực Firebase Token và cấp JWT.
     * @param requestBody
     * @returns ApiResponseLoginResponse OK
     * @throws ApiError
     */
    public static socialLogin(
        requestBody: SocialLoginRequest,
    ): CancelablePromise<ApiResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/social-login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Đăng ký
     * Tự đăng ký tài khoản mới và đặt JWT Cookie.
     * @param requestBody
     * @returns ApiResponseLoginResponse OK
     * @throws ApiError
     */
    public static register(
        requestBody: RegisterRequest,
    ): CancelablePromise<ApiResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Làm mới Token
     * Dùng Refresh Token từ Cookie để lấy Access Token mới.
     * @returns ApiResponseLoginResponse OK
     * @throws ApiError
     */
    public static refresh(): CancelablePromise<ApiResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
        });
    }
    /**
     * Đăng xuất
     * Xóa JWT Cookie.
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static logout(): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
        });
    }
    /**
     * Đăng nhập
     * Trả về JWT và thông tin user (Cũng đặt JWT trong HttpOnly Cookie).
     * @param requestBody
     * @returns ApiResponseLoginResponse OK
     * @throws ApiError
     */
    public static login(
        requestBody: LoginRequest,
    ): CancelablePromise<ApiResponseLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Thông tin user hiện tại
     * Lấy thông tin user từ JWT (cần Authorization: Bearer <token>).
     * @returns ApiResponseAuthUserDto OK
     * @throws ApiError
     */
    public static me(): CancelablePromise<ApiResponseAuthUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
        });
    }
}
