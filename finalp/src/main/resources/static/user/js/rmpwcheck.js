$('#checkrmPwd').click(function() {
	let userid = document.querySelector("#userid").value;
        const checkPassword = $('#userpw').val();
        if(!checkPassword || checkPassword.trim() === ""){
            alert("비밀번호를 입력하세요.");
        } else{
            $.ajax({
                type: 'POST',
                url: '/user/rmpwck2/'+userid+"/"+checkPassword,
                //data: {'checkPassword': checkPassword},
                datatype: "text",
                success:function(result){
					if(result ==='o'){
						console.log("비밀번호 일치");
						window.location.href="/user/remove";
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