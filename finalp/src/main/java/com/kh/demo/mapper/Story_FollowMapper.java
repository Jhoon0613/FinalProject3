package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface Story_FollowMapper {
	public int followingWhenExisting(String storyWriter, String whom);
	public int followingWhenNotExisting(String storyWriter, String whom);
	
	public int addFollowerWhenExisting(String whom, String storyWriter);
	public int addFollowerWhenNotExisting(String whom, String storyWriter);
	
	public int cancelFollowing(String storyWriter);
	public int removeFollower(String storyWriter);
	

	public List<Object> isStoryWriterInFollowing(String storyWriter, String whom);
	public List<Object> isStoryWriterInFollower(String storyWriter, String whom);
	
	public List<Object> whoLoginUserFollowed(String loginUser, String whom);
}
