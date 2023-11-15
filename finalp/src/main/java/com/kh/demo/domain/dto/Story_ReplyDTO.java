package com.kh.demo.domain.dto;

import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Story_ReplyDTO {
	private int storyReplyNum;
	private String storyReplyWriter;
	private String storyReplyContents;
	private int storyNum;
	private Date storyReplyDate;
	private String storyReplyUpdateCheck;
}