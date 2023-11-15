    Kakao.init('bfbacab1c5740af76ffb2ab4cf215847'); //발급받은 키 중 javascript키를 사용해준다.
    console.log(Kakao.isInitialized()); // sdk초기화여부판단
    //카카오로그인
    function kakaoLogin() {
        Kakao.Auth.login({
          success: function (response) {
            Kakao.API.request({
              url: '/v2/user/me',
              success: function (response) {
                  console.log(response)
              },
              fail: function (error) {
                console.log(error)
              },
            })
          },
          fail: function (error) {
            console.log(error)
          },
        })
      }
    //카카오로그아웃  
    function kakaoLogout() {
        if (Kakao.Auth.getAccessToken()) {
          Kakao.API.request({
            url: '/v1/user/unlink',
            success: function (response) {
                console.log(response)
            },
            fail: function (error) {
              console.log(error)
            },
          })
          Kakao.Auth.setAccessToken(undefined)
        }
      }  
    
    //기존 로그인 상태를 가져오기 위해 Facebook에 대한 호출
    function statusChangeCallback(res){
        statusChangeCallback(response);
    }
    
    function fnFbCustomLogin(){
        FB.login(function(response) {
            if (response.status === 'connected') {
                FB.api('/me', 'get', {fields: 'name,email'}, function(r) {
                    console.log(r);
                })
            } else if (response.status === 'not_authorized') {
                // 사람은 Facebook에 로그인했지만 앱에는 로그인하지 않았습니다.
                alert('앱에 로그인해야 이용가능한 기능입니다.');
            } else {
                // 그 사람은 Facebook에 로그인하지 않았으므로이 앱에 로그인했는지 여부는 확실하지 않습니다.
                alert('페이스북에 로그인해야 이용가능한 기능입니다.');
            }
        }, {scope: 'public_profile,email'});
    }
    
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '347817944360978', // 내 앱 ID를 입력한다.
            cookie     : true,
            xfbml      : true,
            version    : 'v10.0'
        });
        FB.AppEvents.logPageView();   
    };
    
    //반드시 중간에 본인의 앱아이디를 입력하셔야 합니다.
    
    function init() {
	gapi.load('auth2', function() {
		gapi.auth2.init();
		options = new gapi.auth2.SigninOptionsBuilder();
		options.setPrompt('select_account');
        // 추가는 Oauth 승인 권한 추가 후 띄어쓰기 기준으로 추가
		options.setScope('email profile openid https://www.googleapis.com/auth/user.birthday.read');
        // 인스턴스의 함수 호출 - element에 로그인 기능 추가
        // GgCustomLogin은 li태그안에 있는 ID, 위에 설정한 options와 아래 성공,실패시 실행하는 함수들
		gapi.auth2.getAuthInstance().attachClickHandler('GgCustomLogin', options, onSignIn, onSignInFailure);
	})
}

function onSignIn(googleUser) {
	var access_token = googleUser.getAuthResponse().access_token
	$.ajax({
    	// people api를 이용하여 프로필 및 생년월일에 대한 선택동의후 가져온다.
		url: 'https://people.googleapis.com/v1/people/me'
        // key에 자신의 API 키를 넣습니다.
		, data: {personFields:'birthdays', key:'AIzaSyASNOVdOSRkBCUsESKfZsPBHbeQf5Y1VwQ', 'access_token': access_token}
		, method:'GET'
	})
	.done(function(e){
        //프로필을 가져온다.
		var profile = googleUser.getBasicProfile();
		console.log(profile)
	})
	.fail(function(e){
		console.log(e);
	})
}
function onSignInFailure(t){		
	console.log(t);
}
    
    // 네이버 스크립트 
    
    
    var naverLogin = new naver.LoginWithNaverId(
            {
                clientId: "lP2_2G6HlKlaTfuM7Lym", //내 애플리케이션 정보에 cliendId를 입력해줍니다.
                callbackUrl: "http://localhost:8080/naver-login", // 내 애플리케이션 API설정의 Callback URL 을 입력해줍니다.
                isPopup: false,
                callbackHandle: true
            }
        );	
    
    naverLogin.init();
    
    window.addEventListener('load', function () {
        naverLogin.getLoginStatus(function (status) {
            if (status) {
                var email = naverLogin.user.getEmail(); // 필수로 설정할것을 받아와 아래처럼 조건문을 줍니다.
                
                console.log(naverLogin.user); 
                
                if( email == undefined || email == null) {
                    alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
                    naverLogin.reprompt();
                    return;
                }
            } else {
                console.log("callback 처리에 실패하였습니다.");
            }
        });
    });
    
    
    var testPopUp;
    function openPopUp() {
        testPopUp= window.open("https://nid.naver.com/nidlogin.logout", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=1,height=1");
    }
    function closePopUp(){
        testPopUp.close();
    }
    
    function naverLogout() {
        openPopUp();
        setTimeout(function() {
            closePopUp();
            }, 1000);
        
        
    }
    
    
        function sendit(){
            const loginForm = document.loginForm;
            const userid = loginForm.userid;
            const userpw = loginForm.userpw;
            
            if(userid.value == ""){
                alert("아이디를 입력하세요!");
                return false;
            }
            if(userpw.value == ""){
                alert("비밀번호를 입력하세요!");
                return false;
            }
            return true;
        }
