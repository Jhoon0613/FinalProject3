package com.kh.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.MBoardDTO;
import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.FileDTO;

public interface MBoardService {
	//insert
	boolean regist(MBoardDTO board, MultipartFile[] files) throws Exception;

	//update
	public boolean modify(MBoardDTO board, MultipartFile[] files, String updateCnt) throws Exception;
	public void updateReadCount(Long boardnum);

	//delete
	public boolean remove(String loginUser, Long boardnum);

	//select
	Long getMTotal(Criteria cri);
	Long getRTotal(Criteria cri);
	List<MBoardDTO> getBoardMlist(Criteria cri);
	List<MBoardDTO> getBoardRlist(Criteria cri);
	MBoardDTO getDetail(Long boardnum);
	Long getLastNum(String userid);
	ArrayList<Integer> getReplyCnt(Long boardnum);
	List<FileDTO> getFileList(Long boardnum);

	ResponseEntity<Resource> getThumbnailResource(String systemname) throws Exception;

	ResponseEntity<Object> downloadFile(String systemname, String orgname) throws Exception;
	
	ResponseEntity<Resource> getThumbnail(Long boardnum) throws Exception;


}





