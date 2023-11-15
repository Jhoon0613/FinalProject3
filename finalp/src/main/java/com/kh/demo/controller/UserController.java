package com.kh.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.MBoardDTO;
import com.kh.demo.domain.dto.PageDTO;
import com.kh.demo.domain.dto.UserDTO;
import com.kh.demo.domain.dto.UserFileDTO;
import com.kh.demo.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/user/*")
public class UserController {
	@Autowired
	private UserService service;
//	GET
//	/user/login		로그인 페이지로 이동					
//	/user/join		회원가입 페이지로 이동
//	/user/checkid	넘겨진 파라미터로 아이디 중복 체크
//	/user/logout	로그아웃 처리
//	
//	POST
//	/user/login		넘겨진 파라미터로 로그인 처리
//	/user/join		넘겨진 데이터들로 회원가입 처리

	@GetMapping("smssend")
	public void replace1() {
	}

	@PostMapping("smssend")
	public String smssend(UserDTO user, RedirectAttributes ra) {
		if (service.join(user)) {
			ra.addAttribute("joinid", user.getUserid());
		}
		return "redirect:/";
	}

	@GetMapping("loginview")
	public void replacelogin() {
	}

	@PostMapping("loginview")
	public String loginview(UserDTO user, RedirectAttributes ra) {
		if (service.loginview(user)) {
			ra.addAttribute("loginid", user.getUserid());
		}
		return "redirect:/";
	}

	@GetMapping("join")
	public void replace() {
	}

	@PostMapping("join")
	public String join(UserDTO user, RedirectAttributes ra, MultipartFile[] files) throws Exception {
		Long useridx = 0L;
		/*
		 * if(service.join(user)) { ra.addAttribute("joinid",user.getUserid());
		 */
		if (service.regist(user, files)) {
			useridx = service.getLastNum(user.getUserid());
			return "redirect:/user/loginview";
		}

