"use strict";

function sign_up() {
    alert("회원가입!");
}

function sign_in() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()

    if (username == "") {
        alert("아이디를 입력해주세요.")
        $("#input-username").focus()
        return;
    }
    if (password == "") {
        alert("비밀번호를 입력해주세요.")
        $("#input-password").focus()
        return;
    }
    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            username_give: username,
            password_give: password
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            } else {
                alert(response['msg'])
                window.location.href = "/login"  //틀린값 입력시 url에 login ,password 값 남으면서 오류남 -> 코드 추가하여 해결
            }ㄴ
        }
    });
}

function sign_out() {
    $.removeCookie('mytoken', {path: '/'});
    alert('로그아웃 하였습니다.')
    window.location.href = "/login"
}