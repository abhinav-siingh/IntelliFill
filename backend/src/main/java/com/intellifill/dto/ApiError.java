package com.intellifill.dto;

/**
 * Standard error response shape for every endpoint:
 * { "success": false, "message": "...", "code": "SOME_ERROR_CODE" }
 */
public class ApiError {

    private boolean success = false;
    private String message;
    private String code;

    public ApiError(String message, String code) {
        this.message = message;
        this.code = code;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getCode() {
        return code;
    }
}
