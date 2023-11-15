const events = () => {
	//글 수정삭제
	$(".dot").click(function(){
	    $(this).next().show();
	    $(this).hide();
	    $(this).next().css('display', 'flex');
	})
	$(".dot_sub").click(function(){
	    $(this).prev().show();
	    $(this).hide();
	})
	
	//팔로우 팔로잉
	$(".follow").click(function(){
	    $(this).next().show();
	    $(this).hide();
	})
	$(".follow1").click(function(){
	    $(this).prev().show();
	    $(this).hide();
	})
	
	//글내용 더보기,간략히
	$(".more").click(function(){
	    $(this).prevUntil("scontents1").show();
	    $(this).hide();
	    $(".scontents1").css('overflow', 'visible');
		$(".scontents1").css('display', 'block');
		$(".scontents1").css("white-space","normal");
	})
	$(".less").click(function(){
	    $(this).prev().hide();
	    $(this).next().show();
	    $(this).hide();
	    $(".scontents1").css("overflow","hidden");
	    $(".scontents1").css("height","auto");
	    $(".scontents1").css("white-space","nowrap");
	})
	    
	
	//댓글더보기,간략히
	$(".seeAll").click(function(){
	    $(this).prevUntil("replycnt").show();
	    $(this).hide();
	})
	$(".less1").click(function(){
	    $(this).prevUntil("replycnt").hide();
	    $(this).next().show();
	    $(this).hide();
	})
	
	//좋아요하트
	$(".like").click(function(){
	    $(this).next().show();
	    $(this).hide();
	})
	$(".like1").click(function(){
	    $(this).prev().show();
	    $(this).hide();
	})
	$(".like3").click(function(){
	    $(this).next().show();
	    $(this).hide();
	})
	$(".like4").click(function(){
	    $(this).prev().show();
	    $(this).hide();
	})
	
	//메시지아이콘 클릭시 댓글모두보기
	$(".msg").click(function(){
	    $(".replycnt1").show();
	    $(".seeAll").hide();
	    $(".less1").show();
	})
	
	//댓글 수정삭제버튼
		$(".uid3").click(function(){
	    $(this).next().show();
	    $(this).hide();
	})	
		$(".uid4").click(function(){
	    $(this).prev().show();
	    $(this).hide();
	})
	
	//좋아요 리스
		$(".deleteimg").click(function(){
	    $(".likebox").hide();
	    $('body').css({ overflow: 'visible' });
	})
	$(".storylike").click(function(){
	    $(".likebox").show();
	    $('body').css({ overflow: 'hidden' });
	})
	  
};

	

const stories = document.querySelector(".s_title");
const storyToCopy = document.querySelector("#storyform");

const replyDTO = {};
const getReplyDTO = (id, con, num) => {
	//변경, 매번 객체 생성하기 때문에
	replyDTO.storyReplyWriter = id;
	replyDTO.storyReplyContents = con;
	replyDTO.storyNum = num;
};

const copyStoryForm = obj => {
	let storyForms = [];
	
	for(let i=0;i<obj.length;i++){
		const storyForm =
			document.querySelector("#storyform").cloneNode(true);
		storyForm.classList.add("story"+obj[i].story.storyNum);
		storyForm.removeAttribute('id');
		
		storyForms[i] = storyForm;
		stories.appendChild(storyForm);
	}
	
	return storyForms; //나중에 display none 전부 해제
};

const forSearch = {
	startNum: 0,
	endNum : 1000,
	keyword: "",
	category: "adoptReview"
};

