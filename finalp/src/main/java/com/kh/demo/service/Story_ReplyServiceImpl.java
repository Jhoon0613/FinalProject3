package com.kh.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.kh.demo.domain.dto.Story_ReplyDTO;
import com.kh.demo.mapper.Story_ReplyMapper;

@Service
@Qualifier("ReplyServiceImpl")
public class Story_ReplyServiceImpl implements Story_ReplyService{
	@Autowired
	private Story_ReplyMapper rmapper;
	
	@Override
	public boolean regist(Story_ReplyDTO reply) {
		return rmapper.story_insertReply(reply) == 1;
	}
	
	@Override
	public List<Story_ReplyDTO> getReplies(int storyNum) {
		return rmapper.story_getRepliesByStorynum(storyNum);
	}
	
	@Override
	public String modifyAndGetReplyContents(int storyReplyNum, String newData) {
		return rmapper.story_modifyAndGetReplyContents(storyReplyNum, newData)==1?
				newData:null;
	}
	
	@Override
	public Story_ReplyDTO getLastestReply() {
		return rmapper.story_getLastestReply().get(0);
	}
	
	@Override
	public boolean removeReply(int storyReplyNum) {
		return rmapper.story_removeReply(storyReplyNum)==1;
	}
	
	@Override
	public boolean removeReplyByStorynum(int storyNum) {
		return rmapper.story_removeReplyByStorynum(storyNum)>=0;
	}
}
