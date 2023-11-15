package com.kh.demo.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.Story_FileDTO;

public interface Story_FileService {
	boolean removeFileByStorynum(int storynum);
	boolean reomveFileModifying(int storynum, String[] orgFilesNames);
	
	List<Story_FileDTO> getFilesByStorynum(int storynum);
	boolean uploadFile(int storynum, MultipartFile[] files) throws IllegalStateException, IOException;
}
