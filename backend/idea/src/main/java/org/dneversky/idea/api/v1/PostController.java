package org.dneversky.idea.api.v1;

import org.dneversky.idea.entity.Post;
import org.dneversky.idea.payload.PostRequest;
import org.dneversky.idea.service.impl.PostServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("v1/posts")
public class PostController {

    private final PostServiceImpl postServiceImpl;

    @Autowired
    public PostController(PostServiceImpl postServiceImpl) {
        this.postServiceImpl = postServiceImpl;
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postServiceImpl.getAllPosts());
    }

    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    @PostMapping
    public ResponseEntity<Post> savePost(@RequestBody @Valid PostRequest postRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postServiceImpl.createPost(postRequest));
    }

    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable int id, @RequestBody @Valid PostRequest postRequest) {
        return ResponseEntity.ok(postServiceImpl.updatePost(id, postRequest));
    }

    @Secured({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"})
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable int id) {
        postServiceImpl.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable int id) {
        return ResponseEntity.ok(postServiceImpl.getPost(id));
    }
}
