package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.Story_ReplyDTO;

@Mapper
public interface Story_ReplyMapper {
	int story_insertReply(Story_ReplyDTO rDTO);
	
	List<Story_ReplyDTO> story_getStoryWithReplies(int minstorynum, int maxstorynum, String checkIfStory);
	List<Story_ReplyDTO> story_getRepliesByStorynum(int storyNum);
	int story_modifyAndGetReplyContents(int storyReplyNum, String newData);
	
	List<Story_ReplyDTO> story_getLastestReply();
	
	int story_removeReply(int storyReplyNum);
	int story_removeReplyByStorynum(int storyNum);
}
