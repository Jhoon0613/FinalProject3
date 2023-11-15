package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.Story_StoryDTO;
import com.kh.demo.domain.dto.Story_StoryWriteDTO;

@Mapper
public interface Story_StoryMapper {
	List<Story_StoryDTO> story_getStories(int startNum, int endNum, String keyword, String category);
	
	int story_insertStory(Story_StoryWriteDTO swDTO);
	
	int story_getLastnum();
	
	int story_remomveStory(int storyNum);
	
	List<Story_StoryDTO> story_getStory(int storynum);
	
	int story_updateStory(int storynum, Story_StoryWriteDTO swDTO);
	
	int likeUp(int storyNum);
	int likeDown(int storyNum);
}
