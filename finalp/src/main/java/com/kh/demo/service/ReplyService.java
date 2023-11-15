package com.kh.demo.service;

import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.ReplyDTO;
import com.kh.demo.domain.dto.ReplyPageDTO;

public interface ReplyService {
	boolean regist(ReplyDTO reply);

	boolean modify(ReplyDTO reply);

	boolean remove(Long replynum);

	ReplyPageDTO getList(Criteria cri, Long boardnum);

	Long getLastNum(String userid);
}
