 let mainText = document.querySelector(".text2");
    let mainText1 = document.querySelector("#txt2");
    let mainText2 = document.querySelector(".text3");


    window.addEventListener("scroll", function () {
        let value = window.scrollY;
        console.log("scrollY",value);
       
        if (value <= 1000 && value >= 300) {
            mainText.style.animation = "slide1 1s ease-out "
        }
        else{
           mainText.style.animation = "back 1s ease-out forwards" 
        }
        
        
        if (value <= 1700 && value >= 1200) {
            mainText1.style.animation = "slide2 1s ease-out "
        }
        else{
            mainText1.style.animation = "back2 1s ease-out forwards"
        }

        if (value <= 2700 && value >= 1900) {
            mainText2.style.animation = "slide3 1s ease-out "
        }
        else{
            mainText2.style.animation = "back3 1s ease-out forwards"
        }
    })