package com.kh.demo.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.UserDTO;
import com.kh.demo.domain.dto.UserFileDTO;


public interface UserService {
	
	boolean join(UserDTO user);
	
	boolean checkId(String userid);
	
	boolean ncheckId(String usernickname);
	
	UserDTO login(String userid, String userpw);

	boolean loginview(UserDTO user);

	List<UserDTO> getUserList(UserDTO user);

	String mypage(String loginUser, UserDTO user); 

	UserDTO getDetail(String userid);

	boolean pwmodify(UserDTO user);

	boolean pwck(UserDTO user);
	
	UserDTO checkUser(String userid, String checkPassword);

	boolean remove(String loginUser, String userid);

	public boolean remove(String userid);
	
	Long getTotal(Criteria cri);

	List<UserDTO> getLikepetlist(Criteria cri);

	boolean join(UserDTO user, MultipartFile[] files);

	ResponseEntity<Resource> getThumbnailResource(String systemname) throws Exception;

	ResponseEntity<Resource> getThumbnail(Long useridx) throws Exception;
	
	ResponseEntity<Object> downloadFile(String systemname, String orgname) throws Exception;

	boolean regist(UserDTO user, MultipartFile[] files) throws Exception;

	Long getLastNum(String userid);

	List<UserFileDTO> getFileList(Long useridx);

	List<UserDTO> getUserNum(Long useridx);

	boolean modify(UserDTO user, MultipartFile[] files) throws Exception;

	boolean modify(UserDTO user, MultipartFile[] files, String updateCnt) throws Exception;









}
