package com.kh.demo.service;

import java.util.List;

import com.kh.demo.domain.dto.Story_ReplyDTO;

public interface Story_ReplyService {
	boolean regist(Story_ReplyDTO reply);
	List<Story_ReplyDTO> getReplies(int storyNum);
	String modifyAndGetReplyContents(int storyReplyNum, String newData);
	
	Story_ReplyDTO getLastestReply();
	
	boolean removeReply(int storyReplyNum);
	
	boolean removeReplyByStorynum(int storyNum);
}
