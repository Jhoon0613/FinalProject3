const userhobby = [];
let flag = false;
let pwTest = [false,false,false,false,false]
function sendit(){
    const joinForm = document.joinForm;
    
    const userid = joinForm.userid;
    if(userid.value == ""){
        alert("아이디를 입력하세요!")
        userid.focus();
        return false;
    }
    if(userid.value.length < 5 || userid.value.length > 12){
        alert("아이디는 5자 이상 12자 이하로 입력하세요!");
        userid.focus();
        return false;
    }
    
    const result = document.getElementById("result");
    if(result.innerHTML == "&nbsp;"){
    	alert("아이디 중복검사를 진행해주세요!");
    	userid.focus();
    	return false;
    }
    if(result.innerHTML == "중복된 아이디가 있습니다!"){
    	alert("중복체크 통과 후 가입이 가능합니다!");
    	userid.focus();
    	return false;
    }
    
    
    const userpw = document.joinForm.userpw;
    const userpw_re = document.joinForm.userpw_re;
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@-]).{4,}$/;
  	
  	if(userpw.value == ""){
		  alert("비밀번호를 입력하세요!");
		  userpw.focus();
		  return false;
	  }

	if(userpw.value.length < 8){
		alert("비밀번호는 8자 이상으로 작성해주세요!");
		userpw.focus();
		return false;
	}  	  

if(!reg.test(userpw.value)){
		alert("비밀번호는 8자 이상, 숫자, 대문자, 소문자, 특수문자를 모두 포함해야 합니다.");
		userpw.focus();
		return false;
	}
	if(userpw.value.search(" ") != -1){
		alert("비밀번호는 공백을 포함할 수 없습니다.");
		userpw.focus();
		return false;
	}
	if(userpw_re.value == ""){
		alert("비밀번호 확인을 해주세요.");
		userpw_re.focus();
		return false;
	}
	if(userpw.value != userpw_re.value){
		alert("비밀번호 확인을 다시 해주세요.");
		userpw.focus();
		return false;
	}
	
    const username = joinForm.username;
    if(username.value == ""){
        alert("이름을 입력하세요!");
        username.focus();
        return false;
    }
    const exp_name = /[가-힣]+$/;
    if(!exp_name.test(username.value)){
        alert("이름에는 한글만 입력하세요!");
        username.focus();
        return false;
    }
    const usergender = joinForm.usergender;
    if(!usergender[0].checked && !usergender[1].checked){
    	alert("성별을 선택하세요!");
    	return false;
    }
    const foreigner = joinForm.foreigner;
    if(!foreigner[0].checked && !foreigner[1].checked){
    	alert("국적을 선택하세요!");
    	return false;
    }
    
    const zipcode = joinForm.zipcode;
    if(zipcode.value == ""){
        alert("주소찾기를 진행해주세요!");
        sample6_execDaumPostcode();
        return false;
    }

    const addrdetail = joinForm.addrdetail;
    if(addrdetail.value == ""){
        alert("나머지 주소를 입력해주세요.")
        addrdetail.focus();
        return false;
    }
    
    const usernickname = joinForm.usernickname;
     
     if(usernickname.value == ""){
        alert("닉네임을 입력하세요!")
        usernickname.focus();
        return false;
    }
    if(usernickname.value.length < 2 || userid.value.length > 8){
        alert("닉네임은 2자 이상 8자 이하로 입력하세요!");
        usernickname.focus();
        return false;
    }
    
    const nresult = document.getElementById("nresult");
    
    if(nresult.innerHTML == "&nbsp;"){
    	alert("닉네임 중복검사를 진행해주세요!");
    	usernickname.focus();
    	return false;
    }
     if(nresult.innerHTML == "중복된 닉네임이 있습니다!"){
    	alert("중복체크 통과 후 가입이 가능합니다!");
    	usernickname.focus();
    	return false;
    }
    
    
    joinForm.submit();
    return true;
}
/*function pwcheck(){*/
/*    const userpw = document.joinForm.userpw;
    const userpw_re = document.joinForm.userpw_re;
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@-]).{4,}$/;
	
	if(!reg.test(userpw.value)){
		alert("비밀번호는 8자 이상, 숫자, 대문자, 소문자, 특수문자를 모두 포함해야 합니다.");
		userpw.focus();
		return false;
	}
	if(userpw.value.search(" ") != -1){
		alert("비밀번호는 공백을 포함할 수 없습니다.");
		userpw.focus();
		return false;
	}
	if(userpw_re.value == ""){
		alert("비밀번호 확인을 해주세요.");
		userpw_re.focus();
		return false;
	}
	if(userpw.value != userpw_re.value){
		alert("비밀번호 확인을 다시 해주세요.");
		userpw.focus();
		return false;
	}*/
	
