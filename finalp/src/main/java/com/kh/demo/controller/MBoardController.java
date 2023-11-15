package com.kh.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.FileDTO;
import com.kh.demo.domain.dto.MBoardDTO;
import com.kh.demo.domain.dto.PageDTO;
import com.kh.demo.domain.dto.UserFileDTO;
import com.kh.demo.service.MBoardService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/mboard/*")
public class MBoardController {
	@Autowired
	@Qualifier("MBoardServiceImpl")
	private MBoardService service;

	@GetMapping("mlist")
	public void mlist(Criteria cri, Model model,HttpServletRequest req, Long boardnum) throws Exception {
		List<MBoardDTO> list = service.getBoardMlist(cri);
		model.addAttribute("list", list);
		model.addAttribute("pageMaker", new PageDTO(service.getMTotal(cri), cri));
		model.addAttribute("files", service.getFileList(boardnum));
		
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		if (loginUser != null) {
			UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
            model.addAttribute("proimage", proimage);
        }
	}

	@GetMapping("rlist")
	public void rlist(Criteria cri, Model model,HttpServletRequest req) throws Exception {
		List<MBoardDTO> list = service.getBoardRlist(cri);
		model.addAttribute("list", list);
		model.addAttribute("pageMaker", new PageDTO(service.getRTotal(cri), cri));
	
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		if (loginUser != null) {
			UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
            model.addAttribute("proimage", proimage);
        }
	}

	@GetMapping("mwrite")
	public void mwrite(@ModelAttribute("cri") Criteria cri,HttpServletRequest req, Model model, MBoardDTO board) {
		model.addAttribute("board", board);
		
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		if (loginUser != null) {
			UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
            model.addAttribute("proimage", proimage);
        }
	}

	@PostMapping("mwrite")
	public String mwrite(MBoardDTO board, MultipartFile[] files, Criteria cri) throws Exception {
		Long boardnum = 0l;
		if (service.regist(board, files)) {
			boardnum = service.getLastNum(board.getUserid());
//			return "redirect:/mboard/mget"+cri.getListLink()+"&boardnum="+boardnum;
			return "redirect:/mboard/mlist" + cri.getListLink() + "&boardnum=" + boardnum;
		} else {
			return "redirect:/mboard/mlist" + cri.getListLink();
		}
	}


	@GetMapping(value = { "mget", "mmodify" })
	public String mget(
			Long boardnum,
			Criteria cri,
			HttpServletRequest req,
			HttpServletResponse resp,
			Model model) {
		List<MBoardDTO> list = service.getBoardMlist(cri);
		model.addAttribute("cri", cri);
		model.addAttribute("list", list);
		model.addAttribute("reply_cnt",service.getReplyCnt(boardnum));
		HttpSession session = req.getSession();
		MBoardDTO board = service.getDetail(boardnum);
		model.addAttribute("board", board);
		model.addAttribute("files", service.getFileList(boardnum));
		String loginUser = (String) session.getAttribute("loginUser");
		UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
		String requestURI = req.getRequestURI();
		if (loginUser != null) {
            model.addAttribute("proimage", proimage);
        }
		if (requestURI.contains("/mget")) {
			// 게시글의 작성자가 로그인된 유저가 아닐 때
			if (!board.getUserid().equals(loginUser)) {
				// 쿠키 검사
				Cookie[] cookies = req.getCookies();
				Cookie read_board = null;
				if (cookies != null) {
					for (Cookie cookie : cookies) {
						// ex) 1번 게시글을 조회하고자 클릭했을 때에는 "read_board1" 쿠키를 찾음
						if (cookie.getName().equals("read_board" + boardnum)) {
							read_board = cookie;
							break;
						}
					}
				}
				// read_board가 null이라는 뜻은 위에서 쿠키를 찾았을 때 존재하지 않았다는 뜻
				// 첫 조회거나 조회한지 1시간이 지난 후
				if (read_board == null) {
					// 조회수 증가
					service.updateReadCount(boardnum);
					// read_board1 이름의 쿠키(유효기간 : 3600초)를 생성해서 클라이언트 컴퓨터에 저장
					Cookie cookie = new Cookie("read_board" + boardnum, "r");
					cookie.setMaxAge(3600);
					resp.addCookie(cookie);
				}
			}
		}
		String page = req.getParameter("page");
		if(page!=null) {
			model.addAttribute("page",Integer.parseInt(page));
		}
		return requestURI;
	}

	@PostMapping("mmodify")
	public String mmodify(MBoardDTO board, MultipartFile[] files, String updateCnt, Criteria cri, Model model) throws Exception {
		if(files != null){
			for (MultipartFile file : files) {
				System.out.println("controller1 : "+file.getOriginalFilename());
				System.out.println("files= "+files);
				System.out.println("board= "+board);
				System.out.println("updateCnt= "+updateCnt);
			}
		}
		System.out.println("controller2 : "+updateCnt);
		if(service.modify(board, files, updateCnt)) {
			return "redirect:/mboard/mget"+cri.getListLink()+"&boardnum="+board.getBoardnum();
		}
		else {
			return "redirect:/mboard/mlist"+cri.getListLink();
		}
	}
	
	@PostMapping("remove")
	public String remove(Long boardnum, Criteria cri, HttpServletRequest req) {
		HttpSession session = req.getSession();
		String loginUser = (String)session.getAttribute("loginUser");
		if(service.remove(loginUser, boardnum)) {
			return "redirect:/mboard/mlist"+cri.getListLink();
		}
		else {
			return "redirect:/mboard/mget"+cri.getListLink()+"&boardnum="+boardnum;
		}
	}

	@GetMapping("thumbnail")
	public ResponseEntity<Resource> thumbnail(String systemname) throws Exception {
		System.out.println("MBoard controller - thumbnail");
		return service.getThumbnailResource(systemname);
	}

	@GetMapping("file")
	public ResponseEntity<Object> download(String systemname, String orgname) throws Exception {
		return service.downloadFile(systemname, orgname);
	}
	
	@GetMapping("thum")
	public ResponseEntity<Resource> thum(Long boardnum) throws Exception {
		return service.getThumbnail(boardnum);
	}
	
	
	private final List<FileDTO> fileList = new ArrayList<>();
	@GetMapping("/allList/{pageNum}")
	public ResponseEntity<List<FileDTO>> getAllBoards(
			@PathVariable("pageNum") int pageNum
	){
		this.fileList.clear();
		Criteria cri = new Criteria();
		
		if(pageNum>1) pageNum = (pageNum-1)*9;
		else pageNum-=1;

		cri.setStartrow(pageNum);
		cri.setAmount(9);
		List<MBoardDTO> mList = service.getBoardMlist(cri);
		mList.addAll(service.getBoardRlist(cri));
		
		mList.forEach(board -> {
			this.fileList.add(service.getFileList(board.getBoardnum()).get(0));
		});
		cri = null;
		mList = null;
		if(fileList==null||fileList.size()==0) {
			return ResponseEntity.badRequest().body(null);
		}else {
			return ResponseEntity.ok(fileList);
		}
	}

}













