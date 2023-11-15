package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.Story_StoryBox;
import com.kh.demo.domain.dto.Story_StoryDTO;

@Mapper
public interface StoryLikeMapper {
	//insert
	public int insert(String userid, int storyNum);
	
	//delete
	public int remove(String userid, int storyNum);
	
	//select
	public List<Object> likeList(int storyNum);
	
	//loginUser가 누구를 좋아요 했는지
	public List<Object> likeFind(String userid, int storyNum);

}
