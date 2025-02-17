package com.ecommerce.ProductService.controller;
import com.ecommerce.ProductService.error.ApiError;
import com.ecommerce.ProductService.error.InvalidBrandException;
import com.ecommerce.ProductService.error.InvalidCategoryException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Date;
import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(InvalidCategoryException.class)
    public ResponseEntity<ApiError> handleException(InvalidCategoryException e, HttpServletRequest request){
        ApiError error = new ApiError();
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setError(e.getMessage());
        error.setTimestamp(new Date());
        error.setPath(request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidBrandException.class)
    public ResponseEntity<ApiError> handleException(InvalidBrandException e, HttpServletRequest request){
        ApiError error = new ApiError();
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setError(e.getMessage());
        error.setTimestamp(new Date());
        error.setPath(request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleException(EntityNotFoundException e, HttpServletRequest request){
        ApiError error = new ApiError();
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setError(e.getMessage());
        error.setTimestamp(new Date());
        error.setPath(request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleException(MethodArgumentNotValidException e, HttpServletRequest request){
        ApiError error = new ApiError();
        error.setTimestamp(new Date());
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        List<String> errorMessages = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        if (errorMessages.size() == 1) {
            error.setError(errorMessages.get(0));
        } else {
            error.setError(errorMessages);
        }

        error.setPath(request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiError> handleException(Exception e, HttpServletRequest request){
//        ApiError error = new ApiError();
//        error.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
//        error.setError(e.getMessage());
//        error.setTimestamp(new Date());
//        error.setPath(request.getRequestURI());
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
}
