package org.dneversky.idea.service.impl;

import org.dneversky.idea.entity.Tag;
import org.dneversky.idea.repository.IdeaRepository;
import org.dneversky.idea.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagServiceImpl {

    private final TagRepository tagRepository;
    private final IdeaRepository ideaRepository;

    public TagServiceImpl(TagRepository tagRepository, IdeaRepository ideaRepository) {
        this.tagRepository = tagRepository;
        this.ideaRepository = ideaRepository;
    }

    public List<Tag> getTags() {

        return tagRepository.findAll();
    }

    public Tag getTagById(int id) {
        Optional<Tag> findTag = tagRepository.findById(id);

        return findTag.orElse(null);
    }

    public Tag getTagByName(String name) {
        tagRepository.findByName(name);

        return tagRepository.findByName(name);
    }

    public Tag saveTag(Tag tag) {

        return tagRepository.save(tag);
    }

    public Tag putTag(Tag tag) {
        Optional<Tag> findTag = tagRepository.findById(tag.getId());
        if(!findTag.isPresent())
            return null;

        findTag.get().setName(tag.getName());

        return  tagRepository.save(findTag.get());
    }

    public void deleteTag(Tag tag) {
        ideaRepository.findAll().forEach(i -> {
            i.getTags().remove(tag);
            ideaRepository.save(i);
        });

        tagRepository.delete(tag);
    }
}