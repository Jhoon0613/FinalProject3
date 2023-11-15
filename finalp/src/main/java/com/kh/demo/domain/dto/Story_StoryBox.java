package com.kh.demo.domain.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Story_StoryBox {
	private Story_StoryDTO story;
	private List<Story_FileDTO> files;
	private List<Story_ReplyDTO> replies;
	private String forTime;
	private boolean followCheck;
	private boolean likeCheck;
}