//		}
		return "redirect:/user/loginview";
	}

	@PostMapping("login")
	public String login(String userid, String userpw, HttpServletRequest req) {
		UserDTO loginUser = service.login(userid, userpw);
		if (loginUser != null) {
			req.getSession().setAttribute("loginUser", loginUser.getUserid());
			return "redirect:/";
		}

		else {
			return "redirect:/user/loginview";
		}
	}

	@GetMapping("mypage")
	public String myPage(HttpServletRequest req, Model model, UserDTO user, Long useridx) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
		System.out.println(user1);
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		UserFileDTO ufdto = new UserFileDTO();
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		System.out.println(list);
		System.out.println("----------"+ulist);
		if (loginUser != null) {
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("list", list);
			model.addAttribute("useridx", user1.getUseridx());
			model.addAttribute("username", user1.getUsername());
			model.addAttribute("addr", user1.getAddr());
			model.addAttribute("addrdetail", user1.getAddrdetail());
			model.addAttribute("usernickname", user1.getUsernickname());
			model.addAttribute("phonenum", user1.getPhonenum());
			model.addAttribute("files", service.getFileList(useridx));
			return "user/mypage";
		} else {
			return "redirect:/user/login";
		}
	}

	@GetMapping("modify")
	public String modify(HttpServletRequest req, Model model, UserDTO user, Long useridx) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		System.out.println(user1);
		List<UserFileDTO> file = service.getFileList(useridx);
		System.out.println(useridx);
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		if (loginUser != null) {
			model.addAttribute("file", file);
			model.addAttribute("list", list);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("useridx", user1.getUseridx());
			model.addAttribute("username", user1.getUsername());
			model.addAttribute("zipcode", user1.getZipcode());
			model.addAttribute("addr", user1.getAddr());
			model.addAttribute("addrdetail", user1.getAddrdetail());
			model.addAttribute("usernickname", user1.getUsernickname());
			model.addAttribute("phonenum", user1.getPhonenum());
			return "user/modify";
		} else {
			return "redirect:/user/login";
		}
	}

	@PostMapping("modify")
	public String modify(UserDTO user, RedirectAttributes ra, MultipartFile[] files) throws Exception {
		Long useridx = 0L;
		System.out.println("파일: "+files);
		if (service.modify(user, files)) {
			useridx = service.getLastNum(user.getUserid());
			return "redirect:/user/mypage";
		}
		return "redirect:/user/mypage";
	}
	

	@PostMapping("/pwck2/{userid}/{checkPassword}")
	public ResponseEntity<String> pwck(@PathVariable("userid") String userid,
			@PathVariable("checkPassword") String checkPassword) {
		UserDTO user = service.checkUser(userid, checkPassword);
		if (user != null) {
			return ResponseEntity.ok("o");
		} else {
			return ResponseEntity.ok("x");
		}
	}

	@GetMapping("pwck")
	public String pwck(HttpServletRequest req, Model model, UserDTO user, RedirectAttributes ra) {

		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		if (user != null) {
			model.addAttribute("list", list);
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("userid", user1.getUserid());
			model.addAttribute("userpw", user1.getUserpw());
			model.addAttribute("username", user1.getUsername());
			return "/user/pwck";
		} else {
			return "/user/pwck";
		}

//		if(service.pwck(user)) {
//			ra.addAttribute("pwcks",user.getUserpw());
//		}
//		return "/user/pwck";
	}

	@PostMapping("/rmpwck2/{userid}/{checkPassword}")
	public ResponseEntity<String> rmpwck(@PathVariable("userid") String userid,
			@PathVariable("checkPassword") String checkPassword) {
		UserDTO user = service.checkUser(userid, checkPassword);
		if (user != null) {
			return ResponseEntity.ok("o");
		} else {
			return ResponseEntity.ok("x");
		}
	}

	@GetMapping("rmpwck")
	public String rmpwck(HttpServletRequest req, Model model, UserDTO user, RedirectAttributes ra) {

		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		if (user != null) {
			model.addAttribute("list", list);
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("userid", user1.getUserid());
			model.addAttribute("userpw", user1.getUserpw());
			model.addAttribute("username", user1.getUsername());
			return "/user/rmpwck";
		} else {
			return "/user/rmpwck";
		}
	}

	@GetMapping("pwmodify")
	public String pwmodify(HttpServletRequest req, Model model, UserDTO user) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		if (loginUser != null) {
			model.addAttribute("list", list);
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("userid", user1.getUserid());
			model.addAttribute("userpw", user1.getUserpw());
			model.addAttribute("username", user1.getUsername());
			return "user/pwmodify";
		} else {
			return "redirect:/user/login";
		}
	}

	@PostMapping("pwmodify")
	public String pwmodify(UserDTO user, RedirectAttributes ra) {
		if (service.pwmodify(user)) {
			ra.addAttribute("pwmodifys", user.getUserid());
		}
		return "redirect:/user/mypage";
	}

	@GetMapping("remove")
	public String remove(HttpServletRequest req, Model model, UserDTO user) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		if (loginUser != null) {
			model.addAttribute("list", list);
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("userid", user1.getUserid());
			model.addAttribute("userpw", user1.getUserpw());
			model.addAttribute("username", user1.getUsername());
			return "user/remove";
		} else {
			return "redirect:/user/login";
		}
	}

	@PostMapping("remove")
	public String remove(String userid, HttpServletRequest req) {
		HttpSession session = req.getSession();
		if (service.remove(userid)) {
			session.invalidate();
			return "redirect:/";
		} else {
			return "redirect:/";
		}
	}

	@GetMapping("favoritepet")
	public String favoritpet(HttpServletRequest req, Model model, UserDTO user, Criteria cri) throws Exception {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		if (loginUser != null) {
			model.addAttribute("list", list);
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("username", user1.getUsername());
			model.addAttribute("usernickname", user1.getUsernickname());
			model.addAttribute("pageMaker", new PageDTO(service.getTotal(cri), cri));
			return "user/favoritepet";
		} else {
			return "redirect:/user/login";
		}
	}

	@GetMapping("mycontents")
	public String mycontents(HttpServletRequest req, Model model, UserDTO user, Criteria cri) throws Exception {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
	MBoardDTO board = new MBoardDTO();
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		if (loginUser != null) {
			String num = req.getParameter("boardnum");
			Long boardnum = num!=null?(
					num.matches("[0-9]*")?Long.parseLong(num):0):1;

			String param = req.getParameter("page");
			int page = num!=null?(
					num.matches("[0-9]*")?Integer.parseInt(param):0):1;
			model.addAttribute("total", service.getTotal(cri));
			System.out.println("total: "+service.getTotal(cri));
			model.addAttribute("boardnum", boardnum);
			model.addAttribute("page", page);
			model.addAttribute("list", list);
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("username", user1.getUsername());
			model.addAttribute("usernickname", user1.getUsernickname());
			model.addAttribute("pageMaker", new PageDTO(service.getTotal(cri), cri));
			if (loginUser == board.getUserid()) {
				model.addAttribute("mycontents", board.getUserid());
			}
			return "user/mycontents";
		} else {
			return "redirect:/user/login";
		}
	}

	@GetMapping("logout")
	public String logout(HttpServletRequest req) {
		req.getSession().invalidate();
		return "redirect:/";
	}

	@GetMapping("checkid")
	@ResponseBody
	public String checkId(String userid) {
		if (service.checkId(userid)) {
			return "O";
		}
		return "X";
	}

	@GetMapping("ncheckid")
	@ResponseBody
	public String ncheckId(String usernickname) {
		if (service.ncheckId(usernickname)) {
			return "O";
		}
		return "X";
	}

	@GetMapping("thumbnail")
	public ResponseEntity<Resource> thumbnail(String systemname) throws Exception {
		return service.getThumbnailResource(systemname);
	}

	@GetMapping("thum")
	public ResponseEntity<Resource> thum(Long useridx) throws Exception {
		System.out.println("user controller - thumb");
		System.out.println(useridx);
		return service.getThumbnail(useridx);
	}

	@GetMapping("file")
	public ResponseEntity<Object> download(String systemname, String orgname) throws Exception {
		return service.downloadFile(systemname, orgname);
	}
	
	@GetMapping("myInterestStory")
	public String myInterestStory(HttpServletRequest req, Model model, UserDTO user, Criteria cri) throws Exception {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserDTO user1 = service.getDetail(loginUser);
		List<UserDTO> list = service.getUserNum(user1.getUseridx());
		UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
		List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
		if (loginUser != null) {
			model.addAttribute("list", list);
			model.addAttribute("loginUser", loginUser);
			model.addAttribute("proimage", ulist.get(0));
			model.addAttribute("username", user1.getUsername());
			model.addAttribute("usernickname", user1.getUsernickname());
			model.addAttribute("pageMaker", new PageDTO(service.getTotal(cri), cri));
			return "user/myInterestStory";
		} else {
			return "redirect:/user/login";
		}
	}

	
}
