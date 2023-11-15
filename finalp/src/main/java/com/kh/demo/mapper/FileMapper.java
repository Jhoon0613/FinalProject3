package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.FileDTO;

@Mapper
public interface FileMapper {
	int insertFile(FileDTO file);

	List<FileDTO> getFiles(Long boardnum);

	int deleteBySystemname(String systemname);

	int deleteByBoardnum(Long boardnum);
	
	FileDTO findByBoardnum(Long boardnum);
}
