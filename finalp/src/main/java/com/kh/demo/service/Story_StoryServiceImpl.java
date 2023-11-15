package com.kh.demo.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.Story_FileDTO;
import com.kh.demo.domain.dto.Story_StoryBox;
import com.kh.demo.domain.dto.Story_StoryDTO;
import com.kh.demo.domain.dto.Story_StoryWriteDTO;
import com.kh.demo.mapper.StoryLikeMapper;
import com.kh.demo.mapper.Story_FileMapper;
import com.kh.demo.mapper.Story_FollowMapper;
import com.kh.demo.mapper.Story_ReplyMapper;
import com.kh.demo.mapper.Story_StoryMapper;

@Service
@Qualifier("StoryServiceImpl")
public class Story_StoryServiceImpl implements Story_StoryService {
	@Autowired
	private Story_StoryMapper smapper;
	@Autowired
	private Story_FileMapper fmapper;
	@Autowired
	private Story_ReplyMapper rmapper;
	@Value("${file.dir}")
	private String saveFolder;
	
	@Autowired
	private Story_FollowMapper followMapper;
	@Autowired
	private StoryLikeMapper slikeMapper;
	
	private final List<Story_StoryBox> allStory = new ArrayList<>();
	
	
	@Override
	public int uploadStory(Story_StoryWriteDTO swDTO, MultipartFile[] files){
		int row = smapper.story_insertStory(swDTO);
		if(row != 1) return -1;
		return smapper.story_getLastnum();
	}
	
	@Override
	public ResponseEntity<Resource> getThumbnailResource(String systemName) throws Exception{
		//경로에 관련된 객체(자원으로 가지고 와야 하는 파일에 대한 경로)
		Path path = Paths.get(saveFolder+systemName);
		//경로에 있는 파일의 MIME타입을 조사해서 그대로 담기
		String contentType = Files.probeContentType(path);
		//응답 헤더 생성
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_TYPE, contentType);
		
		//해당 경로(path)에 있는 파일에서부터 뻗어나오는 InputStream(Files.newInputStream)을 통해 자원화(InputStreamResource)
		Resource resource = new InputStreamResource(Files.newInputStream(path));
		return new ResponseEntity<>(resource,headers,HttpStatus.OK);
	}
	
	
	@Override
	public boolean modify(int storynum, Story_StoryWriteDTO swDTO){
		int row = smapper.story_updateStory(storynum, swDTO);
		return row == 1;
	}
	
	@Override
	public boolean remove(int storyNum) {
		List<Story_FileDTO> files = fmapper.story_getFilesByStorynum(storyNum);
		for(Story_FileDTO fdto : files) {
			File file = new File(saveFolder,fdto.getSystemName());
			System.out.println("삭제 파일 경로: "+file.getPath());
			if(file.exists()) file.delete();
			file = null;
		}
		return smapper.story_remomveStory(storyNum)==1;
	}
	
	@Override
	public Story_StoryDTO getStory(int storynum) {
		return smapper.story_getStory(storynum).get(0);
	}
	
	@Override
	public List<Story_StoryBox> getStories(int startNum, int endNum, String keyword, String category, String loginUser) {
		this.allStory.clear();
		
		List<Story_StoryDTO> onlyStories = smapper.story_getStories(startNum, endNum, keyword, category);

		final LocalDateTime now = LocalDateTime.now();
		
		onlyStories.stream().forEach(story -> {
			Story_StoryBox temp = Story_StoryBox.builder()
					.story(story)
					.files(fmapper.story_getFilesByStorynum(story.getStoryNum()))
					.replies(rmapper.story_getRepliesByStorynum(story.getStoryNum()))
					.forTime(calculatorDate(now, story.getStoryDate()))
					.followCheck(followMapper.whoLoginUserFollowed(loginUser, story.getStoryWriter()).size()>0)
					.likeCheck(slikeMapper.likeFind(loginUser, story.getStoryNum()).size()>0)
					.build();
			this.allStory.add(temp);
		});
		
		return this.allStory;
	}
	
	private String calculatorDate(LocalDateTime now, Timestamp storyTimestamp) {
		LocalDateTime storyDateTime = storyTimestamp.toLocalDateTime();

        long temp = ChronoUnit.SECONDS.between(storyDateTime, now);
        
        if (temp < 60) return "방금전";
        else if (temp<(60*60)) return (temp/60)+"분 전";
        else if (temp<(60*60*24)) return (temp/(60*60))+"시간 전";
        else {
        	int day = now.getDayOfYear()-storyDateTime.getDayOfYear();
        	
            if(day<31) return day+"일 전";
            else{
            	if(day<365) return (day/30)+"달 전";
            	else return (day/365)+"년 전";
            }
        }
    }
	
	@Override
	public boolean clickFollow(String storyWriter, String whom) {
		boolean isUserInFollowing =
				followMapper.isStoryWriterInFollowing(storyWriter, whom).size()>0;
		boolean isUserInFollower =
				followMapper.isStoryWriterInFollower(storyWriter, whom).size()>0;
		boolean following = false;
		boolean whomGetsAFollower = false;
		
		System.out.println("유저 있는지: "+isUserInFollowing);
		
		if(isUserInFollowing&&isUserInFollower) {
			following = followMapper.followingWhenExisting(storyWriter, whom)==1;
			whomGetsAFollower = followMapper.addFollowerWhenExisting(whom, storyWriter)==1;
		}else {
			following = followMapper.followingWhenNotExisting(storyWriter, whom)==1;
			whomGetsAFollower = followMapper.addFollowerWhenNotExisting(whom, storyWriter)==1;
		}
		
		return following&&whomGetsAFollower;
	}
	
	@Override
	public boolean cancelFollow(String storyWriter) {
		boolean cancelFollowing = followMapper.cancelFollowing(storyWriter)==1;
		boolean removeFollwerOfWhom = followMapper.removeFollower(storyWriter)==1;
		
		
		System.out.println("storyWriter: "+storyWriter);
		System.out.println(cancelFollowing+", "+removeFollwerOfWhom);
		return cancelFollowing&&removeFollwerOfWhom;
	}

	@Override
	public boolean clickLike(String userid, int storyNum) {
		boolean clickCheck = slikeMapper.insert(userid,storyNum)==1;
		boolean updateLike = smapper.likeUp(storyNum)==1;
		return clickCheck&&updateLike;
	}

	@Override
	public boolean cancelLike(String userid, int storyNum) {
		boolean cancelLike=slikeMapper.remove(userid,storyNum)==1;
		boolean updateLike1 = smapper.likeDown(storyNum)==1;
		return cancelLike&&updateLike1;
	}

	@Override
	public List<Object> getLikeList(int storyNum) {
		return slikeMapper.likeList(storyNum);
	}
}









