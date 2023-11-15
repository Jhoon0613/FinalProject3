package com.kh.demo.domain.dto;

import org.springframework.web.util.UriComponentsBuilder;

import lombok.Data;

@Data
public class Criteria {
	private int pagenum;
	private int amount;
	private String type;
	private String keyword;
	private int startrow;
	
	public Criteria() {
		this(1,9);
	}
	
	public Criteria(int pagenum, int amount) {
		this.pagenum = pagenum;
		this.amount = amount;
		this.startrow = (this.pagenum - 1) * this.amount;
	}
	
	public void setPagenum(int pagenum) {
		this.pagenum = pagenum;
		this.startrow = (this.pagenum - 1) * this.amount;
	}
	
//	MyBatis에서 #{typeArr} 로 사용 가능
	public String[] getTypeArr() {
		//type이 null이라면 return {}
		//type이 "TC"라면 return {"T","C"}
		return type == null ? new String[] {} : type.split("");
	}
	
	public String getListLink() {
		// /board/write?userid=apple
		// fromPath("/board/write").queryParam("userid","apple")
		//												//? 앞에 붙는 uri 문자열
		UriComponentsBuilder builder = UriComponentsBuilder.fromPath("")
				.queryParam("pagenum", pagenum)	//파라미터 추가
				.queryParam("amount", amount)
				.queryParam("keyword",keyword)
				.queryParam("type", type);
		return builder.toUriString();	//빌더가 가지고 있는 설정대로 문자열 만들기
	}
	
	
}







