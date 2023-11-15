package com.kh.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.kh.demo.domain.dto.UserDTO;
import com.kh.demo.domain.dto.UserFileDTO;
import com.kh.demo.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class HomeController {
	@Autowired
	private UserService service;
	
	@RequestMapping("/")
	public String home(HttpServletRequest req, Model model, UserDTO user, Long useridx) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		if (loginUser != null) {
			UserDTO user1 = service.getDetail(loginUser);
			List<UserDTO> list = service.getUserNum(user1.getUseridx());
			UserFileDTO d = service.getFileList(list.get(list.size()-1).getUseridx()).get(0);
			List<UserFileDTO> ulist = service.getFileList(d.getUseridx());
			req.getSession().setAttribute("proimage", ulist.get(0));
			model.addAttribute("proimage", ulist.get(0));
			System.out.println("img" + ulist.get(0));
			return "index";
		} else {
			return "index";
		}
	
	}
}
