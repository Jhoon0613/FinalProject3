

const getBoards = (pageNum, callback) => {
	$.getJSON(
		"/mboard/allList/"+pageNum,
		result => {
			callback(result);
		}
	);
};

let pageMove = 0;
let pageBtn = document.querySelectorAll(".changePage");
pageBtn.forEach(btn=>{
	btn.addEventListener("click", e=>{
		e.preventDefault();
		if(!btn.id){
			page(btn.textContent);
		}else{
			if(btn.textContent === '<')page(--pageMove);
			if(btn.textContent === '>')page(++pageMove);
		}
	});
});

const page = num => {
	getMyPosts.innerHTML = "";
	
	pageMove = num;

	let prevBtn = document.querySelector("#prevBtn");
	if(pageMove > 11){
		prevBtn.style.display = "inline-block";
	}
	if(pageMove < 11){
		prevBtn.style.display = "none";
	}

	let nextBtn = document.querySelector("#nextBtn");
	if(lastPage-(lastPage%10)+1 > pageMove-(pageMove%10)+1){
		nextBtn.style.display = "inline-block";
	}
	if(lastPage-(lastPage%10)+1 == pageMove-(pageMove%10)+1){
		nextBtn.style.display = "none";
	}
	
	getBoards(pageMove, result => {
		[...result].forEach(board => {
			let myPost = document.createElement("div");
			myPost.classList.add("fp_thumbnail_td");
			myPost.classList.add("board"+board.boardnum);
			
			let aTag = document.createElement("a");
			aTag.setAttribute("href",
				"/mboard/mget?&boardnum="+board.boardnum+"&page="+pageMove);
			
			let imgTag = document.createElement("img");
			imgTag.setAttribute("src",
				"/mboard/thumbnail?systemname="+board.systemname);
			imgTag.className = "fp_thumbnail";
			
			aTag.appendChild(imgTag);
			myPost.appendChild(aTag);
			getMyPosts.appendChild(myPost);
		});
	});
};

//-------------------------------------------------------
const pageNum = document.querySelector("#page").textContent;
const lastPage = document.querySelector("#lastPage").textContent;
const getMyPosts = document.querySelector(".fp_table");
window.onload = () => {
	page(pageNum);
};



















