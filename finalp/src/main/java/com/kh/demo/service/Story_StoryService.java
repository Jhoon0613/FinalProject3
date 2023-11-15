package com.kh.demo.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.Story_StoryBox;
import com.kh.demo.domain.dto.Story_StoryDTO;
import com.kh.demo.domain.dto.Story_StoryWriteDTO;

public interface Story_StoryService {
	int uploadStory(Story_StoryWriteDTO swDTO, MultipartFile[] files);
	
	public ResponseEntity<Resource> getThumbnailResource(String systemName) throws Exception;
	
	public boolean modify(int storyNum, Story_StoryWriteDTO swDTO);
	
	public boolean remove(int storyNum);
	
	public Story_StoryDTO getStory(int storyNum);
	
	List<Story_StoryBox> getStories(int minstorynum, int maxstorynum, String keyword, String category, String loginUser);
	
	List<Object> getLikeList(int storyNum);
	
	//팔로우
	public boolean clickFollow(String storyWriter, String whom);
	public boolean cancelFollow(String storyWriter);
	
	//좋아요
	public boolean clickLike(String userid, int storyNum);
	public boolean cancelLike(String userid, int storyNum);
	
}