const modifyReply = (replymodifyBtn, contentsTag, replynum) => {
	replymodifyBtn.addEventListener("click", e => {
		e.preventDefault();
		let temp = contentsTag.innerText;
		
		let modifyinput = document.createElement("input");
		modifyinput.className = "replyModifyInput";
		modifyinput.placeholder = "수정할 댓글..."
		modifyinput.style.border = "none";
		
		contentsTag.innerText = "";
		contentsTag.appendChild(modifyinput);
		modifyinput.focus(); //태그 만들고 마우스 클릭 없이
		//바로 값 넣을 수 있도록
		
		modifyinput.addEventListener("keydown", e => {
			if(e.keyCode === 13){
				//ajax통신, 댓글 수정
				modifyreply(replynum, modifyinput.value, result => {
					contentsTag.innerText = result;
				});
				
			}
			if(e.keyCode === 27){
				contentsTag.innerText = temp;
			}
		});
	});
};

const removeReply = (removeBtn, replynum, replyCount) => {
	removeBtn.addEventListener("click", e => {
		e.preventDefault();
		//ajax통신, 댓글 삭제
		//삭제할 tr태그, 그리고 replynum
		//댓글 개수 -1
		removereply(replynum, result => {
			let toRemove = document.querySelector("tr.reply"+replynum);
			toRemove.children[1].innerHTML = result;
			toRemove.children[1].style.fontSize = "14px";
			toRemove.children[1].style.color = "#a9a9a9";
			
			setTimeout(()=>{
				toRemove.remove();
			},1200);
		});
		replyCount();
	});
};

const storyPic = (picNum, photo) => {
	let slide = document.createElement("div");
	slide.className = "slide";
	slide.style.height = photo+"px";
	slide.style.overflow = "hidden";
	slide.style.position = "relative";
	
	let width = picNum*photo;
	
	let slideContainer = document.createElement("div");
	slideContainer.className = "slideContainer";
	slideContainer.style.width = width;
	slideContainer.style.height = photo+"px";
	slideContainer.style.display = "flex";
	slideContainer.style.transition = "all 0.8s";
	
	slide.appendChild(slideContainer);
	
	return slide;
};


//스토리 사진 넘기는 버튼 이벤트
const nextBtnEvent = (nextBtn, photoWidth, slide, numOfImages) => {
	let temp = photoWidth;
	
	nextBtn.addEventListener("click", () => {
		if (temp < photoWidth*numOfImages) {
	        slide.style.transform = `translateX(-${temp}px)`;
	        temp += photoWidth;
		} else {
	        slide.style.transform = "translateX(0)";
	        temp = photoWidth;
		}
	});
};

const prevBtnEvent = (prevBtn, photoWidth, slide, numOfImages) => {
	let temp = photoWidth;
	
	prevBtn.addEventListener("click", () => {
		if (temp > photoWidth) {
	        slide.style.transform = `translateX(-${temp - photoWidth*2}px)`;
	        temp -= photoWidth;
		} else {
	        slide.style.transform = `translateX(-${photoWidth*(numOfImages-1)}px)`;
	        temp = photoWidth*numOfImages;
		}
	});
};

const removeCallback = className => {
	let getStory = document.querySelector("."+className);
	getStory.innerHTML = "삭제된 스토리 입니다."
	
	setTimeout(()=>{
		getStory.remove();
	},1200);
};

const modifyCallback = storynum => {
	//let getStory = document.querySelector(".m_write");
	location.href = "/story/modify/"+storynum;
};

const followBtn = (className, ifClick) => {
	document.querySelectorAll(className)
		.forEach(followTag => {
			followTag.style.display = ifClick?"none":"block";
		});
	document.querySelectorAll((className+"1"))
		.forEach(follow1Tag => {
			follow1Tag.style.display = ifClick?"block":"none";
		});
};


const box = (toCopy, num, appendTo) => {
	let reply = toCopy.cloneNode(true);
	let trTagClass = "reply"+num+" ";
	reply.removeAttribute('id');
	reply.className = trTagClass;
	
	appendTo.appendChild(reply);
	
	return reply;
};

//---------------------------------------------------------

const getStories = (search, loginUser, callback) => {
	search.keyword = search.keyword==null||search.keyword===''
	?'__nothing__':search.keyword;
	loginUser = loginUser==null||loginUser===''
	?'__nothing__':loginUser;
	
	$.getJSON(
		"/story/getStories/"+search.startNum+"/"+search.endNum+"/"
		+search.keyword+"/"+search.category+"/"+loginUser,
		function(data){
			callback(data);
		}
	)
};

