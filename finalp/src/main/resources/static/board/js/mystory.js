const getNumberOfPostsFollow = (storyWriter, callback) => {
	fetch("/story/getMyStory/"+storyWriter)
		.then(reponse => {
			console.log("reponse: "+reponse);
			if(!reponse.ok){
				
			}
			return reponse.json();
		})
		.then(result => {
			callback(result);
		})
		.catch(error => {
			console.error("error: "+error);
		})
		.finally(()=>{
			console.log("finally()");
		});
};

const getWriter = document.querySelector(".info_id");
const forCopy = document.querySelector("#forCopy");
const list_box = document.querySelector(".list_box");

const numOfMyStories = document.querySelector("#numOfMyStories");
const numOfMyFollowers = document.querySelector("#numOfMyFollowers");
const numOfMyFollowings = document.querySelector("#numOfMyFollowings");

const viewDetail = document.querySelector("#cover");
const storyDetail = document.querySelector("#storyDetail");
const images = document.querySelector(".images");

const writer = document.querySelector("#writer");
const mid = document.querySelector("#mid");
const bottom = document.querySelector("#bottom");

const addEventHover = tag => {
	tag.addEventListener("click", () => {
		console.log(tag);
	});
};

const myStories = result => {
	let stories = result.myStories;
	
	let myStories = [];
	
	[...stories].forEach((story, i) => {
		myStories[i] = forCopy.cloneNode(true);
		myStories[i].classList.add("mystory"+i);
		myStories[i].removeAttribute("id");
		myStories[i].style.display = "inline-block";
		myStories[i].classList.add("hoverEvent");
		
		let post = myStories[i];
		
		let image = post.children[0];
		let systemname = story.files[0].systemName;
		
		let like = post.children[1].children[0].children[1];
		let reply = post.children[1].children[1].children[1];
		
		//각각의 story = Story_StoryBox
		
		//이미지
		image.setAttribute("src",
			"/story/thumbnail?systemname="+systemname);
			
		//좋아요 개수
		like.innerHTML = story.story.storyLikes;
		
		//댓글 개수
		reply.innerHTML = story.replies.length;
		
		
		list_box.appendChild(post);
		
		//스토리 클릭시
		post.addEventListener("click", ()=>{
			viewDetail.style.display = "block";
			storyDetail.style.display = "block";
			document.querySelector(".images").innerHTML = "";

			
			//이미지
			let numOfPics = 0; //스토리 사진 몇장인지 검사
			const photo = 480; //스토리 사진 너비
			
			let getSlide = storyPic(story.files.length, photo);
			[...story.files].forEach((item, i) => {
			    let slideBox = document.createElement("div");
			    slideBox.className = "slideBox";
			    
			    let img = document.createElement("img");
			    img.src = '/story/thumbnail?systemname='
			    	+ item.systemName;
		    	img.style.width = photo+"px";
			    	
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
				
				images.appendChild(prevBtn);
				images.appendChild(nextBtn);
			}
			
			images.appendChild(getSlide);	
			
			//이미지 옆 내용들
			writer.innerHTML = story.story.storyWriter;
			
			mid.children[0].innerHTML = story.story.storyContents;
			document.querySelector(".in_like").innerHTML
				= "좋아요 "+story.story.storyLikes+"개";
			document.querySelector(".in_reply").innerHTML
				= "댓글 "+story.replies.length+"개";
				
			//댓글 보여주기 bottom
			bottom.innerHTML = "";
			[...story.replies].forEach((reply, i)=>{
				let replyContainer = document.createElement("div");
				replyContainer.style.display = "flex";
				replyContainer.style.margin = "10px";
				
				let writerimage = document.createElement("img");
				let writer = document.createElement("div");
				let contents = document.createElement("div");
				
				writer.style.marginRight = "25px";
				writer.style.marginLeft = "5px";
				contents.style.color = "rgb(95, 95, 95)";
				
				writer.innerHTML = reply.storyReplyWriter;
				contents.innerHTML = reply.storyReplyContents;
				
				replyContainer.appendChild(writerimage);
				replyContainer.appendChild(writer);
				replyContainer.appendChild(contents);
				
				bottom.appendChild(replyContainer);
				if(i!=story.replies.length-1){
					let hrTag = document.createElement("hr");
					hrTag.style.border = "1px solid #D7E2F0";
					hrTag.style.width = "95%";
					hrTag.style.margin = "0 auto";
					bottom.appendChild(hrTag);
				}
			});
			
			//스크롤 제한
			document.body.style.overflow = "hidden";
		});
		
		viewDetail.addEventListener("click", ()=>{
			viewDetail.style.display = "none";
			storyDetail.style.display = "none";
			
			//스크롤 제한 해제
			document.body.style.overflow = "auto";
		});
	});
	
	myStories = null;
};

const myInfo = result => {
	let follwers = result.myFollowers;
	let followings = result.myFollowings;
	
	let postlength = result.myStories.length;
	let follwerslength = follwers.length;
	let follwingsslength = followings.length;
	
	numOfMyStories.innerHTML = "게시물 "+postlength;
	numOfMyFollowers.innerHTML = "팔로워 "+follwerslength;
	numOfMyFollowings.innerHTML = "팔로우 "+follwingsslength;
	
	/*addEventHover(numOfMyStories);
	addEventHover(numOfMyFollowers);
	addEventHover(numOfMyFollowings);*/
	
	myStories(result);
	
	result = null;
};

window.onload = ()=>{
	getNumberOfPostsFollow(getWriter.textContent, myInfo);
};

















