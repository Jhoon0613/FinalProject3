package com.kh.demo.service;


import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kh.demo.domain.dto.MBoardDTO;
import com.kh.demo.domain.dto.Criteria;
import com.kh.demo.domain.dto.FileDTO;
import com.kh.demo.domain.dto.UserDTO;
import com.kh.demo.domain.dto.UserFileDTO;
import com.kh.demo.mapper.UserFileMapper;
import com.kh.demo.mapper.UserMapper;



@Service
public class UserServiceImpl implements UserService{
	@Autowired
	private UserMapper umapper;
	@Autowired
	private UserFileMapper ufmapper;
	@Value("${file.dir}")
	private String saveFolder;

	@Override
	public boolean checkId(String userid) {
		return umapper.findById(userid) == null;
	}
	@Override
	public boolean ncheckId(String usernickname) {
		return umapper.findByNId(usernickname) == null;
	}
	@Override
	public boolean join(UserDTO user) {
		return umapper.insertUser(user) == 1;
	}
	
	@Override
	public boolean pwmodify(UserDTO user) {
		return umapper.updateUserPw(user) == 1;
	}
	
	@Override
	public boolean pwck(UserDTO user) {
		return umapper.findByPw(user) == null;
	}

	@Override
	public UserDTO login(String userid, String userpw) {
		UserDTO user = umapper.findById(userid);
		if(user != null) {
			if(user.getUserpw().equals(userpw)) {
				return user;
			}
		}
		return null;
	}
	@Override
	public boolean loginview(UserDTO user) {
		return false;
	}
	@Override
	public String mypage(String loginUser,UserDTO user) {
		return umapper.getUserList(user);
	}
	
	@Override
	public List<UserDTO> getUserList(UserDTO user) {
		return null;
	}

	@Override
	public UserDTO getDetail(String userid) {
		return umapper.findById(userid);
	}
	
	@Override
	public UserDTO checkUser(String userid, String checkPassword) {
		List<UserDTO> list = umapper.checkUser(userid, checkPassword);
		System.out.println(list);
		
		UserDTO u = list.size() == 0?null:list.get(0);
		System.out.println("getUser: "+u);
		return u;
	}
	
	
	@Override
	public boolean remove(String loginUser, String userid) {
		UserDTO user = umapper.findById(userid);
		if(user != null && user.getUserid().equals(loginUser)) {
			
			return umapper.deleteUser(userid) == 1;
			}
		 
		return false;
	}
	@Override
	public boolean remove(String userid) {
		UserDTO user = umapper.findById(userid);
		if(user != null) {
			
			return umapper.deleteUser(userid) == 1;
			}
		 
		return false;
	}
	
	@Override
	public Long getTotal(Criteria cri) {
		return umapper.getTotal(cri);
	}
	@Override
	public List<UserDTO> getLikepetlist(Criteria cri) {
		return null;
	}
	@Override
	public boolean join(UserDTO user, MultipartFile[] files) {
		return umapper.insertUser(user) == 1;
	}
	
