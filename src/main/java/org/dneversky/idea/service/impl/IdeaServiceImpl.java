package org.dneversky.idea.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dneversky.idea.entity.Idea;
import org.dneversky.idea.entity.User;
import org.dneversky.idea.model.Status;
import org.dneversky.idea.payload.IdeaRequest;
import org.dneversky.idea.repository.IdeaRepository;
import org.dneversky.idea.repository.UserRepository;
import org.dneversky.idea.service.IdeaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class IdeaServiceImpl implements IdeaService {

    @Value("${uploadPath}")
    private String UPLOAD_PATH;

    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;

    @Override
    public List<Idea> getAllIdeas() {

        return ideaRepository.findAll();
    }

    @Override
    public Idea getIdea(Long id) {

        return ideaRepository.findById(id).orElseThrow(()
                -> new EntityNotFoundException("Entity Idea with id " + id + "not found."));
    }

    @Override
    public Idea saveIdea(IdeaRequest ideaRequest, List<MultipartFile> addImages,
                         List<MultipartFile> addFiles, String username) {

        Idea idea = new Idea();
        idea.setTitle(ideaRequest.getTitle());
        idea.setBody(ideaRequest.getBody());
        idea.setStatus(Status.LOOKING);
        idea.setCreatedDate(LocalDate.now());
        idea.setTags(ideaRequest.getTags());

        uploadImages(idea, addImages);
        uploadFiles(idea, addFiles);

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User with username " + username + " not found."));

        user.getIdeas().add(idea);

        idea.setAuthor(user);

        return ideaRepository.save(idea);
    }

    @Override
    public Idea updateIdea(Long id, IdeaRequest ideaRequest, List<MultipartFile> addImages, List<MultipartFile> addFiles) {
        Idea idea = ideaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Entity Idea with id " + id + " not found."));

        idea.setTitle(ideaRequest.getTitle());
        idea.setBody(ideaRequest.getBody());
        idea.setTags(ideaRequest.getTags());

        removeImages(idea, ideaRequest.getRemoveImages());
        removeFiles(idea, ideaRequest.getRemoveFiles());

        uploadImages(idea, addImages);
        uploadFiles(idea, addFiles);

        return ideaRepository.save(idea);
    }

    @Override
    public void deleteIdea(Long id) {
        Idea idea = ideaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Entity Idea with id " + id + " not found."));

        removeImages(idea, idea.getImages());
        removeFiles(idea, idea.getFiles().keySet());

        idea.getAuthor().getIdeas().remove(idea); // ?

        ideaRepository.delete(idea);
    }

    @Override
    public Idea changeStatus(Long id, Status status) {
        Idea idea = ideaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Entity Idea with id " + id + " not found."));

        idea.setStatus(status);

        return ideaRepository.save(idea);
    }

    @Override
    public Idea addLook(Long id, String username) {
        Idea idea = ideaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Entity Idea with id " + id + " not found."));
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User with username " + username + " not found."));

        if(!idea.getLookedUsers().contains(user.getId())) {
            idea.getLookedUsers().add(user.getId());

            ideaRepository.save(idea);
        }

        return idea;
    }

    @Override
    public Idea addRating(Long id, String username) {
        Idea idea = ideaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Entity Idea with id " + id + " not found."));
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User with username " + username + " not found."));

        if(idea.getRatedUsers().contains(user)) {
            idea.getRatedUsers().remove(user);
        } else {
            idea.getRatedUsers().add(user);
        } idea.getUnratedUsers().remove(user);

        return ideaRepository.save(idea);
    }

    @Override
    public Idea reduceRating(Long id, String username) {
        Idea idea = ideaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Entity Idea with id " + id + " not found."));
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("User with username " + username + " not found."));

        if(idea.getUnratedUsers().contains(user)) {
            idea.getUnratedUsers().remove(user);
        } else {
            idea.getUnratedUsers().add(user);
        }
        idea.getRatedUsers().remove(user);

        return ideaRepository.save(idea);
    }

    private void uploadImages(Idea idea, Collection<MultipartFile> images) {
        if (images != null) {
            for (MultipartFile pair : images) {
                if (Objects.requireNonNull(pair.getOriginalFilename()).isEmpty())
                    continue;
                String fileName = java.util.UUID.randomUUID() + "_"
                        + StringUtils.cleanPath(Objects.requireNonNull(pair.getOriginalFilename()));
                try {
                    Path path = Paths.get(UPLOAD_PATH + "/images/" + fileName);
                    Files.copy(pair.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                    idea.getImages().add(fileName);
                } catch (IOException e) {
                    log.error("Uploading idea's images error: {}", e.getMessage());
                }
            }
        }
    }

    private void uploadFiles(Idea idea, Collection<MultipartFile> files){
        if(files != null) {
            for (MultipartFile pair : files) {
                if (Objects.requireNonNull(pair.getOriginalFilename()).isEmpty())
                    continue;
                String fileName = java.util.UUID.randomUUID() + "_"
                        + StringUtils.cleanPath(Objects.requireNonNull(pair.getOriginalFilename()));
                try {
                    Path path = Paths.get(UPLOAD_PATH + "files/" + fileName);
                    Files.copy(pair.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                    idea.getFiles().put(fileName, pair.getOriginalFilename());
                } catch (IOException e) {
                    log.error("Uploading idea's files error: {}", e.getMessage());
                }
            }
        }
    }

    private void removeImages(Idea idea, Collection<String> images) {
        if (images != null) {
            for (String pair : images) {
                if (Files.exists(Paths.get(UPLOAD_PATH + "images/" + pair))) {
                    try {
                        Files.delete(Paths.get(UPLOAD_PATH + "images/" + pair));
                        idea.getImages().remove(pair);
                    } catch (IOException e) {
                        log.error("Removing idea's images error: {}", e.getMessage());
                    }
                }
            }
        }
    }

    private void removeFiles(Idea idea, Collection<String> files) {
        if (files != null) {
            for (String pair : files) {
                if (Files.exists(Paths.get(UPLOAD_PATH + "files/" + pair))) {
                    try {
                        Files.delete(Paths.get(UPLOAD_PATH + "files/" + pair));
                        idea.getFiles().remove(pair);
                    } catch (IOException e) {
                        log.error("Removing idea's files error: {}", e.getMessage());
                    }
                }
            }
        }
    }
}