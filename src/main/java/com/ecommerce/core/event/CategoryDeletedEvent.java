package com.ecommerce.core.event;

public class CategoryDeletedEvent {
    private Long id;

    public CategoryDeletedEvent() {
    }

    public CategoryDeletedEvent(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