function checkId(){
	const xhr = new XMLHttpRequest();
	const result = document.getElementById("result");
	const userid = document.joinForm.userid;
	if(userid.value == ""){
		alert("아이디를 입력하세요!")
		userid.focus();
		return false;
	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				let txt = xhr.responseText;
				txt = txt.trim();
				if(txt == 'O'){
					result.innerHTML = "사용할 수 있는 아이디입니다!";
					document.joinForm.userpw.focus();
				}
				else{
					result.innerHTML = "중복된 아이디가 있습니다!";
					userid.value = '';
					userid.focus();
				}
			}
		}
	}
	xhr.open("GET","/user/checkid?userid="+userid.value);
	xhr.send();
}
function ncheckId(){
	const xhr = new XMLHttpRequest();
	const nresult = document.getElementById("nresult");
	const usernickname = document.joinForm.usernickname;
	if(usernickname.value == ""){
		alert("닉네임을 입력하세요!")
		usernickname.focus();
		return false;
	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				let txt = xhr.responseText;
				txt = txt.trim();
				if(txt == 'O'){
					nresult.innerHTML = "사용할 수 있는 닉네임입니다!";
					document.joinForm.username.focus();
				}
				else{
					nresult.innerHTML = "중복된 닉네임이 있습니다!";
					usernickname.value = '';
					usernickname.focus();
				}
			}
		}
	}
	xhr.open("GET","/user/ncheckid?usernickname="+usernickname.value);
	xhr.send();
}
function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("sample6_extraAddress").value = extraAddr;
            
            } else {
                document.getElementById("sample6_extraAddress").value = '';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('sample6_postcode').value = data.zonecode;
            document.getElementById("sample6_address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("sample6_detailAddress").focus();
        }
    }).open();
}

var phonenum = document.getElementById('phonenum');

phonenum.addEventListener('input', function() {
    var value = this.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    var formattedValue = '';

    if (value.length <= 3) {
        formattedValue = value;
    } else if (value.length <= 7) {
        formattedValue = value.substr(0, 3) + '-' + value.substr(3);
    } else {
        formattedValue = value.substr(0, 3) + '-' + value.substr(3, 4) + '-' + value.substr(7);
    }

    this.value = formattedValue;
});

'use strict';

const form = document.querySelector('#joinForm');
const checkAll = document.querySelector('.terms__check__all input');
const checkBoxes = document.querySelectorAll('.input__check input');
const submitButton = document.querySelector('.submit');

const agreements = {
  termsOfService: false,
  privacyPolicy: false,
  allowPromotions: false,
};

form.addEventListener('submit', (e) => e.preventDefault()); // 새로고침(submit) 되는 것 막음

checkBoxes.forEach((item) => item.addEventListener('input', toggleCheckbox));

function toggleCheckbox(e) {
  const { checked, id } = e.target;  
  agreements[id] = checked;
  this.parentNode.classList.toggle('active');
  checkAllStatus();
  toggleSubmitButton();
}

function checkAllStatus() {
  const { termsOfService, privacyPolicy, allowPromotions } = agreements;
  if (termsOfService && privacyPolicy && allowPromotions) {
    checkAll.checked = true;
  } else {
    checkAll.checked = false;
  }
}

