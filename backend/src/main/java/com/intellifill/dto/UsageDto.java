package com.intellifill.dto;

public class UsageDto {

    private long totalRequests;

    public UsageDto(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getTotalRequests() { return totalRequests; }
}
