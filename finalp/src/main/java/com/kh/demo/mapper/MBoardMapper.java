package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.MBoardDTO;
import com.kh.demo.domain.dto.Criteria;

@Mapper
public interface MBoardMapper {
	//insert
	int insertBoard(MBoardDTO board);

	//update
	int updateBoard(MBoardDTO board);
	int updateReadCount(Long boardnum);

	//delete
	int deleteBoard(Long boardnum);

	//select
	List<MBoardDTO> getMlist(Criteria cri);
	List<MBoardDTO> getRlist(Criteria cri);
	Long getMTotal(Criteria cri);
	Long getRTotal(Criteria cri);
	Long getLastNum(String userid);
	MBoardDTO findByNum(Long boardnum);

}