const getReplies = (storynum, callback) => {
	$.getJSON(
		"/story_reply/reply/"+storynum,
		function(data){
			callback(data);
		}
	)
};

const getLikeList = (storyNum, callback) => {
	$.getJSON(
		"/story/likeList/"+storyNum,
		function(data){
			callback(data);
		}
	)
};

const registreply = (replyDTO, callback) => {
	$.ajax({
		type:"POST",
		url:"/story_reply/"+replyDTO.storyReplyWriter+"/"+replyDTO.storyReplyContents
		+"/"+replyDTO.storyNum,
		//data:JSON.stringify(replyDTO),
		data:{},
		//contentType:"application/json;charset=utf-8",
		success:function(result){
			callback(result);
		}
	});
};

const modifyreply = (replynum, newData, callback) => {
	$.ajax({
		type:"PATCH",
		url:"/story_reply/"+replynum+"/"+newData,
		//contentType:"application/json;charset=utf-8",
		success:function(result){
			callback(result);
		}
	});
};

const removereply = (replynum, callback) => {
	$.ajax({
		type:"DELETE",
		url:"/story_reply/"+replynum,
		//contentType:"application/json;charset=utf-8",
		success:function(result){
			callback(result);
		}
	});
};

const storyModifyOrRemove = (storynum, ifModifyOrRemove, callback) => {
	if(ifModifyOrRemove === 'remove'){
		$.ajax({
			type:"DELETE",
			url:"/story/"+storynum,
			//contentType:"application/json;charset=utf-8",
			success:function(result){
				callback(result);
			}
		});
	}else{
		console.log("modify");
		callback(storynum);
	}
};
const clickLikeM = (loginUser,storyNum, callback) => {
	$.ajax({
		type:"POST",
		url:"/story/clickLike/"+loginUser+"/"+storyNum,
		//contentType:"application/json;charset=utf-8",
		success:function(result){
			callback(result);
		}
	});
};
const cancelLikeM = (loginUser,storyNum, callback) => {
	$.ajax({
		type:"POST",
		url:"/story/cancelLike/"+loginUser+"/"+storyNum,
		//contentType:"application/json;charset=utf-8",
		success:function(result){
			callback(result);
		}
	});
};

const clickFollowing = (loginUser, whom, callback) => {
	console.log();
	$.ajax({
		type:"POST",
		url:"/story/clickFollow/"+loginUser+"/"+whom,
		//contentType:"application/json;charset=utf-8",
		success:function(result){
			callback(result);
		}
	});
};

const cancelFollow = (storyWriter, callback) => {
	$.ajax({
		type:"POST",
		url:"/story/cancelFollow/"+storyWriter,
		//contentType:"application/json;charset=utf-8",
		success:function(result){
			callback(result);
		}
	});
};

