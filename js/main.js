import { fetchedData, loadData } from "./get_movies.js";

let backdrop_images = document.getElementsByClassName("movie-image");
let titles = document.getElementsByClassName("movie-title-text");
let grades = document.getElementsByClassName("movie-grade-text");
let release_dates = document.getElementsByClassName("movie-release-date-text");
let overviews = document.getElementsByClassName("movie-overview-text");

window.onload = function () {
    //DOMContentLoaded는 dom 트리를 완성하는 즉시 발생한다.
    //onload는 문서의 모든 콘텐츠(images, script, css, etc)가 로드되었을떄 발생한다, 즉
    //DOMContentLoaded가 onload보다 빨리 실행된다.
    CreateBasicDomTree();
    UiUdateBasedGetJsonData();
};

function CreateBasicDomTree() {
    let movie_container = document.getElementById("movie-container");
    movie_container.innerHTML = "";
    for (let i = 0; i < 20; i++) {
        const html = `<div class="movie-item flex-item bg-gray margin-10">
                <img class="movie-image" src="" alt="" />
                <div class="movie-second-div dp-column-flex margin-left-20">
                    <div class="movie-title text-color-white">
                        제목 : <span class="movie-title-text margin-10 text-color-white"></span>
                    </div>
                    <div class="movie-grade text-color-white">
                        평점 : <span class="movie-grade-text margin-10 text-color-white"></span>
                    </div>
                    <div class="movie-release-date text-color-white">
                        출시일 : <span class="movie-release-date-text margin-10 text-color-white"></span>
                    </div>
                    <div class="movie-overview dp-none">
                    줄거리 : <span class="movie-overview-text margin-10"></span>
                    </div>
                </div>
            </div>`;
        //innerHTML 요소는 단일 dom 요소에만 적용이 가능하다. 즉 class를 통한 선택자는 HTMLCollection이라는 유사 배열 객체를 반환하므로
        //id를 통한 선택함수나 querySelector를 통해 선택해야한다.
        movie_container.innerHTML += html;
    }
}

//영화 제목, overview, 사진 등을 이용한 flex-item 채우기
function UiUdateBasedGetJsonData() {
    loadData().then(() => {
        if (fetchedData) {
            let json_backdrop_path = fetchedData.results.map((item) => item["backdrop_path"]);
            let json_title = fetchedData.results.map((item) => item["title"]);
            let json_grade = fetchedData.results.map((item) => item["vote_average"]);
            let json_release_date = fetchedData.results.map((item) => item["release_date"]);
            let json_overview = fetchedData.results.map((item) => item["overview"]);
            HTMLcollectionTextUpdate(titles, json_title);
            HTMLcollectionTextUpdate(overviews, json_overview);
            HTMLcollectionTextUpdate(grades, json_grade);
            HTMLcollectionTextUpdate(release_dates, json_release_date);
            HTMLcollectionImageUpdate(backdrop_images, json_backdrop_path, 300);
        } else {
            console.log("데이터를 로드하지 못했습니다.");
        }
    });
}

function HTMLcollectionTextUpdate(htmlcollections, text_arr) {
    for (let i = 0; i < htmlcollections.length; i++) {
        htmlcollections[i].innerHTML = text_arr[i];
    }
}
function HTMLcollectionImageUpdate(htmlcollections, image_url_arr, size) {
    let url = "https://image.tmdb.org/t/p/w";

    for (let i = 0; i < htmlcollections.length; i++) {
        htmlcollections[i].src = url + size + image_url_arr[i];
        console.log(htmlcollections[i].src);
    }
}
//전체 사진 링크 : https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg // w500은 사진크기
//image 클릭으로 인한 modal 창을 띄우기
//어떻게 동적으로 생성하는 image에 event lister를 추가할 수 있을까?
//1) 동적으로 생성되는
//2) 기초부터 존재하는 상위 컨테이너에 이벤트리스터를 추가하고 해당 클릭 이벤트의 타겟을 살펴보고 이미지를 클릭하였을 경우에만 추가 작업을 진행

const container = document.getElementById("movie-container");
const modal = document.getElementById("movie-modal");
const modal_cancel_btn = document.getElementById("movie-modal-cancel-btn");

container.addEventListener("click", function (event) {
    let modal_image = document.getElementById("movie-modal-image");
    let modal_title = document.getElementById("movie-modal-title-text");
    let modal_grade = document.getElementById("movie-modal-grade-text");
    let modal_release_date = document.getElementById("movie-modal-release-date-text");
    let modal_overview = document.getElementById("movie-modal-overview-text");
    if (event.target.classList.contains("movie-image")) {
        modal.setAttribute("class", "po-fixed dp-block");
        if (!window.location.href.includes("#modal")) {
            history.pushState(null, null, location.pathname + "#modal"); // 히스토리 상태 추가 (URL에 #modal 추가)
            //사진을 여러번 클릭하는 경우 history가 중첩 가능해지는것을 방지
        }

        //console.log(111); 사진클릭만 적용되는것 확인
        //console.log(event);
        modal_image.src = event.target.currentSrc;
        let second_divs = event.target.nextElementSibling.children;
        modal_title.innerText = second_divs[0].children[0].innerText;
        modal_grade.innerText = second_divs[1].children[0].innerText;
        modal_release_date.innerText = second_divs[2].children[0].innerText;
        modal_overview.innerText = second_divs[3].children[0].innerText;
    }
});

modal_cancel_btn.addEventListener("click", closeModel);
//closeModel() 은 함수 참조가 아니라 함수 결과를 반환한다. -> 즉 해당 함수가 실행된 결과가 나타나게 된다...
function closeModel() {
    modal.setAttribute("class", "po-fixed dp-none");
    history.back();
}
window.addEventListener("popstate", () => {
    if (location.hash === "#modal") {
        modal.setAttribute("class", "po-fixed dp-block");
    } else {
        modal.setAttribute("class", "po-fixed dp-none");
    }
});
