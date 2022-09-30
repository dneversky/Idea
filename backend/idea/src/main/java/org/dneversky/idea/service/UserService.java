package org.dneversky.idea.service;

import org.dneversky.idea.entity.Role;
import org.dneversky.idea.entity.User;
import org.dneversky.idea.payload.PasswordChangeRequest;
import org.dneversky.idea.payload.UserRequest;
import org.dneversky.idea.security.UserPrincipal;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

public interface UserService {

    List<User> getAllUsers();

    User getUser(long id);

    User getUser(String username);

    User createUser(User user, boolean admin);

    User updateUser(String username, UserPrincipal principal, UserRequest userRequest, MultipartFile avatar, boolean removeAvatar);

    void deleteUser(long id, UserPrincipal userPrincipal);

    void patchPassword(String username, UserPrincipal userPrincipal, PasswordChangeRequest passwordChangeRequest);

    void blockUser(String username, UserPrincipal userPrincipal);

    void unblockUser(String username, UserPrincipal userPrincipal);

    void changeRoles(String username, Set<Role> roles, UserPrincipal userPrincipal);
}
