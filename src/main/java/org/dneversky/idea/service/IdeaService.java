package org.dneversky.idea.service;

import org.dneversky.idea.entity.Idea;
import org.dneversky.idea.model.Status;
import org.dneversky.idea.payload.IdeaRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IdeaService {

    List<Idea> getAllIdeas();

    Idea getIdea(Long id);

    Idea saveIdea(IdeaRequest ideaRequest, List<MultipartFile> addImages, List<MultipartFile> addFiles, String username);

    Idea updateIdea(Long id, IdeaRequest ideaRequest, List<MultipartFile> addImages, List<MultipartFile> addFiles);

    void deleteIdea(Long id);

    Idea addLook(Long id, String username);

    Idea addRating(Long id, String username);

    Idea reduceRating(Long id, String username);

    Idea changeStatus(Long id, Status status);
}