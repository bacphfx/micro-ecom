package com.ecommerce.UserService.repository;

import com.ecommerce.UserService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    Long countById(Long id);

    @Query("UPDATE User u SET u.enable = ?2 WHERE u.id = ?1")
    @Modifying
    void updateEnableStatus(Long id, boolean enable);
}
