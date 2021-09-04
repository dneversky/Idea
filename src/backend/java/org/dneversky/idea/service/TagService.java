package org.dneversky.idea.service;

import org.dneversky.idea.entity.Tag;
import org.dneversky.idea.repository.IdeaRepository;
import org.dneversky.idea.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final IdeaRepository ideaRepository;

    public TagService(TagRepository tagRepository, IdeaRepository ideaRepository) {
        this.tagRepository = tagRepository;
        this.ideaRepository = ideaRepository;
    }

    public List<Tag> getTags() {

        return tagRepository.findAll();
    }

    public Tag saveTag(Tag tag) {

        return tagRepository.save(tag);
    }

    public void deleteTag(Tag tag) {
        ideaRepository.findAll().forEach(i -> {
            if(i.getTags().contains(tag.getName())) {
                i.getTags().remove(tag.getName());
                ideaRepository.save(i);
            }
        });

        tagRepository.delete(tag);
    }
}