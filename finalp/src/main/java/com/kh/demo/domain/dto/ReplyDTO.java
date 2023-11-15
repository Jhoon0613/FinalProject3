package com.kh.demo.domain.dto;

import lombok.Data;

@Data
public class ReplyDTO {
	private Long replynum;
	private String replycontents;
	private String regdate;
	private String updatedate;
	private String userid;
	private Long boardnum;
}
