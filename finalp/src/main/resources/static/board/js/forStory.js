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