package com.kh.demo.domain.dto;

import lombok.Data;

@Data
public class UserDTO {
	private Long useridx;
    private String userid;
    private String userpw;
    private String username;
    private String usergender;
	private String zipcode;
    private String addr;
    private String addrdetail; 
    private String usernickname;
    private String phonenum;
}
