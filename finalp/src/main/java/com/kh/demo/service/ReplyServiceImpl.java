package com.kh.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.ReplyDTO;
import com.kh.demo.domain.dto.ReplyPageDTO;
import com.kh.demo.mapper.ReplyMapper;

@Service
public class ReplyServiceImpl implements ReplyService{
	@Autowired
	private ReplyMapper rmapper;

	@Override
	public boolean regist(ReplyDTO reply) {
		return rmapper.insertReply(reply) == 1;
	}

	@Override
	public boolean modify(ReplyDTO reply) {
		return rmapper.updateReply(reply) == 1;
	}

	@Override
	public boolean remove(Long replynum) {
		return rmapper.deleteReply(replynum) == 1;
	}

	@Override
	public ReplyPageDTO getList(Criteria cri, Long boardnum) {
		return new ReplyPageDTO(rmapper.getTotal(boardnum), rmapper.getList(cri, boardnum));
	}

	@Override
	public Long getLastNum(String userid) {
		return rmapper.getLastNum(userid);
	}
}
