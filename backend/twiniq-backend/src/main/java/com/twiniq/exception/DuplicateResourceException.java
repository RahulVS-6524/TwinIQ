package com.twiniq.exception;

/**
 * Thrown when an operation would create a duplicate of a resource that must be unique
 * (e.g. creating a second BusinessDNA record for a Business that already has one).
 * Mapped to HTTP 409 by the controllers that catch it.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
