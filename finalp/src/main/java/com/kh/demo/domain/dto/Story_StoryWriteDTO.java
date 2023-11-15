package com.kh.demo.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Story_StoryWriteDTO {
	private String storyCategory;
	private String storyContents;
	private String storyWriter;
}