//------------------------------------------------------
const forReplyNums = []; //스토리 글 하나당 댓글 몇 개인지 담기
const likeCnt = [];
const loginUser = document.querySelector("#writeBtn").dataset.hiddenValue;
const getStoriesCallback = resultDataFromAjax => {
	//storyForm 복사
	let storyForms = copyStoryForm(resultDataFromAjax);
	let forReply = document.querySelector("#forReplyAndCopy");
	let forLike = document.querySelector("#box22");
	
	//[...] = 컬렉션이나 뭐 이상한 것들 배열로 만들어주기
	//Or Array.from(); 사용 가능

	//복사 -> 노드 추가
	[...resultDataFromAjax].forEach((obj, i) => {
		/*
		console.log("story: "+obj.story.storyNum); //하나의 스토리 안에 해당하는
		console.log("story: "+obj.story.storyCategory);
		console.log("story: "+obj.story.storyContents);
		console.log("story: "+obj.story.storyWriter);
		console.log("story: "+obj.story.storyLikes);
		console.log("story: "+obj.story.storyDate);
		console.log("story: "+obj.story.storyModifyCheck);
		
		[...obj.replies].forEach(r => { //댓글들
			console.log("\treply : "+r.replynum);
			console.log("\treply : "+r.userid);
			console.log("\treply : "+r.replycontents);
			console.log("\treply : "+r.boardnum);
			console.log("\treply : "+r.missingorstory);
			console.log("\treply : "+r.regdate);
			console.log("\treply : "+r.updatecheck);
		});
		
		[...obj.files].forEach(f => { //그리고 파일들
			console.log("\tfile : "+f.systemname);
			console.log("\tfile : "+f.orgname);
			console.log("\tfile : "+f.boardnum);
			console.log("\tfile : "+f.missingorstory);
		});
		*/
		
		let storyNum = obj.story.storyNum;
		let storyCategory = obj.story.storyCategory;
		let storyContents = obj.story.storyContents;
		let storyWriter = obj.story.storyWriter;
		let storyLikes = obj.story.storyLikes;
		let storyDate = obj.story.storyDate;
		let storyModifyCheck = obj.story.storyModifyCheck;
		let time = obj.forTime;
		
		let findTag = ".story"+obj.story.storyNum+" ";
		
		//let proimages = document.querySelector(findTag+".proimages");
		let userid = document.querySelectorAll(findTag+".userid"); //userid
		let storydate = document.querySelector(findTag+".storydate"); //userid
		let dot_sub = document.querySelector(findTag+".dot_sub");
		let pic = document.querySelector(findTag+".pic");
		let category = document.querySelector(findTag+".storycategory");
		let likecnt = document.querySelector(findTag+".storylike");
		//let uid = document.querySelector(findTag+".uid"); //userid
		let scontents1 = document.querySelector(findTag+".scontents1");
		let modify = document.querySelector(findTag+".modify");
		let replycnt1 = document.querySelector(findTag+".replycnt1");
		let seeAll = document.querySelector(findTag+".seeAll");
		let regist = document.querySelector(findTag+".regist");
		let likebox = document.querySelector(findTag+".likebox");
		let profil = document.querySelector(findTag+".profil");
 		let likeid1 = document.querySelector(".likeid1"); 		
		profil.classList.add(storyWriter);
		
		
		
		//기본 적인 내용 추가
		userid.innerHTML = storyWriter;
		storydate.innerHTML = time;
		
		if(loginUser === storyWriter){
			dot_sub.children[0].setAttribute("href", "javascript:storyModifyOrRemove("
				+storyNum+", 'modify', modifyCallback);");
			dot_sub.children[1].setAttribute("href", "javascript:storyModifyOrRemove("
				+storyNum+", 'remove', removeCallback);");
		}else{
			document.querySelector(findTag+".dot").style.display = "none";
		}
			
		const categoryName = storyCategory === "adoptReview"
			?"입양후기":"";
		category.innerHTML = "스토리 > "+categoryName;
		likecnt.innerHTML = "좋아요 "+storyLikes+"개";
		userid.forEach(id => {
			id.innerHTML = storyWriter;
		});
		scontents1.innerHTML = storyContents;
		modify.innerHTML = storyModifyCheck === 'x'
			? "" : "(수정됨)";
		
		//스토리 사진 ---------------------------------------------------
		let numOfPics = 0; //스토리 사진 몇장인지 검사
		const photo = 600; //스토리 사진 너비
		
		let getSlide = storyPic(obj.files.length, photo);
		[...obj.files].forEach((item, i) => {
		    let slideBox = document.createElement("div");
		    slideBox.className = "slideBox";
		    
		    let img = document.createElement("img");
		    img.src = '/story/thumbnail?systemname='
		    	+ item.systemName;
		    	
		    slideBox.appendChild(img);
		    getSlide.firstChild.appendChild(slideBox);
		    numOfPics++;
		});
		
		if(numOfPics>1){
			let nextBtn = document.createElement("div");
			let prevBtn = document.createElement("div");
			
			let nextBtnImg = document.createElement("img");
			let prevBtnImg = document.createElement("img");
			
			nextBtnImg.setAttribute("src", "/board/images/right.png");
			nextBtn.appendChild(nextBtnImg);
			nextBtn.className = "nextBtn";
			
			prevBtnImg.setAttribute("src", "/board/images/left.png");
			prevBtn.appendChild(prevBtnImg);
			prevBtn.className = "prevBtn";
			
			nextBtnEvent(nextBtn, photo, getSlide.firstChild, numOfPics);
			prevBtnEvent(prevBtn, photo, getSlide.firstChild, numOfPics);
			
			pic.appendChild(prevBtn);
			pic.appendChild(nextBtn);
		}
		
		pic.appendChild(getSlide);
		
		//댓글 시작 -------------------------------------------
		//댓글 갯수 담기, i = 각 스토리
		forReplyNums[i] = obj.replies.length;
		regist.addEventListener("keydown", e => {
			if(e.keyCode === 13){
				e.preventDefault();
				getReplyDTO(loginUser, regist.value, storyNum);
				
				registreply(replyDTO, result => {
					forReplyNums[i]++; //댓글 달면 +1

					let reply = box(forReply, result.storyReplyNum, replycnt1);
					
					reply.children[0].innerText = result.storyReplyWriter;
					reply.children[1].innerText = result.storyReplyContents;
					
					let replymodify = document.querySelector(findTag+"."+reply.className+".replymodify");
					let replyremove = document.querySelector(findTag+"."+reply.className+".replyremove");
					
					events();
					modifyReply(replymodify, reply.children[1], result.storyReplyNum);
					removeReply(replyremove, result.storyReplyNum
						, ()=>{
							forReplyNums[i] = forReplyNums[i] - 1;
							seeAll.innerHTML = "댓글 "+forReplyNums[i]+"개 더보기";
						});
					
					seeAll.innerHTML = "댓글 "+forReplyNums[i]+"개 모두보기";
				});
				regist.value = "";
			}
		});
		
		
		for(let i=0;i<obj.replies.length;i++){
			let replynum = [...obj.replies][i].storyReplyNum;
			
			let reply = box(forReply, replynum, replycnt1);
			
			reply.children[0].innerText = [...obj.replies][i].storyReplyWriter;
			reply.children[1].innerText = [...obj.replies][i].storyReplyContents;
			
			//수정, 삭제 기능
			let replymodify = document.querySelector(findTag+"."+reply.className+".replymodify");
			let replyremove = document.querySelector(findTag+"."+reply.className+".replyremove");
			
			//댓글 수정, 삭제 함수 다시 호출
			modifyReply(replymodify, reply.children[1], replynum);
			removeReply(replyremove, replynum
						, ()=>{
							obj.replies.length--;
							seeAll.innerHTML = "댓글 "+obj.replies.length+"개 모두보기";
						});
		}
		seeAll.innerHTML = "댓글 "+obj.replies.length+"개 모두보기";
		

        //좋아요 부분---------------------------------------------------
        likeCnt[i] = obj.story.storyLikes;
       let likeDefault = document.querySelector(findTag+".like");
		let cancelLike = document.querySelector(findTag+".like1");
        let likeCheck = obj.likeCheck;
		
        if(likeCheck){
			likeDefault.style.display = "none";
			cancelLike.style.display = "block";
		}
		else{
			likeDefault.style.display = "block";
			cancelLike.style.display = "none";
		}
		likeDefault.addEventListener("click", () => {
			clickLikeM(loginUser, storyNum, result => {

				likeCnt[i]++;
				let targetSelector = ".b";
				let targetElement = document.querySelector(targetSelector);

				if (targetElement) {
					let like_pf1 = document.createElement("div");
					let likeid1 = document.createElement("div");
					let img = document.createElement("img");
					img.setAttribute("src","/board/images/p1.png");
					like_pf1.appendChild(img);

					like_pf1.className = "like_pf1";
					likeid1.className = "likeid1";
					
					likeid1.innerHTML = loginUser;

					targetElement.appendChild(like_pf1);
					targetElement.appendChild(likeid1);
				} else {
					console.error("클래스 " + targetSelector + " 가 존재하지 않습니다.");
				}
				likecnt.innerHTML = "좋아요 " + likeCnt[i] + "개";
				console.log("좋아요 - " + result);
			});
		});
		cancelLike.addEventListener("click", () => {
			cancelLikeM(loginUser, storyNum, result => {
				likeCnt[i]--;
				let uid = document.querySelector('.'+loginUser);
				likecnt.innerHTML = "좋아요 "+likeCnt[i]+"개";
				console.log(uid);
				
				if(uid){
					 let r=uid.querySelector('.likeid');
					 let r1=uid.querySelector('.like_pf');
					 let img = r1.querySelector('img');
					 
					 uid.classList.remove(loginUser);
					 r.classList.remove('likeid'); // b 클래스를 제거합니다.
   					 r1.classList.remove('like_pf');
   					 r1.removeChild(img);
    				 r.innerHTML = ''; // 내용을 비웁니다.
				}
				else{
				let likeboxElement = document.querySelector('.likebox'); // likebox 요소를 선택합니다.
				let hrElement = likeboxElement.querySelector('.likeid1'); // b 클래스를 가진 hr 요소를 선택합니다.
				let hrElement1 = likeboxElement.querySelector('.like_pf1');
				
   				hrElement.classList.remove('likeid1'); // b 클래스를 제거합니다.
   				hrElement1.classList.remove('like_pf1');
   				hrElement1.removeChild(hrElement1.firstChild);
    			hrElement.innerHTML = ''; // 내용을 비웁니다.
				}
				/*likeid.innerHTML = likeid.innerHTML.replace(loginUser, '');*/
				console.log("좋아요 취소 - "+result);
				
			});
		});
		 
		getLikeList(storyNum, data => {
			data.reverse();
			for(let i=0; i<data.length; i++){
				let copiedLike = forLike.cloneNode(true);
        		copiedLike.id = "";
				copiedLike.classList.add("likke"+i);
				copiedLike.classList.add(data[i]);
				copiedLike.children[0].children[0].setAttribute("src","/board/images/p1.png");;
				copiedLike.children[1].innerHTML=data[i];
				if(data[i]==loginUser){
    				$(copiedLike.children[2]).css("display", "none");
				}
				likebox.appendChild(copiedLike);
				
			}
		});

	
		
        
		//팔로우 부분-------------------------------------------
		let followDefault = document.querySelector(findTag+".follow");
		let following = document.querySelector(findTag+".follow1");
		let followCheck = obj.followCheck;
		
		if(followCheck){
			followDefault.style.display = "none";
			following.style.display = "block";
		}
		if(loginUser === storyWriter){
			followDefault.style.display = "none";
		}
		
		followDefault.addEventListener("click", () => {
			clickFollowing(loginUser, storyWriter, result => {
				console.log("팔로우 - "+result);
				
				let check = document.querySelectorAll("."+storyWriter);
				if(check){
					followBtn(("."+storyWriter+" .follow"), true);
				}
			});
		});
		
		following.addEventListener("click", () => {
			cancelFollow(loginUser, result => {
				console.log("팔로우 취소 - "+result);
				
				let check = document.querySelectorAll("."+storyWriter);
				if(check){
					followBtn(("."+storyWriter+" .follow"), false);
				}
			});
		});
	});
	
	//복사한 storyForm들 display none해제
	for(let i=0;i<storyForms.length;i++){
		storyForms[i].style.display = "block";
	}
	events();
};

//페이지 로드 시 처음 ajax통신
window.onload = () => {
	getStories(forSearch, loginUser, getStoriesCallback);
};
























