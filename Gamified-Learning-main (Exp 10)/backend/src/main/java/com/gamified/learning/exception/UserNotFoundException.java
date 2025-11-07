// UserNotFoundException.java
package com.gamified.learning.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}