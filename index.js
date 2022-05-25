
// ==UserScript==
// @name         nf招聘助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  1.推荐牛人，批量打招呼;支持BOSS、智联、前程
// @author       You
// @match        https://www.zhipin.com/*
// @match        https://rd5.zhaopin.com/*
// @match        https://ehire.51job.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    var retryCheck = function (
        checkFun,
        interval,
        nextFun,
        times,
        delay,
        startTime
    ) {
        if (!times) times = 1;
        else times += 1;
        if (!delay) delay = 0;
        if (!startTime) startTime = new Date().getTime();
        setTimeout(function () {
            if (checkFun(times)) {
                if (delay) {
                    var detal = delay - (new Date().getTime() - startTime);
                    if (detal > 0) setTimeout(nextFun, detal);
                    else nextFun();
                } else nextFun();
            } else retryCheck(checkFun, interval, nextFun, times, delay, startTime);
        }, interval);
    };
    var timmer = null;
    var bossHandle = function (e, isHandle = false) {
        let el = document.querySelector(".tools-btn");
        let checking = window.localStorage.getItem('toolChecking') === 'true' || false;
        console.log('checking', checking)
        if ((checking && !isHandle) || !checking) {
            if (timmer) {
                window.clearTimeout(timmer);
            }
            el.innerText = "自动打招呼";
            el.style.background = "#67C23A";
            checking = window.localStorage.setItem('toolChecking', false);
        } else {
            checking = window.localStorage.setItem('toolChecking', true);
            let lst = document.querySelectorAll(".job-list .job-primary");
            let ct = 1;
            let len = lst.length;
            function callFn() {
                if (len) {
                    let sel = lst[ct].querySelector(".btn.btn-startchat");
                    sel.click();
                    ct++;
                    el.style.background = "#E6A23C";
                    el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                } else {
                    console.log('列表为空');
                }
            }
            setInterval(() => {
                 callFn();
            }, 8000)
        }
    };
    ((_) => {
            console.log('load start')
            if(window.location.href.startsWith('https://www.zhipin.com/web/geek/chat')) {
                setTimeout(() => {
                    console.log('test setTimeout')
                    window.history.go(-1);
                }, 5000)
            }
            let el = document.createElement("button");
            el.setAttribute(
                "style",
                "width:140px;height:30px;border:0;color:#fff;background-color:#67C23A;cursor:pointer;outline: none;position: absolute; top: 0; left: 0;z-index:99999;"
            );
            el.setAttribute(
                "class",
                "tools-btn"
            )
            el.innerText = "自动打招呼";
            if (window.location.host === "www.zhipin.com") {
                if (
                    window.location.href.startsWith(
                        "https://www.zhipin.com/"
                    )
                ) {
                    retryCheck(
                        (_) => {
                            let lst = document.querySelectorAll(".job-list ul li .job-primary");
                            return lst && lst.length > 0;
                        },
                        100,
                        (_) => {
                            document.querySelector("body").appendChild(el);
                            ((_) => {
                                bossHandle(_, true);
                            })()
                            el.addEventListener(
                                "click",
                                bossHandle,
                                false
                            );
                        }
                    );
                }
            } else if (window.location.host === "rd5.zhaopin.com") {
                document.querySelector(".recommend__condition").appendChild(el);
                retryCheck(
                    (_) => {
                        let lst = document.querySelectorAll(".candidate-item__wrapper li");
                        return lst && lst.length > 0;
                    },
                    500,
                    (_) => {
                        let checking = null;
                        let timmer = null;
                        el.addEventListener(
                            "click",
                            function (e) {
                                if (checking) {
                                    window.clearInterval(checking);
                                    if (timmer) {
                                        window.clearTimeout(timmer);
                                    }
                                    el.innerText = "自动打招呼";
                                    el.style.background = "#67C23A";
                                    checking = null;
                                } else {
                                    let lst = document.querySelector(
                                        ".candidate-item__wrapper li"
                                    );
                                    let ct = 1;
                                    let hct = 0;
                                    function callrdFn() {
                                        if (lst) {
                                            lst.scrollIntoView(true);
                                            let sel = lst
                                                .querySelector(".candidate-item__button")
                                                .querySelector("button");
                                            if (sel && sel.innerText.includes("免费聊天")) {
                                                sel.click();
                                                lst.style.border = "1px solid #67C23A";
                                                hct++;
                                            } else {
                                                lst.style.border = "1px solid #F56C6C";
                                            }
                                            lst = lst.nextElementSibling;
                                            ct++;
                                            el.style.background = "#E6A23C";
                                            el.innerText = "停止打招呼(" + hct + "/" + ct + ")";
                                        } else {
                                            window.clearInterval(checking);
                                            el.style.background = "#67C23A";
                                            el.innerText = "自动打招呼(" + hct + "/" + ct + ")";
                                            checking = null;
                                        }
                                    }
                                    callrdFn();
                                    checking = window.setInterval((_) => {
                                        timmer = window.setTimeout((_) => {
                                            callrdFn();
                                            let chart = document
                                                .querySelector(".im-container.km-layout")
                                                .querySelector(".km-main");
                                            chart.style.display = "none";
                                        }, 1000 + Math.ceil(Math.random() * 4000));
                                    }, 2000);
                                }
                            },
                            false
                        );
                    }
                );
            } else if (window.location.host === "ehire.51job.com") {
                let cTimmer = null;
                function clearDialog() {
                    if (document.querySelector("#tip_msgbox2")) {
                        document.querySelector("#tip_msgbox2").style.display = "none";
                    }
                    if (document.querySelector("#DivBoxMaskTwo")) {
                        document.querySelector("#DivBoxMaskTwo").style.display = "none";
                    }
                    if (document.querySelector("#application")) {
                        document.querySelector("#application").style.display = "none";
                    }
                    if (document.querySelector("#chat_select_job")) {
                        document.querySelector("#chat_select_job").style.display = "none";
                    }
                    if (document.querySelector("#DivBoxMask")) {
                        document.querySelector("#DivBoxMask").style.display = "none";
                    }
                }
                setTimeout(() => {
                    el.className = "fr";
                    el.style.marginRight = "20px";
                    el.style.position = "fixed";
                    el.style.top = "100px";
                    el.style.right = "100px";
                    el.style.zIndex = "99999";
                    document.querySelector("body").appendChild(el);
                    let timmer = null;
                    let checking = null;
                    let pgL = document.querySelector(".position-page-numble").children;
                    let total = parseInt(pgL[pgL.length-2].innerHTML);
                    let nextBtn = document.getElementById("pagerBottomNew_nextButton");
                    let curPage = parseInt(document.querySelector(".position-page-numble").querySelector('a.active').innerHTML);

                    if (parseInt(sessionStorage.getItem("call_status")) !== 0) {
                        if (cTimmer) {
                            window.clearTimeout(cTimmer)
                        }
                    } else {
                        if (curPage >= total) {
                            window.clearInterval(checking);
                            window.clearTimeout(timmer);
                            window.clearTimeout(cTimmer);
                            el.style.background = "#67C23A";
                            el.innerText = "自动打招呼";
                            sessionStorage.setItem("call_status", 0);
                        }else{
                            cTimmer = setTimeout(() => {
                                renderCall();
                                el.innerText = "停止打招呼";
                                el.style.background = "#E6A23C";
                            }, 3000)
                        }
                    }
                    function renderCall() {
                        clearDialog();
                        let cLi = 0;
                        let cNum = document.querySelector("#search_resume_list ul").children.length;
                        let lst = document.querySelector("#search_resume_list li");
                        function call51Fn() {
                            if (cLi >= cNum) {
                                window.clearInterval(checking);
                                window.clearTimeout(timmer);
                                nextBtn.click();
                                return;
                            }
                            if (lst) {
                                lst.scrollIntoView(true);
                                let sel = lst.querySelector(".free-hichat");
                                if (sel && sel.innerText.includes("立即Hi聊")) {
                                    sel.click();
                                    let sendBtn = document.querySelector("#chat_select_job").querySelector(".ccd_footer div");
                                    sendBtn.click();
                                    lst.style.border = "1px solid #67C23A";
                                } else {
                                    lst.style.border = "1px solid #F56C6C";
                                }
                                cLi++;
                                lst = lst.nextSibling;
                                el.style.background = "#E6A23C";
                                el.innerText = "停止打招呼";
                            } else {
                                window.clearInterval(checking);
                                el.style.background = "#67C23A";
                                el.innerText = "自动打招呼";
                                checking = null;
                            }
                        }
                        call51Fn();
                        checking = window.setInterval((_) => {
                            timmer = window.setTimeout((_) => {
                                call51Fn();
                                clearDialog();
                            }, 1000 + Math.ceil(Math.random() * 4000));
                        }, 2000);

                    };
                    el.addEventListener(
                        "click",
                        function (e) {
                            if (e) {
                                e.preventDefault();
                            }
                            clearDialog();
                            let status = parseInt(sessionStorage.getItem("call_status"));
                            if (status) {
                                sessionStorage.setItem("call_status", 0);
                            } else {
                                sessionStorage.setItem("call_status", 1);
                            }
                            if (this.innerHTML == '停止打招呼') {
                                if (timmer) {
                                    window.clearTimeout(timmer);
                                }
                                if (cTimmer) {
                                    window.clearTimeout(cTimmer)
                                }
                                window.clearInterval(checking);
                                el.innerText = "自动打招呼";
                                el.style.background = "#67C23A";
                                checking = null;
                            } else {
                                renderCall();
                            }
                        },
                        false
                    );
                }, 3000)
            }
        }) ()
})();
