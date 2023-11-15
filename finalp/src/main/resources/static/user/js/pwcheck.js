$('#checkPwd').click(function() {
	let userid = document.querySelector("#userid").value;
        const checkPassword = $('#userpw').val();
        if(!checkPassword || checkPassword.trim() === ""){
            alert("비밀번호를 입력하세요.");
        } else{
            $.ajax({
                type: 'POST',
                url: '/user/pwck2/'+userid+"/"+checkPassword,
                //data: {'checkPassword': checkPassword},
                datatype: "text",
                success:function(result){
					if(result ==='o'){
						console.log("비밀번호 일치");
						window.location.href="/user/pwmodify";
					}else{
						console.log("비밀번호 틀림");
		                // 비밀번호가 일치하지 않으면
		                alert("비밀번호가 맞지 않습니다.");
		                window.location.reload();
					}
				}
            })
        }
    });
    
    function pwsendit(){
    const pwmodifyForm = document.pwmodifyForm;
const userpw = document.pwmodifyForm.userpw;
    const userpw_re = document.pwmodifyForm.userpw_re;
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
	alert("비밀번호 변경 완료")
	pwmodifyForm.submit();
    return true;
}