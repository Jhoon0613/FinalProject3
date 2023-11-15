package com.kh.demo.domain.dto;

import lombok.Data;

@Data
public class MBoardDTO {
	private Long boardnum;
	private String userid;
	private String findtitle;
	private String pettype;
	private String findarea;
	private String findareadetail;
	private String findareadetail2;
	private String findcontents;
	private String category;
	private String petsex;
	private String petage;
	private String petweight;
	private String petchar;
	private String petcolor;
	private String neutering;
	private String phonenum;
	private String regdate;
	private int readcount;
}
