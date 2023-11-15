package com.kh.demo.domain.dto;

import java.sql.Timestamp;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Story_StoryDTO {
	private int storyNum;
	private String storyCategory;
	private String storyContents;
	private String storyWriter;
	private int storyLikes;
	private Timestamp storyDate;
	private String storyModifyCheck;
}
