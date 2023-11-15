package com.kh.demo.controller;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.Story_FileDTO;
import com.kh.demo.domain.dto.Story_ReplyDTO;
import com.kh.demo.domain.dto.Story_StoryBox;
import com.kh.demo.domain.dto.Story_StoryDTO;
import com.kh.demo.domain.dto.Story_StoryWriteDTO;
import com.kh.demo.domain.dto.UserFileDTO;
import com.kh.demo.service.Story_FileService;
import com.kh.demo.service.Story_ReplyService;
import com.kh.demo.service.Story_StoryService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/story/*")
public class Story_StoryController {
	@Autowired
	//@Qualifier("StoryServiceImpl")
	private Story_StoryService storyService;
	@Autowired
	private Story_ReplyService replyService;
	@Autowired
	private Story_FileService fileService;
	
	@GetMapping("/storylist")
	public String storyHome(HttpServletRequest req,Model model) {
		
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		if (loginUser != null) {
			UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
            model.addAttribute("proimage", proimage);
        }
		return "/story/storylist";
	}
	
	@GetMapping(value = "/getStories/{startNum}/{endNum}/{keyword}/{category}/{loginUser}")
	public ResponseEntity<List<Story_StoryBox>> getStoriesByAjax(
			@PathVariable("startNum") int startNum,
			@PathVariable("endNum") int endNum,
			@PathVariable("keyword") String keyword,
			@PathVariable("category") String category,
			@PathVariable("loginUser") String loginUser,
			Model model
		) {
		keyword = Objects.equals(keyword, "__nothing__")?"":keyword;
		loginUser = Objects.equals(loginUser, "__nothing__")?"":loginUser;
		List<Story_StoryBox> list =
				storyService.getStories(startNum, endNum, keyword, category, loginUser);
		
		System.out.println("loginUser: "+loginUser);
		System.out.println("story controller - get stories");
		return ResponseEntity.ok(list);
	}
	
	@PostMapping("/storylist/regist")
	public String afterWriting(Story_StoryWriteDTO swDTO, MultipartFile[] files) throws IllegalStateException, IOException {
		int storynum = storyService.uploadStory(swDTO, files);
		if(storynum==-1) return "에러 페이지로 이동";
		boolean fileCheck = fileService.uploadFile(storynum, files);

		System.out.println("story controller - regist");
		return fileCheck?"redirect:/story/storylist":"에러 페이지로 이동";
	}
	
	@GetMapping("/swrite")
	public String write(HttpServletRequest req, Model model) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		if (loginUser != null) {
			UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
            model.addAttribute("proimage", proimage);
        }
		return "/story/swrite";
	}
	
	@GetMapping("/thumbnail")
	public ResponseEntity<Resource> profileImages(String systemname) throws Exception {
		return storyService.getThumbnailResource(systemname);
	}
	
	@GetMapping(value = "modify/{storyNum}")
	public String swriteToModify(
			@PathVariable("storyNum") int storyNum,
			Model model
	){
		Story_StoryDTO sDTO = storyService.getStory(storyNum);
		List<Story_FileDTO> fList = fileService.getFilesByStorynum(storyNum);
		
		
		Story_StoryWriteDTO swDTO = Story_StoryWriteDTO.builder()
				.storyCategory(sDTO.getStoryCategory())
				.storyContents(sDTO.getStoryContents())
				.storyWriter(sDTO.getStoryWriter())
				.build();
		
		model.addAttribute("modify","modify");
		model.addAttribute("storynum",storyNum);
		model.addAttribute("swDTO",swDTO);
		model.addAttribute("fList",fList);
		model.addAttribute("path", "");
		
		System.out.println("story controller - modify");
		sDTO = null;
		fList = null;
		
		return "/story/swrite";
	}
	
	@PostMapping("/storylist/modify")
	public String afterModify(
			@RequestParam("storynum") int storyNum,
			HttpServletRequest req,
			//@RequestParam("orgFiles") String[] orgFiles,
			Story_StoryWriteDTO swDTO,
			MultipartFile[] files
	) throws IllegalStateException, IOException {
		boolean fileUploadCheck = true;
		boolean fileRemoveCheck = true;
		boolean storyModifyCheck = true;
		
		String[] orgFiles = req.getParameterValues("orgFiles");
		
		if(orgFiles != null) { //기존 파일이 있을 경우
			fileRemoveCheck = fileService.reomveFileModifying(storyNum, orgFiles);
		}else {
			fileRemoveCheck = fileService.removeFileByStorynum(storyNum);
		}
		if(files != null) { //새로 업로드한 파일 있을 때
			fileUploadCheck = fileService.uploadFile(storyNum, files);
		}
		storyModifyCheck = storyService.modify(storyNum, swDTO);
		
		if(!fileUploadCheck||!fileRemoveCheck||!storyModifyCheck) {
			return "실패 페이지";
		}
		
		System.out.println("story controller - modify");
		return "redirect:/story/storylist";
	}
	
	@DeleteMapping(value = "/{storyNum}")
	public ResponseEntity<String> remove(@PathVariable("storyNum") int storyNum){
		boolean check = false;
		if(storyService.remove(storyNum)) {
			if(replyService.removeReplyByStorynum(storyNum)) {
				if(fileService.removeFileByStorynum(storyNum)) {
					check = true;
				}
			}
		}
		
		return check?ResponseEntity.ok("story"+storyNum)
				:ResponseEntity.badRequest().body("fail");
	}
	
	@PostMapping(value = "/clickFollow/{loginUser}/{whom}")
	public ResponseEntity<String> following(
			@PathVariable("loginUser") String loginUser,
			@PathVariable("whom") String whom
	){
		boolean ckech = storyService.clickFollow(loginUser, whom);
		if(ckech) {
			System.out.println("story controller - 팔로우 성공");
			return ResponseEntity.ok("success");
		}else {
			System.out.println("story controller - 팔로우 실패");
			return ResponseEntity.badRequest().body("fail");
		}
	}
	
	@PostMapping(value = "/cancelFollow/{storyWriter}")
	public ResponseEntity<String> cancelFollow(
			@PathVariable("storyWriter") String storyWriter
	){
		System.out.println("loginuser: "+storyWriter);
		
		boolean ckech = storyService.cancelFollow(storyWriter);
		if(ckech) {
			System.out.println("story controller - 팔로우 취소 성공");
			return ResponseEntity.ok("success");
		}else {
			System.out.println("story controller - 팔로우 취소 실패");
			return ResponseEntity.badRequest().body("fail");
		}
	}
	
	@GetMapping(value = "/likeList/{storyNum}")
	public ResponseEntity<List<Object>> getLikelist(@PathVariable("storyNum") int storyNum){
		List<Object> list = storyService.getLikeList(storyNum);
		System.out.println("list: "+list);
		return ResponseEntity.ok(list);
	}
	
	@PostMapping(value = "/clickLike/{loginUser}/{storyNum}")
	public ResponseEntity<String> clickLike(
			@PathVariable("loginUser") String loginUser,
			@PathVariable("storyNum") int storyNum
	){
		boolean check = storyService.clickLike(loginUser, storyNum);
		if(check) {
			System.out.println("좋아요 성공");
			return ResponseEntity.ok("success");
		}else {
			System.out.println("좋아요 실패");
			return ResponseEntity.badRequest().body("fail");
		}
	}

	@PostMapping(value = "/cancelLike/{loginUser}/{storyNum}")
	public ResponseEntity<String> cancelLike(
			@PathVariable("loginUser") String loginUser,
			@PathVariable("storyNum") int storyNum
	){
		System.out.println("story controller - cancel like");
		boolean check = storyService.cancelLike(loginUser, storyNum);
		if(check) {
			System.out.println("좋아요취소 성공");
			return ResponseEntity.ok("success");
		}else {
			System.out.println("좋아요취소 실패");
			return ResponseEntity.badRequest().body("fail");
		}
	}
	
	
	

//	if(req.getSession().getAttribute("loginUser") == null) {
//		return "/index";
//	}

	

}











