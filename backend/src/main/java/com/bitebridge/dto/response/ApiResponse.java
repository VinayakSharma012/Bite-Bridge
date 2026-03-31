package com.bitebridge.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private int statusCode;

    public ApiResponse() {
    }

    public ApiResponse(boolean success, String message, T data, LocalDateTime timestamp, int statusCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
        this.statusCode = statusCode;
    }

    public static <T> ApiResponse<T> success(String message, T data, int statusCode) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.message = message;
        response.data = data;
        response.statusCode = statusCode;
        response.timestamp = LocalDateTime.now();
        return response;
    }

    public static <T> ApiResponse<T> error(String message, int statusCode) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        response.statusCode = statusCode;
        response.timestamp = LocalDateTime.now();
        return response;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
}