	@Override
	public boolean regist(UserDTO user, MultipartFile[] files) throws Exception {
		int row = umapper.insertUser(user);
		if(row != 1) {
			return false;
		}
		if(files == null || files.length == 0) {
			return true;
		}
		else {
			//방금 등록한 게시글 번호
			Long useridx = umapper.getLastNum(user.getUserid());
			boolean flag = false;
			for(int i=0;i<files.length-1;i++) {
				MultipartFile file = files[i];
				//apple.png
				String orgname = file.getOriginalFilename();
				System.out.println(orgname);
				//5
				int lastIdx = orgname.lastIndexOf(".");
				System.out.println(lastIdx);
				//.png
				String extension = orgname.substring(lastIdx);
				
				LocalDateTime now = LocalDateTime.now();
				String time = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

				//20231005103911237랜덤문자열.png
				String systemname = time+UUID.randomUUID().toString()+extension;
				System.out.println(systemname);

				//실제 저장될 파일의 경로
				String path = saveFolder+systemname;
				
				UserFileDTO ufdto = new UserFileDTO();
				System.out.println(ufdto);
				ufdto.setUseridx(useridx);
				System.out.println(useridx);
				ufdto.setSystemname(systemname);
				System.out.println(systemname);
				ufdto.setOrgname(orgname);
				System.out.println(orgname);
				
				//실제 파일 업로드
				file.transferTo(new File(path));
				
				flag = ufmapper.insertFile(ufdto) == 1;
				System.out.println(ufdto);
				
				if(!flag) {
					//업로드 했던 파일 삭제, 게시글 데이터 삭제
					return flag;
				}
			}
		}
		return true;
	}
	@Override
	public boolean modify(UserDTO user, MultipartFile[] files) throws Exception {
		int row = umapper.updateUser(user);
		if(row != 1) {
			System.out.println(row);
			return false;
		}
			if(files == null || files.length == 0) {
				return true;
			}
			List<UserFileDTO> org_file_list = ufmapper.getFiles(user.getUseridx());
			if(org_file_list.size()==0 && (files == null || files.length == 0)) {
				return true;
			}
			else {
				if(files != null) {
					boolean flag = false;
					//후에 비즈니스 로직 실패 시 원래대로 복구하기 위해 업로드 성공했던 파일들도 삭제해주어야 한다.
					//업로드 성공한 파일들의 이름을 해당 리스트에 추가하면서 로직을 진행한다.
					ArrayList<String> sysnames = new ArrayList<>();
					System.out.println("service : "+files.length);
					for(int i=0;i<files.length-1;i++) {
						MultipartFile file = files[i];
						String orgname = file.getOriginalFilename();
						//수정의 경우 중간에 있는 파일은 수정이 되지 않은 경우도 있다.
						//그런 경우의 file의 orgname은 null 이거나 "" 이다.
						//따라서 업로드가 될 필요가 없으므로 continue로 다음 파일로 넘어간다.
						if(orgname == null || orgname.equals("")) {
							continue;
						}
						int lastIdx = orgname.lastIndexOf(".");
						String extension = orgname.substring(lastIdx);
						LocalDateTime now = LocalDateTime.now();
						String time = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
						String systemname = time+UUID.randomUUID().toString()+extension;
						sysnames.add(systemname);
						
						String path = saveFolder+systemname;
						
						UserFileDTO ufdto = new UserFileDTO();
						ufdto.setUseridx(user.getUseridx());
						System.out.println(user);
						ufdto.setOrgname(orgname);
						ufdto.setSystemname(systemname);
						
						file.transferTo(new File(path));
						
						flag = ufmapper.insertnewFile(ufdto) == 1;
						System.out.println("flag: "+flag);
						if(!flag) {
							break;
						}
					}
					//강제탈출(실패)
					if(!flag) {
						//아까 추가했던 systemname들(업로드 성공한 파일의 systemname)을 꺼내오면서
						//실제 파일이 존재한다면 삭제 진행
						for(String systemname : sysnames) {
							File file = new File(saveFolder,systemname);
							if(file.exists()) {
								file.delete();
							}
							ufmapper.deleteBySystemname(systemname);
						}
						
					}
				}
			}
			return true;
				}
		


	
	@Override
	public ResponseEntity<Resource> getThumbnailResource(String systemname) throws Exception{
		//경로에 관련된 객체(자원으로 가지고 와야 하는 파일에 대한 경로)
		Path path = Paths.get(saveFolder+systemname);
		System.out.println(path);
		//경로에 있는 파일의 MIME타입을 조사해서 그대로 담기
		String contentType = Files.probeContentType(path);
		System.out.println(contentType);
		//응답 헤더 생성
		HttpHeaders headers = new HttpHeaders();
		System.out.println(headers);
		headers.add(HttpHeaders.CONTENT_TYPE, contentType);
		
		//해당 경로(path)에 있는 파일에서부터 뻗어나오는 InputStream(Files.newInputStream)을 통해 자원화(InputStreamResource)
		Resource resource = new InputStreamResource(Files.newInputStream(path));
		System.out.println(resource);
		
		return new ResponseEntity<>(resource,headers,HttpStatus.OK);
		
	}
	
	@Override
	public ResponseEntity<Resource> getThumbnail(Long useridx) throws Exception {
	    System.out.println("useridx: " + useridx);
	    List<UserFileDTO> userFiles = ufmapper.findByUseridx(useridx);

	    if (userFiles != null && !userFiles.isEmpty()) {
			int lastIndex = userFiles.size() - 1;
			String systemname = userFiles.get(lastIndex).getSystemname();
	        Path path = Paths.get(saveFolder + systemname);
	        String contentType = Files.probeContentType(path);
	        HttpHeaders headers = new HttpHeaders();
	        headers.add(HttpHeaders.CONTENT_TYPE, contentType);
	        Resource resource = new InputStreamResource(Files.newInputStream(path));

	        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
	    } else {
	        // 처리할 내용이 없는 경우에 대한 로직 추가
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}


	@Override
	public ResponseEntity<Object> downloadFile(String systemname, String orgname) throws Exception{
		//경로에 관련된 객체(자원으로 가지고 와야 하는 파일에 대한 경로)
		Path path = Paths.get(saveFolder+systemname);
		//해당 경로(path)에 있는 파일에서부터 뻗어나오는 InputStream(Files.newInputStream)을 통해 자원화(InputStreamResource)
		Resource resource = new InputStreamResource(Files.newInputStream(path));
		
		File file = new File(saveFolder,systemname);
		
		HttpHeaders headers = new HttpHeaders();
		String dwName = "";
		
		try {
			dwName = URLEncoder.encode(orgname,"UTF-8").replaceAll("\\+","%20");
		} catch (UnsupportedEncodingException e) {
			dwName = URLEncoder.encode(file.getName(),"UTF-8").replaceAll("\\+","%20");
		}
		
		headers.setContentDisposition(ContentDisposition.builder("attachment").filename(dwName).build());
		return new ResponseEntity<Object>(resource,headers,HttpStatus.OK);
	}
	@Override
	public Long getLastNum(String userid) {
		return umapper.getLastNum(userid);
	}
	@Override
	public List<UserFileDTO> getFileList(Long useridx) {
		return ufmapper.getFiles(useridx);
	}
	@Override
	public List<UserDTO> getUserNum(Long useridx) {
		return umapper.getUserNum(useridx);
	}

	@Override
	public boolean modify(UserDTO user, MultipartFile[] files, String updateCnt) throws Exception {
		return false;
	}


}










