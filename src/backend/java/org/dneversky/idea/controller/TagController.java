package org.dneversky.idea.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Set;

@RequestMapping("tags")
@RestController
public class TagController {

    private final RedisTemplate<String, String> redisTemplate;

    @Resource(name = "redisTemplate")
    private SetOperations<String, String> setOperations;

    public TagController(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @GetMapping
    public ResponseEntity<Set<String>> getAll() {
        setOperations.add("tags", "Banana");
        return new ResponseEntity<>(setOperations.members("tags"), HttpStatus.OK);
    }
}
