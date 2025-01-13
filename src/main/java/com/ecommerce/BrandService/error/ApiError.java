package com.ecommerce.BrandService.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ApiError {
    private Date timestamp;
    private Integer status;
    private Object error;
    private String path;

    public void setError(String singleError){
        this.error = singleError;
    }

    public void setError(List<String> multiErrors){
        this.error = multiErrors;
    }
}
