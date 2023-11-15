package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.Story_FileDTO;

@Mapper
public interface Story_FileMapper {
	int story_insertFile(Story_FileDTO fdto);
	
	List<Story_FileDTO> story_getFiles(int minstorynum, int maxstorynum, String checkIfStory);
	
	int story_removeFileByStorynum(int storyNum);
	int story_removeFileBySystemname(String systemname);
	
	List<Story_FileDTO> story_getFilesByStorynum(int storyNum);
}
