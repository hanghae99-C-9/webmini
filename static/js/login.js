"use strict";
const checkUpBtn = document.getElementById("checkUpBtn");
const signupBtn = document.getElementById("signupBtn");
// 정규식
function is_nickname(asValue) {
  var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
  return regExp.test(asValue);
}
function is_password(asValue) {
  var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
  return regExp.test(asValue);
}



checkUpBtn.addEventListener("click", function (event) {
  event.preventDefault();
  let username = $("#input-username").val();
  if (username == "") {
    $("#help-id")
      .text("아이디를 입력해주세요.")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-username").focus();
    return;
  }
  if (!is_nickname(username)) {
    $("#help-id")
      .text("영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-username").focus();
    return;
  }
  $("#help-id").addClass("is-loading");
  $.ajax({
    type: "POST",
    url: "/sign_up/check_dup",
    data: {
      username_give: username,
    },
    success: function (response) {
      if (response["exists"]) {
        $("#help-id")
          .text("이미 존재하는 아이디입니다.")
          .removeClass("is-safe")
          .addClass("is-danger");
        $("#input-username").focus();
      } else {
        $("#help-id")
          .text("사용할 수 있는 아이디입니다.")
          .removeClass("is-danger")
          .addClass("is-success");
      }
      $("#help-id").removeClass("is-loading");
    },
  });
});

// signin 버튼 클릭 후
// 회원가입 조건이 충족 되었을 때
// login페이지로 넘어감
signupBtn.addEventListener("click", function (event) {
  event.preventDefault();
  let username = $("#input-username").val();
  let password = $("#input-password").val();
  let password2 = $("#input-password2").val();

  if ($("#help-id").hasClass("is-danger")) {
    alert("아이디를 다시 확인해주세요.");
    return;
  } else if (!$("#help-id").hasClass("is-success")) {
    alert("아이디 중복확인을 해주세요.");
    return;
  }

  if (password == "") {
    $("#help-password")
      .text("비밀번호를 입력해주세요.")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-password").focus();
    return;
  } else if (!is_password(password)) {
    $("#help-password")
      .text(
        "비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자"
      )
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-password").focus();
    return;
  } else {
    $("#help-password")
      .text("사용할 수 있는 비밀번호입니다.")
      .removeClass("is-danger")
      .addClass("is-success");
  }
  if (password2 == "") {
    $("#help-password2")
      .text("비밀번호를 입력해주세요.")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-password2").focus();
    return;
  } else if (password2 != password) {
    $("#help-password2")
      .text("비밀번호가 일치하지 않습니다.")
      .removeClass("is-safe")
      .addClass("is-danger");
    $("#input-password2").focus();
    return;
  } else {
    $("#help-password2")
      .text("비밀번호가 일치합니다.")
      .removeClass("is-danger")
      .addClass("is-success");
  }

  //  테스트 통과했음 저장해줘!
  $.ajax({
    type: "POST",
    url: "/sign_up/save",
    data: {
      username_give: username,
      password_give: password,
    },
    success: function (response) {
      alert("회원가입을 축하드립니다!");
      $("#chk").prop("checked", true);
      $("input").val("");
      $("#help-id").removeClass("is-success");
      $("#help-password").removeClass("is-success");
      $("#help-password2").removeClass("is-success");
    },
  });
});

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
            }
        }
    });
}

function sign_out() {
    $.removeCookie('mytoken', {path: '/'});
    alert('로그아웃 하였습니다.')
    window.location.href = "/login"
}

