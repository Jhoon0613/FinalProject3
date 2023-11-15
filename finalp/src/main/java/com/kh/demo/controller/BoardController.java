package com.kh.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.kh.demo.domain.dto.UserFileDTO;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/board/*")
public class BoardController {
	
	@GetMapping("protect")
	public void replace(HttpServletRequest req, Model model) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
		if (loginUser != null) {
            model.addAttribute("proimage", proimage);
        }
	}

	@GetMapping("join")
	public void replace7(HttpServletRequest req, Model model) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
		if (loginUser != null) {
            model.addAttribute("proimage", proimage);
        }
	}
	
	@GetMapping("protect_in")
	public void replace1(HttpServletRequest req, Model model) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
		if (loginUser != null) {
            model.addAttribute("proimage", proimage);
        }
	}
	
	@GetMapping("shelter")
	public void replace2(HttpServletRequest req, Model model) {
		HttpSession session = req.getSession();
		String loginUser = (String) session.getAttribute("loginUser");
		UserFileDTO proimage = (UserFileDTO) session.getAttribute("proimage");
		if (loginUser != null) {
            model.addAttribute("proimage", proimage);
        }
	}
}
