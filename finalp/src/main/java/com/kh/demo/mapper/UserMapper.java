package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.UserDTO;
import com.kh.demo.domain.dto.UserFileDTO;

@Mapper
public interface UserMapper {
	int insertUser(UserDTO user);
	
	UserDTO findById(String userid);

	UserDTO findByNId(String usernickname);

	UserDTO getDetail(String userid);
	
	String getUserList(UserDTO user);

	int updateUser(UserDTO user);

	UserDTO findByPw(UserDTO user);
	
	List<UserDTO> checkUser(String userid, String checkPassword);

	int updateUserPw(UserDTO user);

	int deleteUser(String userid);

	Long getTotal(Criteria cri);
	
	List<UserDTO> getMlist(Criteria cri);

	Long getLastNum(String userid);

	List<UserDTO> getUserNum(Long useridx);

}
