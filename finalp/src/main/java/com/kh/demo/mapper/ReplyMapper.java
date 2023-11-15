package com.kh.demo.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.ReplyDTO;

@Mapper
public interface ReplyMapper {
	//insert
	int insertReply(ReplyDTO reply);

	//update
	int updateReply(ReplyDTO reply);

	//delete
	int deleteReply(Long replynum);
	int deleteByBoardnum(Long boardnum);

	//select
	Long getLastNum(String userid);
	int getTotal(Long boardnum);
	List<ReplyDTO> getList(Criteria cri, Long boardnum);
	int getRecentReply(Long boardnum);
}








