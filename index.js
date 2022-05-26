
// ==UserScript==
// @name         jobs-tools
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  1.推荐牛人，批量打招呼;支持BOSS
// @description  2.拉勾自动投递简历
// @author       You
// @match        https://www.zhipin.com/*
// @match        https://www.lagou.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    // 拉勾平台列表  __NEXT_DATA__.props.pageProps.initData.content.positionResult.result
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
        let el = document.querySelector(".tools-btn");
        let checking = window.localStorage.getItem('toolChecking') === 'true' || false;
        console.log('checking', checking)
        let closeHandle = () => {
            el.innerText = "自动打招呼";
            el.style.background = "#67C23A";
            checking = window.localStorage.setItem('toolChecking', false);
        }
        let openHandle = () => {
            el.style.background = "#E6A23C";
            let ct = +window.localStorage.getItem('job-ct') || 1;
            window.localStorage.setItem('toolChecking', true);
            let lst = 0;
            if(window.location.href.startsWith('https://www.lagou.com/wn/jobs')) {
                console.log('拉勾')
                 lst = window.__NEXT_DATA__.props.pageProps.initData.content.positionResult.result;
                 let len = lst.length;
                 el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                function callFn() {
                    if (len) {
                        let pId = lst[ct - 1].positionId;
                        el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                        window.open("https://www.lagou.com/wn/jobs/" + pId + ".html", "_blank")
                        ct++;
                        window.localStorage.setItem('job-ct', ct);
                        if(ct >= len) {
                            let next = document.querySelector(".lg-pagination-item-link");
                            ct = 0;
                            window.localStorage.setItem('job-ct', ct);
                            next.click();
                        }
                    } else {
                        console.log('列表为空');
                    }
                }
                setInterval(() => {
                    callFn();
                }, 6000)
            } else {
                lst = document.querySelectorAll(".job-list .job-primary");
                let len = lst.length;
                el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                function callFn() {
                    if (len) {
                        let sel = lst[ct - 1].querySelector(".btn.btn-startchat");
                        el.innerText = "停止打招呼(" + ct + "/" + len + ")";
                        sel.click();
                        ct++;
                        if(ct >= len) {
                            let next = document.querySelector(".next");
                            console.log("next", next);
                            ct = 0;
                            window.localStorage.setItem('job-ct', ct);
                            next.click();
                        }
                        window.localStorage.setItem('job-ct', ct);
                    } else {
                        console.log('列表为空');
                    }
                }
                setInterval(() => {
                    callFn();
                }, 8000)
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
            console.log('jobs tools start');
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
        }) ()
})();
