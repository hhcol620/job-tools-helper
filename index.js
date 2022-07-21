
// ==UserScript==
// @name         jobs-tools
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  1.boss直聘 自动打招呼 2.拉勾 自动投递简历 3.猎聘 自动打招呼 
// @author       You
// @match        https://www.zhipin.com/*
// @match        https://www.lagou.com/*
// @match        https://www.liepin.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    // 拉勾平台列表  __NEXT_DATA__.props.pageProps.initData.content.positionResult.result
    // 猎聘平台 document.querySelector('.chat-btn-box .ant-btn').click()

    let el = document.createElement("button");
    el.setAttribute(
        "style",
        "width:140px;height:30px;border:0;color:#fff;background-color:#67C23A;cursor:pointer;outline: none;position: absolute; top: 0; left: 0;z-index:99999;"
    );
    el.innerText = "自动打招呼";
    el.id = "jobs-tools";
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
    var bossHandle = function (e, isHandle = false) {
        let el = document.querySelector("#jobs-tools");
        console.log('el', el);
        let checking = window.localStorage.getItem('toolChecking') === 'true' || false;
        console.log('checking', checking)
        let closeHandle = () => {
            el.innerText = "自动打招呼";
            el.style.backgroundColor = "#67C23A";
            checking = window.localStorage.setItem('toolChecking', false);
        }
        let openHandle = () => {
            el.style.backgroundColor = "#E6A23C";
            let ct = +window.localStorage.getItem('job-ct') || 1;
            window.localStorage.setItem('toolChecking', true);
            let lst;
            if(window.location.href.startsWith('https://www.lagou.com/wn/jobs')) {
                console.log('拉勾助手');
                 lst = window.__NEXT_DATA__.props.pageProps.initData.content.positionResult.result;
                 let len = lst.length;
                 el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                function callFn() {
                    if (len) {
                        ct = +window.localStorage.getItem('job-ct') || 1;
                        let pId = lst[ct - 1].positionId;
                        el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                        window.open("https://www.lagou.com/wn/jobs/" + pId + ".html", "_blank")
                        ct++;
                        window.localStorage.setItem('job-ct', ct);
                        if(ct >= len) {
                            ct = 0;
                            window.localStorage.setItem('job-ct', ct);
                            document.querySelector('.lg-pagination-next').click();
                        }
                    } else {
                        console.log('列表为空');
                    }
                }
                setInterval(() => {
                    callFn();
                }, 6000)
            }
            else if (window.location.href.startsWith('https://www.liepin.com/zhaopin/')) {
                console.log('猎聘助手');
                lst = document.querySelectorAll(".left-list-box .job-list-item");
                let len = lst.length;
                el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                function callFn() {
                    if (len) {
                        let sel = lst[ct - 1].querySelector(".chat-btn-box button");
                        el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                        sel.click();
                        ct++;
                        window.localStorage.setItem('job-ct', ct);
                        if(ct >= len) {
                            ct = 0;
                            window.localStorage.setItem('job-ct', ct);
                            document.querySelector(".ant-pagination-next button").click()
                        }
                    } else {
                        console.log('列表为空');
                    }
                }
                setInterval(() => {
                    callFn();
                }, 3000);
            }
            else {
                lst = document.querySelectorAll(".job-list-box > li");
                let len = lst.length;
                console.log('lst=======', lst)
                el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                console.log('boss 直聘=================', ct, len)
                function callFn() {
                    if (len) {
                        if(ct >= len) {
                            ct = 0;
                            window.localStorage.setItem('job-ct', ct);
                            let next = document.querySelector(".options-pages > a:last-child");
                            console.log("next", next);
                            next.click();
                            location.reload();
                        }
                        let sel = lst[ct - 1].querySelector(".start-chat-btn");
                        sel.click();
                        setTimeout(() => {
                            location.reload();
                        })
                        ct++;
                        window.localStorage.setItem('job-ct', ct);
                    } else {
                        console.log('列表为空');
                    }
                }
                setTimeout(() => {
                    callFn();
                }, 6000)
            }
        }
        if(isHandle) {
             if ((checking)) {
                openHandle();
             } else {
                closeHandle();
             }
        } else {
            if ((checking)) {
                closeHandle();
            } else {
                openHandle();
            }
        }
    };
    ((_) => {
            console.log('jobs tools start ============================================');
            if(window.location.href.startsWith('https://www.zhipin.com/web/geek/chat')) {
                setTimeout(() => {
                    console.log('test setTimeout')
                    window.history.go(-1);
                }, 5000)
            }
            if(window.location.href.startsWith('https://www.lagou.com/wn/jobs')) {
                let reg = /https:\/\/www.lagou.com\/wn\/jobs\/\d+.+/
                if(reg.exec(window.location.href) !== null) {
                    setTimeout(() => {
                        // 发送简历
                        document.querySelector('.btn.fr.btn_apply').click()
                    }, 1000)
                    setTimeout(() => {
                        window.close();
                    }, 2000)
                }
            }
            if (window.location.host === "www.zhipin.com") {
                if (
                    window.location.href.startsWith(
                        "https://www.zhipin.com/"
                    )
                ) {
                    retryCheck(
                        (_) => {
                            let lst = document.querySelectorAll(".job-list-box > li");
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
            }
            if (window.location.host === "www.lagou.com") {
                if (
                    window.location.href.startsWith(
                        "https://www.lagou.com/"
                    )
                ) {
                    retryCheck(
                        (_) => {
                            let lst = window.__NEXT_DATA__.props.pageProps.initData.content.positionResult.result;
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
            }
            if (window.location.host === "www.liepin.com") {
                if (
                    window.location.href.startsWith(
                        "https://www.liepin.com/"
                    )
                ) {
                    retryCheck(
                        (_) => {
                            let lst = document.querySelectorAll(".left-list-box .job-list-item");
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
            }
        }) ()
})();
