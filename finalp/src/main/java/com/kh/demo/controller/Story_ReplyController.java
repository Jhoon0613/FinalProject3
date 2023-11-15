package com.kh.demo.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.kh.demo.domain.dto.Story_ReplyDTO;
import com.kh.demo.service.Story_ReplyService;

@Controller
@RequestMapping("/story_reply/*")
public class Story_ReplyController {
	@Autowired
	private Story_ReplyService rs;
	
	@PostMapping(value = "/{storyReplyWriter}/{storyReplyContents}/{storyNum}")
	public ResponseEntity<Story_ReplyDTO> regist(@PathVariable("storyReplyWriter") String storyReplyWriter,
			@PathVariable("storyReplyContents") String storyReplyContents,
			@PathVariable("storyNum") int storyNum
	) {
		System.out.println("reply controller - reply regist");
		Story_ReplyDTO reply = Story_ReplyDTO.builder()
				.storyReplyWriter(storyReplyWriter)
				.storyReplyContents(storyReplyContents)
				.storyNum(storyNum)
				.build();
		return rs.regist(reply)?ResponseEntity.ok(rs.getLastestReply())
				:ResponseEntity.badRequest().body(null);
	}
	
	@GetMapping(value = "/reply/{storynum}")
	public ResponseEntity<List<Story_ReplyDTO>> getReplies(@PathVariable("storynum") int storynum){
		List<Story_ReplyDTO> list = rs.getReplies(storynum);
		return ResponseEntity.ok(list);
	}
	
	@PatchMapping(value = "/{replynum}/{newData}"
			//, consumes = "application/json"
			)
	public ResponseEntity<String> modifyReply(@PathVariable("replynum") int replynum,
			@PathVariable("newData") String newData
	){
		String check = rs.modifyAndGetReplyContents(replynum, newData);
		return Objects.equals(newData, check)?
				ResponseEntity.ok(newData):ResponseEntity.badRequest().body(null);
	}
	
	@DeleteMapping(value = "/{storyReplyNum}")
	public ResponseEntity<String> removeReply(@PathVariable("storyReplyNum") int storyReplyNum){
		return rs.removeReply(storyReplyNum)?ResponseEntity.ok("삭제된 댓글입니다.")
				:ResponseEntity.badRequest().body(null);
	}
}























