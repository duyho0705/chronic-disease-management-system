/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddPatientInsuranceRequest } from '../models/AddPatientInsuranceRequest';
import type { AddPatientRelativeRequest } from '../models/AddPatientRelativeRequest';
import type { ApiResponseListPatientInsuranceDto } from '../models/ApiResponseListPatientInsuranceDto';
import type { ApiResponseListPatientRelativeDto } from '../models/ApiResponseListPatientRelativeDto';
import type { ApiResponsePatientDto } from '../models/ApiResponsePatientDto';
import type { ApiResponsePatientInsuranceDto } from '../models/ApiResponsePatientInsuranceDto';
import type { ApiResponsePatientRelativeDto } from '../models/ApiResponsePatientRelativeDto';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { UpdatePatientProfileRequest } from '../models/UpdatePatientProfileRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientProfileService {
    /**
     * Lấy hồ sơ bệnh nhân hiện tại
     * @returns ApiResponsePatientDto OK
     * @throws ApiError
     */
    public static getProfile(): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/profile',
        });
    }
    /**
     * Cập nhật hồ sơ bệnh nhân
     * @param requestBody
     * @returns ApiResponsePatientDto OK
     * @throws ApiError
     */
    public static updateProfile(
        requestBody: UpdatePatientProfileRequest,
    ): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/portal/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cập nhật người thân
     * @param id
     * @param requestBody
     * @returns ApiResponsePatientRelativeDto OK
     * @throws ApiError
     */
    public static updateRelative(
        id: string,
        requestBody: AddPatientRelativeRequest,
    ): CancelablePromise<ApiResponsePatientRelativeDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/portal/profile/family/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xóa người thân
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteRelative(
        id: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/portal/profile/family/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Lấy danh sách bảo hiểm
     * @returns ApiResponseListPatientInsuranceDto OK
     * @throws ApiError
     */
    public static getInsurances(): CancelablePromise<ApiResponseListPatientInsuranceDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/profile/insurance',
        });
    }
    /**
     * Thêm bảo hiểm
     * @param requestBody
     * @returns ApiResponsePatientInsuranceDto OK
     * @throws ApiError
     */
    public static addInsurance(
        requestBody: AddPatientInsuranceRequest,
    ): CancelablePromise<ApiResponsePatientInsuranceDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/profile/insurance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy danh sách người thân
     * @returns ApiResponseListPatientRelativeDto OK
     * @throws ApiError
     */
    public static getFamily(): CancelablePromise<ApiResponseListPatientRelativeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/profile/family',
        });
    }
    /**
     * Thêm người thân
     * @param requestBody
     * @returns ApiResponsePatientRelativeDto OK
     * @throws ApiError
     */
    public static addRelative(
        requestBody: AddPatientRelativeRequest,
    ): CancelablePromise<ApiResponsePatientRelativeDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/profile/family',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Đổi mật khẩu
     * @param requestBody
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static changePassword(
        requestBody: ChangePasswordRequest,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/profile/change-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Tải ảnh đại diện
     * @param formData
     * @returns ApiResponsePatientDto OK
     * @throws ApiError
     */
    public static uploadAvatar(
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<ApiResponsePatientDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/profile/avatar',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Lấy mã QR Check-in số hóa
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static getCheckInCode(): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/profile/check-in-code',
        });
    }
    /**
     * Xóa bảo hiểm
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteInsurance(
        id: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/portal/profile/insurance/{id}',
            path: {
                'id': id,
            },
        });
    }
}
