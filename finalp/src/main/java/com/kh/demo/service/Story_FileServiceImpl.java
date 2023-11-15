package com.kh.demo.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.Story_FileDTO;
import com.kh.demo.mapper.Story_FileMapper;

@Service
@Qualifier("FileServiceImpl")
public class Story_FileServiceImpl implements Story_FileService{
	@Autowired
	private Story_FileMapper fmapper;
	@Value("${file.dir}")
	private String saveFolder;
	
	
	
	@Override
	public boolean removeFileByStorynum(int storyNum) {
		return fmapper.story_removeFileByStorynum(storyNum)>=0;
	}
	
	@Override
	public List<Story_FileDTO> getFilesByStorynum(int storyNum) {
		return fmapper.story_getFilesByStorynum(storyNum);
	}
	
	@Override
	public boolean uploadFile(int storyNum, MultipartFile[] files) throws IllegalStateException, IOException {
		if(files == null || files.length == 0) return false;
		else {
			//방금 등록한 게시글 번호
			boolean flag = false;
			for(int i=0;i<files.length;i++) {
				MultipartFile file = files[i];
				//apple.png
				String orgName = file.getOriginalFilename();
				//5
				int lastIdx = orgName.lastIndexOf(".");
				//.png
				String extension = orgName.substring(lastIdx);
				
				LocalDateTime now = LocalDateTime.now();
				String time = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

				//20231005103911237랜덤문자열.png
				String systemName = time+UUID.randomUUID().toString()+extension;

				//실제 저장될 파일의 경로
				String path = saveFolder+systemName;
				System.out.println("파일 경로: "+path);
				
				Story_FileDTO fdto = Story_FileDTO.builder()
						.storyNum(storyNum)
						.systemName(systemName)
						.orgName(orgName)
						.build();
				
				//실제 파일 업로드
				file.transferTo(new File(path));
				
				flag = fmapper.story_insertFile(fdto) == 1;
				if(!flag) {
					//업로드 했던 파일 삭제, 게시글 데이터 삭제
					return false;
				}
			}
		}
		System.out.println("파일 업로드");
		return true;
	}
	
	@Override
	public boolean reomveFileModifying(int storyNum, String[] orgFilesNames) {
		List<Story_FileDTO> orgFiles = fmapper.story_getFilesByStorynum(storyNum);
		
		for(String orgName : orgFilesNames) {
			orgFiles.removeIf(name -> Objects.equals(name.getOrgName(), orgName));
		}
		
		for(Story_FileDTO fileToRemove : orgFiles) {
			File file = new File(saveFolder,fileToRemove.getSystemName());
			if(file.exists()) file.delete();
			file = null;
			
			fmapper.story_removeFileBySystemname(fileToRemove.getSystemName());
		}
		return true;
	}
}













