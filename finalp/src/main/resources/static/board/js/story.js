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


let startStoryNum = 0;
let endStoryNum = 5;


const copyStoryForm = obj => {
	let storyForms = [];
	
	for(let i=startStoryNum;i<obj.length+startStoryNum;i++){
		if(obj[i-startStoryNum]){
			const storyForm =
				document.querySelector("#storyform").cloneNode(true);
			storyForm.classList.add("story"+obj[i-startStoryNum].story.storyNum);
			storyForm.removeAttribute('id');
			
			storyForms[i-startStoryNum] = storyForm;
			stories.appendChild(storyForm);
		}else{
			break;
		}
	}
	return storyForms; //나중에 display none 전부 해제
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
const temp = document.querySelector("#writeBtn");
const loginUser = temp?.dataset.hiddenValue;
const getStoriesCallback = resultDataFromAjax => {
	//storyForm 복사
	let storyForms = copyStoryForm(resultDataFromAjax);
	let forReply = document.querySelector("#forReplyAndCopy");
	
	//[...] = 컬렉션이나 뭐 이상한 것들 배열로 만들어주기
	//Or Array.from(); 사용 가능

	if(storyForms.length == 0){
		console.log("없음");
		return;
	}
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
		
		let profil = document.querySelector(findTag+".profil");
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
				likecnt.innerHTML = "좋아요 "+likeCnt[i]+"개";
				console.log("좋아요 - "+result);
				
			});
		});
		
		cancelLike.addEventListener("click", () => {
			cancelLikeM(loginUser, storyNum, result => {
				
				likeCnt[i]--;
				likecnt.innerHTML = "좋아요 "+likeCnt[i]+"개";
				console.log("좋아요 취소 - "+result);
				
			});
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
	for(let i=startStoryNum;i<storyForms.length+startStoryNum;i++){
		storyForms[i-startStoryNum].style.display = "block";
	}
	events();
};


const forSearch = {
	startNum: startStoryNum,
	endNum : endStoryNum,
	keyword: "",
	category: "adoptReview"
};

const upStoryStartNum = length => {
	startStoryNum += length;
	endStoryNum += length;
	
	forSearch.startNum = startStoryNum;
	forSearch.endNum = endStoryNum;
};

//페이지 로드 시 처음 ajax통신
window.onload = () => {
	getStories(forSearch, loginUser, result=>{
		getStoriesCallback(result);
		upStoryStartNum(result.length);
	});
};

const windowScrollEvent = () => {
	const screenBottomeLine = window.innerHeight+window.scrollY;
	const bodyHeight = document.body.offsetHeight;
	
	if(screenBottomeLine>=bodyHeight-10){
		let promise = new Promise(resolve => {
			let div = document.createElement("div");
			div.className = "loader";
			
			let wrap = document.createElement("div");
			wrap.style.width = "120px";
			wrap.style.height = "120px";
			
			wrap.appendChild(div);
			stories.appendChild(wrap);
			
			setTimeout(()=>{
				stories.removeChild(wrap);
			},100);
			
			resolve();
		});
		
		promise.then(()=>{
			getStories(forSearch, loginUser, result => {
				if(result.length==0){
					window.removeEventListener("scroll", windowScrollEvent);
				}else{
					getStoriesCallback(result);
					upStoryStartNum(result.length);
				}
			});
		});
	}
};

window.addEventListener("scroll", windowScrollEvent);




















