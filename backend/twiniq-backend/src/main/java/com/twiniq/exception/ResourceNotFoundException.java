package com.twiniq.exception;

/**
 * Thrown when a requested resource (Business, BusinessDNA, etc.) does not exist.
 * Mapped to HTTP 404 by the controllers that catch it.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
