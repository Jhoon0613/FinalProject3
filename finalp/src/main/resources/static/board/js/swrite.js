const fileContainer = document.querySelector("#fileContainer");
const thumbnails = document.querySelector(".s_thumbnail");

//파일 input태그 만들기
const createFileInput = fileNum => {
	let newInput = document.createElement("input");
	newInput.type = "file";
	newInput.name = "files";
	newInput.id = "file"+fileNum;
	newInput.style.display = "none";
	return newInput;
}

//파일 input태그 복사 후 클래스, 타입 등 설정
const fileTagControl = (fileContainer, fileCon, filenum)=>{
	let copied = fileCon.cloneNode(true);
	copied.classList.remove(copied.classList[1]);
	copied.classList.add("fileCon"+(filenum+1));
	copied.children[0].innerHTML = "선택된 파일 없음";
	copied.children[1].setAttribute("href", 
		"javascript:upload("+(filenum+1)+")");
	copied.children[2].setAttribute("href", 
		"javascript:removeFile("+(filenum+1)+")");
	copied.removeChild(copied.children[3]);
		
	fileContainer.appendChild(copied);
};

const showThumb = (filenum, file) => {
	const reader = new FileReader();
	
	reader.onload = function(ie){
		let getImg = document.querySelector(".thumbnail"+filenum);
		
		if(getImg){ //썸네일에 이미 선택된 파일의 사진이 있다면
			getImg.setAttribute("src",ie.target.result);
			thumbnails.appendChild(getImg);
		}else{
			const img = document.createElement("img");
			img.setAttribute("src",ie.target.result);
			img.setAttribute("class","thumbnail"+filenum);
			thumbnails.appendChild(img);
		}
	}
	reader.readAsDataURL(file);
};

let lastFileCheck = true;
let temp = 0;
let thumbnailRemoveCheck = true;

//파일 업로드
const upload = filenum => {
	temp = filenum;
	let check = true;
	
	let findFileTag = document.querySelector("#file"+filenum);
	if(findFileTag){ //만약 파일 태그가 이미 있다면 그냥 클릭만
		findFileTag.click();
	}else{ //없으면 태그 만들고 클릭
		let fileCon = document.querySelector(".fileCon"+filenum);
		findFileTag = createFileInput(filenum);
		
		findFileTag.click();
		
		findFileTag.addEventListener("change", e => {
			let fileTag = e.target
			let file = fileTag.files[0];
			let fileName = null;
			
			//파일 태그 새로 만들고 거기에 뭔가 들어갈 경우, 혹은 빠질 경우
			if(file !== undefined){
				fileName = file.name;
				
				if(fileContainer.children.length<5){
					fileCon.appendChild(findFileTag);
					
					let ext = file.name.split(".").pop();
					if(ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'webp'){
						$("."+fileTag.id+"_cont .thumbnail").remove();
						
						
						/*let getImg = document.querySelector(".thumbnail"+filenum);
						//썸네일 칸에 사진 지워주기
						while(thumbnailRemoveCheck&&thumbnails.firstChild&&!getImg){
							thumbnails.removeChild(thumbnails.firstChild);
						}*/
						//단 한 번만 지워줄 수 있도록
						thumbnailRemoveCheck = false;
						
						showThumb(filenum, file);
						/*const reader = new FileReader();
						
						reader.onload = function(ie){
							let getImg = document.querySelector(".thumbnail"+filenum);
							
							if(getImg){ //썸네일에 이미 선택된 파일의 사진이 있다면
								getImg.setAttribute("src",ie.target.result);
								thumbnails.appendChild(getImg);
							}else{
								const img = document.createElement("img");
								img.setAttribute("src",ie.target.result);
								img.setAttribute("class","thumbnail"+filenum);
								thumbnails.appendChild(img);
							}
						}
						reader.readAsDataURL(file);*/
					}
				}
				//4개 파일 선택 후 파일 삭제, 혹은 선택 안함 시 사라지는데
				//그때 새로운 파일 선택창 만들어주기
				if(fileContainer.children.length<4&&check){
					fileTagControl(fileContainer, fileCon, filenum+temp);
					check = false;
				}
			}else{ //마찬가지
				fileName = "선택된 파일 없음";
				let getToRemove = document.querySelector(".s_file #file"+filenum).parentElement;
				fileContainer.removeChild(getToRemove);
				
				//만약 <div class="s_file fileCon0">가 세 개이면서
				//(세 개이면 선택이 된 태그 세 개에다가 선택할 수 있는 태그 하나 더 있어야함)
				//추가할 태그는 없을 때 lastFileCheck로 검사해서
				lastFileCheck = fileContainer.children.length==3&&
					[...document.querySelectorAll(".s_file")]
					.every(el => el.children.length==4);
				
				//만약 저게 참이라면 만들어주기
				if(lastFileCheck){
					fileTagControl(fileContainer, fileCon, filenum+temp);
					lastFileCheck = false;
				}
			}
			
			fileCon.children[0].innerHTML = fileName;
		});
	}
}

const removeFile = filenum => {
	let findFileToRemove = document.querySelector(".fileCon"+filenum);
	
	//파일 추가,삭제 칸이 하나 남았다면
	if(fileContainer.children.length==1||findFileToRemove.children.length<4){
		alert("삭제할 수 없습니다.");
	}else{
		fileContainer.removeChild(findFileToRemove);
		let getImg = document.querySelector(".thumbnail"+filenum); //파일에 대응하는 이미지
		
		thumbnails.removeChild(getImg);
		
		lastFileCheck = fileContainer.children.length==3&&
			[...document.querySelectorAll(".s_file")]
			.every(el => el.children.length==4);
		
		if(lastFileCheck){
			fileTagControl(fileContainer, fileContainer.children[0], filenum+temp);
			lastFileCheck = false;
		}
	}
};

//전송 전 검사
const beforeSend = () => {
	let getCon = document.querySelector("#storyContents");
	let getCate = document.querySelector("#board");
	let checkIfFile = document.querySelector("input");
	
	if(getCate.value === ""){
		alert("게시판을 선택해 주세요.");
		return false;
	}
	if(getCon.value === ""){
		alert("내용을 입력하세요.");
		return false;
	}
	if(checkIfFile === null){
		let orgname = document.querySelector("input[name='o']");
		console.log(orgname);
		alert("최소한 하나의 파일을 업로드 해주세요");
		return false;
	}
	
	return true;
};