function toggleSubmitButton() {
  const { termsOfService, privacyPolicy } = agreements;
  const submitButton = document.querySelector('.submit');
  if (termsOfService && privacyPolicy) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

checkAll.addEventListener('click', (e) => {
  const { checked } = e.target;
  if (checked) {
    checkBoxes.forEach((item) => {
      item.checked = true;
      agreements[item.id] = true;
      item.parentNode.classList.add('active');
    });
  } else {
    checkBoxes.forEach((item) => {
      item.checked = false;
      agreements[item.id] = false;
      item.parentNode.classList.remove('active');
    });
  }
  toggleSubmitButton();
});


$(document).ready(function () {
  $("#checkAll").click(function () {
    $(".terms__list input[type=checkbox]").prop("checked", this.checked);
  });

  $(".terms__list input[type=checkbox]").click(function () {
    if ($(".terms__list input[type=checkbox]:checked").length == $(".terms__list input[type=checkbox]").length) {
      $("#checkAll").prop("checked", true);
    } else { 
      $("#checkAll").prop("checked", false);
    }
  });

  // 다른 이벤트 핸들러 등을 추가할 수 있습니다.
});
$(".c1").click(function(){   
    $(".contents").show();   
})

/* 프로필 사진 */
let i = 0;
	function upload(name) {
		$("#" + name).click();
	}
	//$(선택자).change(함수) : 해당 선택자의 요소에 변화가 일어난다면 넘겨주는 함수 호출
	$("[type='file']").change(function (e) {
		//e : 파일이 업로드된 상황 자체를 담고있는 객체
		//e.target : 파일이 업로드가 된 input[type=file] 객체(태그객체)
		//e.target.files : 파일태그에 업로드를 한 파일 객체들의 배열
		const file = e.target.files[0];
		const fileTag = e.target;

		if (file == undefined) {
			//파일이 업로드 되었다가 없어진 경우
			cancelFile(fileTag.id);
		}
		else {
			//파일이 없었다가 업로드 한 경우
			//#file0name
			$("#" + fileTag.id + "name").text(file.name);
			//업로드 된 파일의 확장자명
			let ext = file.name.split(".").pop();
			if (ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'webp') {
				$("." + fileTag.id + "_cont .thumbnail").remove();
				const reader = new FileReader();

				reader.onload = function (ie) {
					const img = document.createElement("img");
					img.setAttribute("src", ie.target.result)
					img.setAttribute("class", "thumbnail");
					document.querySelector("." + fileTag.id + "_cont").appendChild(img);
				}
				reader.readAsDataURL(file);
			}
			else {
				const temp = $("." + fileTag.id + "_cont .thumbnail");
				if (temp != null) {
					temp.remove();
				}
			}
			//가장 마지막 파일 선택 버튼을 눌렀을 때
			if (fileTag.id.split("e")[1] == i) {
				
				const cloneElement = $(".r" + i).clone(true);
				i++;
				cloneElement.appendTo("#joinForm > table > tbody > tr.r0.at")
				const lastElement = $("#joinForm > table > tbody > tr.r0.at").children().last();

				lastElement.attr("class", "r" + i + " at");
				lastElement.children("th").text("파일 첨부" + (i + 1)).hide();
				lastElement.children("td").attr("class", "file" + i + "_cont").hide();

				lastElement.find("input[type='file']").attr("name", "files").hide();
				lastElement.find("input[type='file']").attr("id", "file" + i).hide();
				lastElement.find("input[type='file']").val("").hide();

				lastElement.find("span").attr("id", "file" + i + "name").hide();
				lastElement.find("span").text("선택된 사진 없음").hide();

				lastElement.find("a")[0].href = "javascript:upload('file" + i + "')";
				lastElement.find("a")[1].href = "javascript:cancelFile('file" + i + "')"
			}
		}
	})

	function cancelFile(name) {
		//가장 마지막 첨부 삭제 버튼을 누른 경우
		if (name.split("e")[1] == i) {return;}
		//현재 업로드된 파일이 여러개일 때
		if (i != 0) {
			//tr지우기
			let temp = Number(name.split("e")[1]);
			//해당 행 지우기
			const defaultImagePath = "/user/images/id.png";
        	const defaultImageAlt = "Default Image";
			/*$(".r" + temp).remove();*/
			//지워진 다음 행 부터 숫자 바꿔주기
			for (let j = temp + 1; j <= i; j++) {
				const el = $("#joinForm tbody").find(".r" + j);
				el.attr("class", "r" + (j - 1) + " at");

				el.children('th').text("파일 첨부" + j);

				el.children('td').attr("class", "file" + (j - 1) + "_cont");

				const fileTag = el.find("input[type='file']");
				fileTag.attr("name", "files" + (j - 1));
				fileTag.attr("id", "file" + (j - 1));

				el.find("span").attr("id", "file" + (j - 1) + "name");

				el.find("a")[0].href = "javascript:upload('file" + (j - 1) + "')"
				el.find("a")[1].href = "javascript:cancelFile('file" + (j - 1) + "')"
				
				const defaultImage = document.createElement("img");
            	defaultImage.setAttribute("src", defaultImagePath);
            	defaultImage.setAttribute("alt", defaultImageAlt);
            	defaultImage.setAttribute("class", "thumbnail");
            	el.find("." + fileTag.id + "_cont").append(defaultImage);
			}
			i--;
		}
	}

