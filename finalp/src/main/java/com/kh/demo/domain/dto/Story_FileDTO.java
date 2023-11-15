package com.kh.demo.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Story_FileDTO {
	private String systemName;
	private String orgName;
	private long storyNum;
}
