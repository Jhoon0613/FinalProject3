package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.UserFileDTO;

@Mapper
public interface UserFileMapper {
	int insertFile(UserFileDTO file);
	
	List<UserFileDTO> getFiles(Long useridx);
	
	int deleteBySystemname(String systemname);
	
	int deleteByBoardnum(Long useridx);
	
	List<UserFileDTO> findByUseridx(Long useridx);

	int updateFile(UserFileDTO file);

	int insertnewFile(UserFileDTO ufdto);

	Object getFileByUserIdxAndOrgName(Long useridx, String orgname);
	
}
